import React, {Component} from "react";
import {getBoundingBox} from "../libs/convertions";
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
const Geohash = require("latlon-geohash").default;

const FOAM_PENDING_COLOR = [46, 124, 230];
const FOAM_VERIFIED_COLOR = [38, 171, 95];
const FOAM_CHALLENGED_COLOR = [244, 128, 104];
const FOAM_REMOVED_COLOR = [255, 0, 0];

// Functions
function getCenterPoint(bounding_box) {
  return [(bounding_box[0][0] + bounding_box[1][0]) / 2, (bounding_box[0][1] + bounding_box[1][1]) / 2];
}

function getPointColor(state) {
  if (state && state.status && state.status.type) {
    if (state.status.type === "applied") { return FOAM_PENDING_COLOR }
    else if (state.status.type === "listing") { return FOAM_VERIFIED_COLOR }
    else if (state.status.type === "challenged") { return FOAM_CHALLENGED_COLOR }
  } else {
    return FOAM_REMOVED_COLOR
  }
}

function getPointCoords(geohash) {
  const coords = Geohash.decode(geohash);
  return [coords['lon'], coords['lat'], 0];
}

const MAX_ZOOM = 16;
const RADIUS_SCALE = 50;
const RADIUS_MIN_PIXELS = 1;
const RADIUS_MAX_PIXELS = 2.5;

const MapComponent = ReactMapboxGl({
  accessToken:
    ''
});


class Map extends Component {
  constructor(props){
    super(props);
    console.log(props);
    const {location} = props;
    const point = location.point.coords;
    const boundingBox = getBoundingBox(location.point.geohash.slice(0, props.presicion[0]));
    const zoom = props.presicion;
    this.state = {
      // Map layout
      point,
      boundingBox: [getPointCoords(boundingBox['sw']), getPointCoords(boundingBox['ne'])],
      zoom,
      data: []
    }
  }

  componentDidMount() {
    const DATA_URL = 'https://map-api-direct.foam.space/poi/filtered?swLng=' + [0][0] + '&swLat=' + this.state.boundingBox[0][1] + '&neLng=' + this.state.boundingBox[1][0] + '&neLat=' + this.state.boundingBox[1][1] + '&status=application&status=listing&status=challenged&status=removed&sort=most_value&limit=500&offset=0'
    fetch(DATA_URL)
      .then(response => response.json())
      .then(data => {
        this.setState({data})
        console.log(data)
      })
  }

  componentWillReceiveProps(newProps) {
    const _boundingBox = getBoundingBox(newProps.location.point.geohash.slice(0, newProps.presicion[0]));
    const boundingBox = [getPointCoords(_boundingBox['sw']), getPointCoords(_boundingBox['ne'])];
    const DATA_URL = 'https://map-api-direct.foam.space/poi/filtered?swLng=' + boundingBox[0][0] + '&swLat=' + boundingBox[0][1] + '&neLng=' + boundingBox[1][0] + '&neLat=' + boundingBox[1][1] + '&status=application&status=listing&status=challenged&status=removed&sort=most_value&limit=500&offset=0'
    fetch(DATA_URL)
      .then(response => response.json())
      .then(data => {
        this.setState({data})
        console.log(data)
      })
  }

  render(){
    console.log(this.state)
    return (
      <MapComponent
        style="mapbox://styles/mapbox/dark-v10"
        containerStyle={{
          height: '30vh',
          width: '40vw'
        }}
        maxZoom={MAX_ZOOM}
        center={this.props.location.point.coords}
        zoom={this.props.presicion}
      >
        <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
          { this.state.data.map( (e) =>
          <Feature coordinates={getPointCoords(e.geohash)} />
          )}
        </Layer>
      </MapComponent>);
  }
}

export default Map;