import React, { Component } from 'react'
import { Container, Grid, Header, Card, List } from 'semantic-ui-react'

export class PanelSetttings extends Component {
  state = {
    items: null
  }
  
  componentDidMount() {
    fetch("http://192.168.43.113:3000/park/getItems/"+localStorage.getItem("user_id"))
    .then(response => response.json())
    .then(data => {
      this.setState({ 
        items: data.result,
        always: data.result.sort((a, b) => b.pays.length - a.pays.length)
        .map((item) => {
          return {
            header: item.name,
            description: item.pays.length !== 0 ? <div>{item.description}<br /><b>Деньги: {item.pays.map((k) => k.price).reduce((a, b) => Number(a)+Number(b))}</b></div> : item.description,
            meta: `Кол-во посещений: ${item.pays.length}`
          }
        }),
        month: data.result.map((item) => {
          item.pays = item.pays.filter((p) => (new Date(p.date)).getMonth() === (new Date().getMonth()))
          return item
        }).sort((a, b) => b.pays.length - a.pays.length)
          .map((item) => {
            return {
              header: item.name,
              description: item.pays.length !== 0 ? <div>{item.description}<br /><b>Деньги: {item.pays.map((k) => k.price).reduce((a, b) => Number(a)+Number(b))}</b></div> : item.description,
              meta: 'Кол-во посещений: '+item.pays.length
            }
          }),
        today: data.result.map((item) => {
          item.pays = item.pays.filter((p) => (new Date(p.date)).getMonth() === (new Date().getMonth()) && (new Date(p.date)).getDate() === (new Date().getDate()))
          return item
        }).sort((a, b) => b.pays.length - a.pays.length)
          .map((item) => {
            return {
              header: item.name,
              description: item.pays.length !== 0 ? <div>{item.description}<br /><b>Деньги: {item.pays.map((k) => k.price).reduce((a, b) => Number(a)+Number(b))}</b></div> : item.description,
              meta: 'Кол-во посещений: '+item.pays.length
            }
          })
      })
    })
    fetch("http://192.168.43.113:3000/users/mostage")
    .then(response => response.json())
    .then(data => {
      this.setState({ mostage: data.result })
    })
  }

  render() {
    const { items, always, month, today, mostage } = this.state
    return (
      <Container fluid>
        {
          items && (
            <div>
              <Header as="h1">Посещаемость всего</Header>
              {
                <Card.Group
                  items={always}
                />
              }
              <Header as="h1">Посещаемость в этом месяце</Header>
              {
                <Card.Group
                  items={month}
                />
              }
              <Header as="h1">Посещаемость сегодня</Header>
              {
                <Card.Group
                  items={today}
                />
              }
              <div style={{ display: 'flex' }}>
                <div>
                  <Card style={{ marginTop: 10 }}>
                  <Header as="h1" style={{ margin: 10 }}>Пиковые часы</Header>
                    <List>
                      {
                        compressArray(Array.prototype.concat.apply([], items.map((item) => item.pays.map((b) => (new Date(b.date)
                        .getHours()
                        ))))).sort((b, a) => a.count - b.count).slice(0, 3).map((item) => 
                          <List.Item style={{ padding: 10 }}>
                            <Header as="h2">{item.value} часа(ов)</Header>
                          </List.Item>
                        )
                      }
                    </List>
                  </Card>
                </div>
                <div style={{ marginLeft: 15 }}>
                  <Card style={{ marginTop: 10 }}>
                  <Header as="h1" style={{ margin: 10 }}>Пиковые возрасты</Header>
                    <List>
                      {
                        mostage && mostage.map((item) => 
                          <List.Item style={{ padding: 10 }}>
                            <Header as="h2">{Math.floor(item.value)} лет</Header>
                          </List.Item>
                        )
                      }
                    </List>
                  </Card>
                </div>
              </div>
            </div>
          )
        }
      </Container>
    )
  }
}

function compressArray(original) {
 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0;	
		// loop over every element in the copy and see if it's the same
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				// increase amount of times duplicate is found
				myCount++;
				// sets item to undefined
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};

export default PanelSetttings
