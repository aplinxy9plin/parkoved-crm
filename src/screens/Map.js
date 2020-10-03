import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "100vh"
};
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 56.4740589,
      lng: 84.9528123,
      lat2: 56.474574,
      marker1: {
        lat: 56.4740589,
        lng: 84.9528123
      },
      marker2: {
        lat: 56.474574,
        lng: 84.9528123
      },
    };
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    console.log(myParam)
    fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/get/"+myParam)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.type === 'ok'){
        const center = this.getCenter(data.result.map.coordinates)
        fetch("https://cors-anywhere.herokuapp.com/http://45.67.57.90:3000/park/getItems/"+myParam)
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
          }
        })
        .catch(err => {
          // window.location.href = "/login"
          console.error(err);
        });
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
  showLocation = position => {
    this.setState({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  };
  errorHandler = err => {
    if (err.code === 1) {
      alert("Error: Access is denied!");
    } else if (err.code === 2) {
      alert("Error: Position is unavailable!");
    }
  };
  onMapClick = value => {
    console.log("this._map", this.map);
    // console.log("e", value.latLng.lat(), value.latLng.lng());
    // setTimeout(() => {
    //   this.setState({
    //     lat: value.ab.x,
    //     lng: value.ab.y
    //   });
    // }, 4000);
  };
  // onLoad = marker => {
  //   console.log("marker: ", marker);
  // };
  render() {
    return (
      <LoadScript googleMapsApiKey="AIzaSyADhbsyZfwEIt3Z5VqJ_RJcLxmtPdj2ZJk">
        <GoogleMap
          ref={map => (this.map = map)}
          mapContainerStyle={containerStyle}
          center={{ lat: this.state.lat, lng: this.state.lng }}
          onClick={this.onMapClick}
          zoom={17}
          onUnmount={this.onLoad}

          options={{
            disableDefaultUI: true,
            styles: [
              {
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#ebe3cd"
                  }
                ]
              },
              {
                "elementType": "labels",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#523735"
                  }
                ]
              },
              {
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#f5f1e6"
                  }
                ]
              },
              {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#c9b2a6"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#dcd2be"
                  }
                ]
              },
              {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#ae9e90"
                  }
                ]
              },
              {
                "featureType": "administrative.neighborhood",
                "stylers": [
                  {
                    "visibility": "off"
                  }
                ]
              },
              {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dfd2ae"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dfd2ae"
                  }
                ]
              },
              {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#93817c"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#a5b076"
                  }
                ]
              },
              {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#447530"
                  }
                ]
              },
              {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#f5f1e6"
                  }
                ]
              },
              {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#fdfcf8"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#f8c967"
                  }
                ]
              },
              {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#e9bc62"
                  }
                ]
              },
              {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#e98d58"
                  }
                ]
              },
              {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                  {
                    "color": "#db8555"
                  }
                ]
              },
              {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#806b63"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dfd2ae"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#8f7d77"
                  }
                ]
              },
              {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                  {
                    "color": "#ebe3cd"
                  }
                ]
              },
              {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                  {
                    "color": "#dfd2ae"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                  {
                    "color": "#b9d3c2"
                  }
                ]
              },
              {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                  {
                    "color": "#92998d"
                  }
                ]
              }
            ]
          }}
        >
          {/*  */}
          {/* Child components, such as markers, info windows, etc. */}
          {
            this.state.items && (
              this.state.items.map((item) => 
                <Marker
                  onClick={() => {
                    this.setState({
                      clickMarker: item
                    })
                  }}
                  icon={item.icon}
                  position={{ lat: item.coordinates.lat, lng: item.coordinates.lng }}
                />
              )
            )
          }
          {
            this.state.clickMarker && (
              <InfoWindow
                // onCloseClick={this.setState({ clickMarker: false })}
                position={{lat: this.state.clickMarker.coordinates.lat,
                  lng: this.state.clickMarker.coordinates.lng}}
              >
                <div>
                  <p>{this.state.clickMarker.name}</p>
                <p>{this.state.clickMarker.price}</p>
                </div>
              </InfoWindow>        
            )
          }
        </GoogleMap>
      </LoadScript>
    );
  }
}
