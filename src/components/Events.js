import React, { Component } from 'react'
import { Container, Button, Header, Icon, Modal, Form, Table } from 'semantic-ui-react'
import AddParkMap from '../components/AddParkMap'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

export class Events extends Component {
  state = {
    openModal: null,
    images: [null, null, null],
    date: new Date()
  }

  componentDidMount() {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/getEvents")
    .then(response => response.json())
    .then(data => this.setState({ events: data.result }))
  }

  submit = () => {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/addEvent", {
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": JSON.stringify({
        "park_id": localStorage.getItem("user_id"),
        "name": this.state.name,
        "description": this.state.description,
        "images": this.state.images.filter((item) => item !== 'null'),
        "icon": this.state.icon,
        "coordinates": this.state.marker1,
        "date": this.state.date 
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.type === 'ok'){
        alert("Успешно!")
        window.location.reload()
      }else{
        alert('Ошибка! Попробуйте позже')
      }
    })
    .catch(err => {
      console.error(err);
    });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });


  chooseImage = async () => {
    const file = document.querySelector('#file').files[0];
    const result = await this.toBase64(file).catch(e => Error(e));
    if(result instanceof Error) {
       console.log('Error: ', result.message);
       return;
    }
    let { images } = this.state
    console.log(this.state.clickedBtn)
    images[this.state.clickedBtn] = result
    this.setState({ images })
  }

  onChange = e => {
    this.setState({
      [e.currentTarget.name]: e.currentTarget.value
    })
  }

  render() {
    const { events, date } = this.state
    return (
      <Container>
        <Modal
          onClose={() => {
            this.setState({ openModal: false })
          }}
          onOpen={() => {
            this.setState({ openModal: true })
          }}
          open={this.state.openModal}
          trigger={<Button primary>Добавить мероприятие</Button>}
        >
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                name="name"
                placeholder="Название"
                onChange={this.onChange}
              />
              <Form.TextArea
                name="description"
                placeholder="Описание"
                onChange={this.onChange}
              />
              <DatePicker
                selected={date}
                onChange={date => this.setState({ date })}
                showTimeSelect
                dateFormat="MMMM d, yyyy h:mm aa"
              />
              <Form.Group widths={16}>
                {
                  this.state.images && (
                    this.state.images.map((item, index) => 
                      item ? <img style={{
                        width: '30%',
                        padding: 10
                      }} src={item}/> : 
                      <Button icon fluid onClick={() => {
                        this.setState({ clickedBtn: index })
                        document.getElementById("file").click()
                      }}>
                        <Icon name='camera' />
                      </Button>
                    )
                  )
                }
                <input type="file" id="file" onChange={this.chooseImage} style={{
                  display: 'none'
                }} />
              </Form.Group>
              <Header>Место проведения</Header>
              <AddParkMap
                marker2={null}
                onChange={(marker1) => {
                  this.setState({ marker1 })
                }}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => {
                this.setState({ openModal: false })
              }}>
              Закрыть
            </Button>
            <Button
              content="Добавить"
              labelPosition='right'
              icon='checkmark'
              disabled={
                !this.state.name ||
                !this.state.description ||
                !this.state.marker1 ||
                !this.state.images.filter((item) => item).length > 2
              }
              onClick={this.submit}
              positive
            />
          </Modal.Actions>
        </Modal>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Описание</Table.HeaderCell>
              <Table.HeaderCell>Дата</Table.HeaderCell>
              <Table.HeaderCell>Картинки</Table.HeaderCell>
              <Table.HeaderCell>Координаты</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              events && (
                events.map((item) => 
                  <Table.Row>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>{item.date}</Table.Cell>
                    <Table.Cell>{item.images.filter((img) => img).map((img) => <img src={img} width={100} />)}</Table.Cell>
                    <Table.Cell>{item.coordinates.lat},{item.coordinates.lng}</Table.Cell>
                  </Table.Row>
                )
              )
            }
          </Table.Body>
        </Table>
      </Container>
    )
  }
}

export default Events
