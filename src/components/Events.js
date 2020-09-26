import React, { Component } from 'react'
import { Container, Button, Header, Image, Modal } from 'semantic-ui-react'

export class Events extends Component {
  state = {
    openModal: null
  }

  componentDidMount() {

  }

  submit = () => {
    fetch("http://192.168.43.113:3000/park/addItem", {
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
        "coordinates": this.state.coordinates,
        "restrictions": {
          "age": this.state.age,
          "description": this.state.restDescription,
          "height": this.state.height
        },
        "prices": {
          "child": this.state.price_child,
          "man": this.state.price_parent
        },
        "pays": []
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

  render() {
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
          <Modal.Content image>
            <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>
                We've found the following gravatar image associated with your e-mail
                address.
              </p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => {
                this.setState({ openModal: false })
              }}>
              Nope
            </Button>
            <Button
              content="Yep, that's me"
              labelPosition='right'
              icon='checkmark'
              onClick={() => {
                this.setState({ openModal: false })
              }}
              positive
            />
          </Modal.Actions>
        </Modal>
      </Container>
    )
  }
}

export default Events
