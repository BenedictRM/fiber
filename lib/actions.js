import store from './store'
import refresh from './refresh'
import _ from 'lodash'
import geolib from 'geolib'
import $ from 'jquery'
import { NEARBY_METERS } from './constants'

//
// Action functions
//

// Action to load fiber data asynchrnously
export function loadDataAsync(){

  $.ajax('/data/boulder.json').done(function(json) {
    store.geometries = json

    let fibers = {}

    store.fibers = _.map(json, (d) => {


      // TODO: implement the correct logic to compute the center of the geometry
      // hint: use geolib.getCenter()      
      //This logic is wrong:
	  /*
      const center = {
        latitude: d.coordinates[0][1],
        longitude: d.coordinates[0][0]
      }*/
	  //answer: 
	  const center = geolib.getCenter(d.coordinates) //use npm install geolib to get library
	  
      return {
        geometry: d,
        center: center
      }
    })

    refresh()
  })
}

// Action to set a position selected by the user
export function setSelectedPosition(latlng) {
  store.selectedPosition = latlng

  _.forEach(store.fibers, forEachFiberSetIsSelected)

  _.forEach(store.fibers, forEachFiberSetCost)

  refresh()
}

//
// private helper function
//

// helper to set each fiber's 'isSelected' flag based on whether this fiber is
// nearby with respect to the position selected by the user (using const 'NEARBY_METERS')
function forEachFiberSetIsSelected(fiber){
  
  const fiberPos = {
	latitude: fiber.geometry.coordinates[0][1],
	longitude: fiber.geometry.coordinates[0][0]  
  }
  
  if(geolib.getDistance(store.selectedPosition, fiberPos) < NEARBY_METERS){
	  fiber.isSelected = true
	  console.log('entered!')
  }
  
  else{
	 fiber.isSelected = false 
  }
}

// helper to set the cost of connecting this fiber to the selected position
function forEachFiberSetCost(fiber){
  
  const fiberPos = {
	latitude: fiber.geometry.coordinates[0][1],
	longitude: fiber.geometry.coordinates[0][0]  
  }
  //Distance from selected position to existing fibers in meters
  fiber.distance = geolib.getDistance(store.selectedPosition, fiberPos)
  //Cost determined as $5 per meter from fiber
  fiber.cost = 5 * fiber.distance
}
