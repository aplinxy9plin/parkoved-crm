import React, { Component } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const containerStyle = {
  width: "400px",
  height: "400px"
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
    if(this.props.marker1 && this.props.marker2){
      this.setState({
        marker1: this.props.marker1,
        marker2: this.props.marker2
      })
    }else{
      this.setState({
        marker2: this.props.marker2
      })
    }
    console.log('govno:', this.state.lat+0.427995202432247)
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
          zoom={15}
          onUnmount={this.onLoad}
          options={{

          }}
        >
          {/*  */}
          {/* Child components, such as markers, info windows, etc. */}
          <Marker
            onDrag={(value) => {
              this.props.onChange({
                lat: value.latLng.lat(),
                lng: value.latLng.lng()
              }, this.state.marker2)
              this.setState({
                marker1: {
                  lat: value.latLng.lat(),
                  lng: value.latLng.lng()
                }
              })
            }}
            position={{ lat: this.state.marker1.lat, lng: this.state.marker1.lng }}
            draggable={true}
          />
          {
            this.state.marker2 && (
              <Marker
                onDragEnd={(value) => {
                  this.props.onChange(this.state.marker1 ,{
                    lat: value.latLng.lat(),
                    lng: value.latLng.lng()
                  })
                  this.setState({
                    marker2: {
                      lat: value.latLng.lat(),
                      lng: value.latLng.lng()
                    }
                  })
                }}
                position={{ lat: this.state.marker2.lat, lng: this.state.marker2.lng }}
                draggable={true}
              />
            )
          }
        </GoogleMap>
      </LoadScript>
    );
  }
}
