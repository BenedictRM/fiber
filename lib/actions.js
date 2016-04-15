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
      //the formant of fiber after load function, fiber={geometry:d, center:center}

      store.fibers = _.map(json, (d) => {
	  //answer: implement the correct logic to compute the center of the geometry
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
  console.log('calling: forEachFiberSetIsSelected')
  _.forEach(store.fibers, forEachFiberSetIsSelected)
  console.log('calling: forEachFiberSetCost')
  _.forEach(store.fibers, forEachFiberSetCost)
  console.log('calling: forEachFiberSetRoute')
  _.forEach(store.fibers, forEachFiberSetRoute)

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
  }
  
  else{
	 fiber.isSelected = false 
  }
}

// helper to set the cost of connecting this fiber to the selected position
function forEachFiberSetCost(fiber) {

    // const fiberPos = {
    // latitude: fiber.geometry.coordinates[0][1],
    // longitude: fiber.geometry.coordinates[0][0]
    // }
    var router = L.Routing.osrm();
    //create L.Routing.waypoints
    var waypoints = [];
    waypoints.push({latLng: L.latLng(store.selectedPosition)})
    waypoints.push({latLng: L.latLng(fiber.center.latitude, fiber.center.longitude)})
    //calculate the road distance
    router.route(waypoints, (err, routes) => {
        console.log('distance', routes[0].summary.totalDistance)
        fiber.distance = routes[0].summary.totalDistance
        fiber.cost = 5 * fiber.distance
    })

}

function forEachFiberSetRoute(fiber){
  console.log("setting waypoints!")
  if(fiber.old == true){
	  console.log("fiber has prev set -- saving for removal")
	  fiber.oldroute = fiber.route;//store the old route for removal
  }
  
  //Grab coords for shortest path to fibers
  const fiberPos = {
	latitude: fiber.geometry.coordinates[0][1],
	longitude: fiber.geometry.coordinates[0][0]  
  }
  
  //Want to clear from map each time new location selected
  var waypoints = [
    L.latLng(store.selectedPosition),
    L.latLng(fiber.center.latitude, fiber.center.longitude)
  ];
  if(fiber.isSelected){
	  
	  //set route to control object so that we can call control funcitons on it
	  var routing = L.Routing.control({
		//Define the points that must be visited when calculating route
		waypoints: waypoints,
		//If a way point is changed, recalculate
		routeWhileDragging: false,
		fitSelectedRoutes :false,
		lineOptions: {
        styles: [
            {color: 'purple', opacity: 0.15, weight: 9},
            {color: 'white', opacity: 0.8, weight: 6},
            {color: 'green', opacity: 0.5, weight: 20}
        ]
        }
	  });
	  routing.options.show=false;
	  fiber.route = routing;
	  
	  console.log("fiber set:")
  }
}
