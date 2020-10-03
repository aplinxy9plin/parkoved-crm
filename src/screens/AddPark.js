import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment, Select } from 'semantic-ui-react'
import _ from 'lodash'

import AddParkMap from '../components/AddParkMap'

export class Login extends Component {
  state = {
    "email": "",
    "password": "",
    "park_name": "",
    "time": ["10:00", "22:00"],
    "map": {
      "coordinates": [
        {
          "lat": null,
          "lng": null
        },
        {
          "lat": null,
          "lng": null
        }	
      ]
    },
    marker1: {
      lat: 56.4740589,
      lng: 84.9528123
    },
    marker2: {
      lat: 56.474574,
      lng: 84.9528123
    },
  }
  
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  submit = () => {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/add", {
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": JSON.stringify({
        "email": this.state.email,
        "password": this.state.password,
        "park_name": this.state.park_name,
        "time": this.state.time,
        "map": {
          "coordinates": [
            this.state.marker1, this.state.marker2
          ]
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.type === 'ok'){
        console.log(data)
        localStorage.setItem("user_id", data.id)
        window.location.href="/"
      }else{
        alert("Проверьте поля.")
      }
    })
    .catch(err => {
      console.error(err);
      alert("Проверьте поля.")
    });
  }
  
  render() {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Добавить парк
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail' onChange={this.onChange} name="email" />
              <Form.Input
                name="password"
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Пароль'
                type='password'
                onChange={this.onChange}
              />
              <Form.Input
                name="park_name"
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Название парка'
                onChange={this.onChange}
              />
              <Header>Открытие/закрытие парка</Header>
              <Form.Group>
                <Select
                  defaultValue="10:00"
                  options={_.times(24, (i) => {{
                    return {
                      text: i+":00",
                      key: i+":00",
                      value: i+":00"
                    }
                  }})}
                  onChange={(e) => {
                    let {time} = this.state
                    time[0] = e.currentTarget.innerText
                    this.setState({ time })
                  }}
                />
                <Select
                  defaultValue="22:00"
                  options={_.times(24, (i) => {{
                    return {
                      text: i+":00",
                      key: i+":00",
                      value: i+":00"
                    }
                  }})}
                  onChange={(e) => {
                    let {time} = this.state
                    time[1] = e.currentTarget.innerText
                    this.setState({ time })
                  }}
                />
              </Form.Group>
              <AddParkMap
                marker1={this.state.marker1}
                marker2={this.state.marker2}
                onChange={(marker1, marker2) => {
                  this.setState({ marker1, marker2})
                }}
              />
              <br />
              <Button color='teal' fluid size='large' onClick={this.submit}>
                Добавить парк
              </Button>
            </Segment>
          </Form>
          <Message>
            Зарегистрированы? <a href='/login'>Войти</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
