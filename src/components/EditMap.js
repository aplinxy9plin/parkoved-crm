import { stat } from 'fs';
import React, { Component } from 'react'
import { Form, Grid, Header, Button, Icon, Select, Checkbox } from 'semantic-ui-react';
import MapPreviewEdit from './MapPreviewEdit'

export class EditMap extends Component {
  state = {
    park: null,
    type: '',
    images: [null, null, null],
    age: 12,
    height: 150,
    price_child: 100,
    price_parent: null,
    coordinates: {
      lat: 56.4740589,
      lng: 84.9528123,
    }
  }

  componentDidMount() {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/get/"+localStorage.getItem("user_id"))
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.type === 'ok'){
        const center = this.getCenter(data.result.map.coordinates)
        fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/getItems/"+localStorage.getItem("user_id"))
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if(data.type === 'ok'){
            console.log(center)
            this.setState({
              park: data.result,
              center: {
                lat: center[0],
                lng: center[1]
              },
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
      }else{
        window.location.href = "/login"
      }
    })
    .catch(err => {
      // window.location.href = "/login"
      console.error(err);
    });
  }

  getCenter = (arr) => {
    var minX, maxX, minY, maxY;
    for (var i = 0; i < arr.length; i++)
    {
        minX = (arr[i]['lat'] < minX || minX == null) ? arr[i]['lat'] : minX;
        maxX = (arr[i]['lat'] > maxX || maxX == null) ? arr[i]['lat'] : maxX;
        minY = (arr[i]['lng'] < minY || minY == null) ? arr[i]['lng'] : minY;
        maxY = (arr[i]['lng'] > maxY || maxY == null) ? arr[i]['lng'] : maxY;
    }
    return [(minX + maxX) / 2, (minY + maxY) / 2];
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

 findIcon = e => {
  fetch(`https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/iconList?search=${e.currentTarget.value}`)
  .then(response => response.json())
  .then(data => {
    if(data.type === 'ok'){
      this.setState({
        icons: data.result
      })
    }
  })
 }

  submit = () => {
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/addItem", {
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "body": JSON.stringify({
        "park_id": localStorage.getItem("user_id"),
        "type": this.state.type,
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
      <div>
        {
          this.state.park && (
            <div>
              <Grid>
                <Grid.Column width={10} style={{
                  // height: '100vh'
                }}>
                  <MapPreviewEdit
                    center={this.state.center}
                    icon={this.state.icon}
                    lat={this.state.coordinates.lat}
                    lng={this.state.coordinates.lng}
                    onChange={(coordinates) => {
                      this.setState({ coordinates })
                    }}
                    items={this.state.items}
                  />
                </Grid.Column>
                <Grid.Column width={5} style={{
                  // height: '100vh'
                }}>
                  <Header as="h1">Добавление объектов на карту</Header>
                  <Form fluid>
                    <Form.Field>
                      <label>Тип объекта</label>
                      <Select 
                        options={[
                          {
                            text: 'Аттракцион',
                            value: 'Аттракцион',
                          },
                          {
                            text: 'Сувениры',
                            value: 'Сувениры',
                          },
                          {
                            text: 'Кафе',
                            value: 'Кафе',
                          },
                          {
                            text: 'Туалет',
                            value: 'Туалет',
                          },
                          {
                            text: 'Другое',
                            value: 'Другое',
                          }
                        ]}
                        onChange={(e) => {
                          if(this.state.type === 'Другое' || this.state.type === 'Туалет'
                          || this.state.type === 'Сувениры'){
                            this.setState({
                              name: e.currentTarget.innerText
                            })
                          }
                          this.setState({
                            type: e.currentTarget.innerText
                          })
                        }}
                      />
                    </Form.Field>
                    {
                      this.state.type && this.state.type !== 'Другое' && this.state.type !== 'Туалет'
                      && this.state.type !== 'Сувениры' && (
                        <Form.Field>
                          <label>Название</label>
                          <input
                            onChange={(e) => {
                              console.log(e.currentTarget.value)
                              this.setState({ name: e.currentTarget.value })
                            }}
                          />
                        </Form.Field>
                      )
                    }
                    <Form.Field>
                      <label>Описание</label>
                      <input onChange={(e) => {
                        console.log(e.currentTarget.value)
                        this.setState({ description: e.currentTarget.value })
                      }}/>
                    </Form.Field>
                    <Header>Вы можете добавить изображения объекта</Header>
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
                    <Form.Field>
                      <label>Найти и выбрать иконку</label>
                      <input onChange={this.findIcon} />
                    </Form.Field>
                    <Grid>
                      <Grid.Column>
                        {
                          this.state.icons && (
                            this.state.icons.map((item) => 
                              <img src={item} style={
                                this.state.icon === item ? {
                                  backgroundColor: '#28a745',
                                  borderRadius: 25
                                }: {}}
                                onClick={(e) => {
                                  console.log(e.currentTarget.src)
                                  this.setState({
                                    icon: e.currentTarget.src
                                  })
                                }}
                              />
                            )
                          )
                        }
                      </Grid.Column>
                    </Grid>
                    <Header>Ограничения</Header>
                    <Form.Field>
                      <label>Возраст(от скольки лет)</label>
                      <input type='number'
                        value={this.state.age}
                        onChange={(e) => {
                          this.setState({
                            age: e.currentTarget.value.length > 2 ? e.currentTarget.value.slice(0,3) : e.currentTarget.value
                          })
                        }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Рост(минимальный)</label>
                      <input type='number'
                        value={this.state.height}
                        onChange={(e) => {
                          this.setState({
                            height: e.currentTarget.value.length > 3 ? e.currentTarget.value.slice(0,2) : e.currentTarget.value
                          })
                        }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Дополнительные ограничения</label>
                      <textarea
                        value={this.state.restDescription}
                        onChange={(e) => {
                          this.setState({
                            restDescription: e.currentTarget.value
                          })
                        }}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Цена для ребенка</label>
                      <input type='number'
                        value={this.state.price_child}
                        onChange={(e) => {
                          this.setState({
                            price_child: e.currentTarget.value
                          })
                        }}
                      />
                    </Form.Field>
                    <Checkbox label='Родителю можно на аттракцион' 
                      onChange={(e) => {
                        this.setState({
                          parent_access: e.currentTarget.className.indexOf('checked') === -1
                        })
                      }}
                      style={{ paddingBottom: 10 }}
                    />
                    {
                      this.state.parent_access && (
                        <Form.Field>
                          <label>Цена для родителя</label>
                          <input type='number'
                            value={this.state.price_parent}
                            onChange={(e) => {
                              this.setState({
                                price_parent: e.currentTarget.value
                              })
                            }}
                          />
                        </Form.Field>
                      )
                    }
                    <Button
                      onClick={this.submit}
                      primary
                      fluid
                      disabled={
                        !this.state.type ||
                        !this.state.name ||
                        !this.state.description ||
                        !this.state.age ||
                        !this.state.price_child ||
                        !this.state.icon
                      }
                    >
                      Готово
                    </Button>
                  </Form>
                </Grid.Column>
              </Grid>
            </div>
          )
        }
      </div>
    )
  }
}

export default EditMap
