import React, { Component } from 'react'
import { Container, Grid, Menu, Segment } from 'semantic-ui-react'

import logo from '../logoParkoved.png'

// components
import EditMap from '../components/EditMap'
import AttrList from '../components/AttrList'
import Events from '../components/Events'
import PanelSettings from '../components/PanelSettings'

export default class Dashboard extends Component {
  state = { activeItem: 'Панель управления', currentPanel: <PanelSettings /> }

  componentDidMount() {
   if(!localStorage.getItem("user_id")){
    window.location.href = "/addpark"
   } 
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    switch (name) {
      case 'Ред. карту':
        this.setState({
          currentPanel: <EditMap />
        })
        break;
      case 'Список аттракционов':
        this.setState({
          currentPanel: <AttrList />
        })
        break
      case 'События':
        this.setState({
          currentPanel: <Events />
        })
        break
      case 'Панель управления':
        this.setState({
          currentPanel: <PanelSettings />
        })
        break
      default:
        break;
    }
  }

  render() {
    const { activeItem, currentPanel } = this.state

    return (
      <Container fluid>
        <Menu stackable>
          <Menu.Item>
            <img src={logo} />
          </Menu.Item>

          <Menu.Item
            position="right"
            name='sign-out'
            onClick={this.handleItemClick}
          >
            Выйти
          </Menu.Item>
        </Menu>
        <Grid style={{ padding: 0 }}>
          <Grid.Column width={2} style={{ height: '100vh', padding: 0 }}>
            <Menu fluid vertical tabular>
              <Menu.Item
                name='Панель управления'
                active={activeItem === 'Панель управления'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='Ред. карту'
                active={activeItem === 'Ред. карту'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='Список аттракционов'
                active={activeItem === 'Список аттракционов'}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name='События'
                active={activeItem === 'События'}
                onClick={this.handleItemClick}
              />
            </Menu>
          </Grid.Column>

          <Grid.Column stretched width={14} style={{ height: '100vh', padding: 0 }}>
            <Segment>
              {
                currentPanel
              }
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}
