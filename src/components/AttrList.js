import React, { Component } from 'react'
import { Button, Header, Image, Table, Modal } from 'semantic-ui-react'
import QRCode from 'qrcode'

export class AttrList extends Component {
  state = {
    items: null
  }
  componentDidMount() {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/getItems/"+localStorage.getItem("user_id"))
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.type === 'ok'){
        this.setState({
          items: data.result
        })
      }else{
        window.location.href = "/login"
      }
    })
    .catch(err => {
      // window.location.href = "/login"
      console.error(err);
    });
  }
  
  generateQR = async e => {
    try {
      const base64QR = await QRCode.toDataURL(e.currentTarget.id)
      this.setState({
        qrModal: true,
        currentQR: base64QR
      })
    } catch (err) {
      console.error(err)
    }
  }  

  render() {
    return (
      <div>
        <Table basic='very' celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Название</Table.HeaderCell>
              <Table.HeaderCell>Тип</Table.HeaderCell>
              <Table.HeaderCell>Описание</Table.HeaderCell>
              <Table.HeaderCell>Возраст</Table.HeaderCell>
              <Table.HeaderCell>Рост</Table.HeaderCell>
              <Table.HeaderCell>Доп. ограничения</Table.HeaderCell>
              <Table.HeaderCell>Цены</Table.HeaderCell>
              <Table.HeaderCell>Координаты</Table.HeaderCell>
              <Table.HeaderCell>QR код</Table.HeaderCell>
              <Table.HeaderCell>Удалить</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              this.state.items && (
                this.state.items.map((item) => 
                  <Table.Row>
                    <Table.Cell>
                      <Header as='h4' image>
                        <Image src={item.icon} size='mini' />
                        <Header.Content>
                          {item.name}
                        </Header.Content>
                      </Header>
                    </Table.Cell>
                    <Table.Cell>{item.type}</Table.Cell>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>{item.restrictions.age}</Table.Cell>
                    <Table.Cell>{item.restrictions.height}</Table.Cell>
                    <Table.Cell>{item.restrictions.description}</Table.Cell>
                    <Table.Cell>{item.prices.child}₽/{item.prices.man}₽</Table.Cell>
                    <Table.Cell>{item.coordinates.lat},{item.coordinates.lng}</Table.Cell>
                    <Table.Cell>
                      <Button id={item._id} onClick={this.generateQR} color="olive">Генерировать</Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button color="red">Удалить</Button>
                    </Table.Cell>
                  </Table.Row>
                )
              )
            }
          </Table.Body>
        </Table>
        <Modal
          onClose={() => {
            this.setState({ qrModal: false })
          }}
          onOpen={() => {
            this.setState({ qrModal: true })
          }}
          open={this.state.qrModal}
        >
          <Modal.Header>Печать</Modal.Header>
          <Modal.Content>
            <center>
              <Image size="large" src={this.state.currentQR} />
            </center>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={() => this.setState({ qrModal: false })}>
              Закрыть
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default AttrList
