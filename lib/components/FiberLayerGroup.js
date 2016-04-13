import React, {Component, PropTypes} from 'react'
import { Map, Marker, Popup, TileLayer, Polyline, LayerGroup, Path } from 'react-leaflet'
import _ from 'lodash'

import FiberGeometry from './FiberGeometry'
import FiberCenter from './FiberCenter'

export default class FiberLayerGroup extends Component {

  render(){

    // Q: How does each property get provided?
    const { map, fibers, selectedPosition } = this.props

    const geometryElements = _.map(fibers, (fiber,i) => {

      // TODO: add logic here to highlight the selected fiber in blue
      const color = fiber.isSelected ? 'red' : 'blue'
	  
	  
	  //Grab coords for shortest path to fibers
	  const fiberPos = {
		latitude: fiber.geometry.coordinates[0][1],
		longitude: fiber.geometry.coordinates[0][0]  
	  }
	  
	  //Want to clear from map each time new location selected
	  if(fiber.isSelected){
		  //console.log("selected fiber center at: " + fiberPos.latitude + ", " + fiberPos.longitude)
		  //console.log("user is at: " + selectedPosition)
		  
		  //set route to control object so that we can call control funcitons on it
		  var routing = L.Routing.control({
			//Define the points that must be visited when calculating route
		    waypoints: [
			  L.latLng(selectedPosition),
			  L.latLng(fiber.center.latitude, fiber.center.longitude)  
		    ],
			//If a way point is changed, recalculate
			routeWhileDragging: true
		  });
		  routing.addTo(map)//Add route to map
		  //console.log("removing");
		  //routing.removeFrom(map);//Remove route from map
	  }
	  
	  
	  
	  //console.log("waypoints are: " + )
	  
      return <FiberGeometry geometry={fiber.geometry} selectedPosition={selectedPosition} key={i} map={map} color={color}/>
      // Q: Why do we have to specify map={map}?
      // Q: Why do we have to specify key={i}?
    })

    const centerElements = _.map(fibers, (fiber,i) => {

      return <FiberCenter center={fiber.center} key={i} map={map}/>
      // Q: Why do we have to specify map={map}?
      // Q: Why do we have to specify key={i}?
    })

    return <LayerGroup map={map}>
      { geometryElements }
      { centerElements }
    </LayerGroup>
  }

}
