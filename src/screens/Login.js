import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

export class Login extends Component {
  state = {
    email: '',
    password: ''
  }
  
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  submit = () => {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/login", {
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.type === 'ok'){
        localStorage.setItem("user_id", data.result._id)
      }else{
        alert('Неверные данные')
      }
    })
    .catch(err => {
      alert('Неверные данные')
      console.error(err);
    });
  }
  
  render() {
    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            Войдите в парковед
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
              <Button color='teal' fluid size='large' onClick={this.submit}>
                Войти
              </Button>
            </Segment>
          </Form>
          <Message>
            Не зарегистрированы? <a href='#'>Добавить парк</a>
          </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
