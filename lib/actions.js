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
  
  if(store.clicks == 0){
	  store.selectedPosition = latlng;
	  store.clicks = 1;
  }
  else{
      store.selectedPosition2 = latlng;
	  store.clicks = 0;
  }
  
  _.forEach(store.fibers, forEachFiberSetIsSelected)
  _.forEach(store.fibers, forEachFiberSetCost)
	//sort the fiber
  store.fibers.sort(function(fiber1, fiber2){
	 return fiber1.distance - fiber2.distance;
  });
	//find the min distance
	var min = Number.POSITIVE_INFINITY;
	for(var i=0; i<=store.fibers.length-1; i++){
		if (store.fibers[i].isSelected){
			if (store.fibers[i].distance < min) min = store.fibers[i].distance;
		}
	}
	
	//mark the min distance with red color
	for(var i=0; i<=store.fibers.length-1; i++){
		forEachFiberSetRoute(store.fibers[i],min);
	}
  _.forEach(store.fibers, forEachFiberSetId)
  
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
        //console.log('distance', routes[0].summary.totalDistance)
        fiber.distance = routes[0].summary.totalDistance
        fiber.cost = 5 * fiber.distance
    })
	/*
	//grab overall line cost
	if(store.selectedPosition && store.selectedPosition2){
		var waypoints2 = [];
		waypoints2.push({latLng: L.latLng(store.selectedPosition)})
		waypoints2.push({latLng: L.latLng(store.selectedPosition2)})
		router.route(waypoints2, (err, routes) => {
			console.log('distance', routes[0].summary.totalDistance)
			store.distance = routes[0].summary.totalDistance
			store.cost = 5 * store.distance
		})
	}
	*/
		
}

//helper to set fiber ids
function forEachFiberSetId(fiber,index){
    fiber.id = index;   
}

function forEachFiberSetRoute(fiber,min){
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
    L.latLng(fiber.center.latitude, fiber.center.longitude),
	L.latLng(store.selectedPosition2)
  ];
  if(fiber.isSelected){
	  //create an icon for this fiber
	  var fibIcon;
	  var fiberIcon = L.icon({
		iconUrl: './img/leaf-green.png',
		shadowUrl: './img/leaf-shadow.png',
		
		iconSize:     [28, 85], // size of the icon
		shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
	  });
	  var fiberIcon2 = L.icon({
		iconUrl: './img/leaf-orange.png',
		shadowUrl: './img/leaf-shadow.png',
		
		iconSize:     [28, 85], // size of the icon
		shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
	  });
	  //shortest path with red color
	  if (fiber.distance == min){
		  var color = 'red';
		  var weight = 20;
	  }
	  else{
		  var color = 'green';
		  var weight = 5;
	  }
	  //set route to control object so that we can call control funcitons on it
	  var routing = L.Routing.control({
		//Define the points that must be visited when calculating route, set their icons as well
		//waypoints: waypoints, //just maintaining the easy way of setting way points for records
		//RESOURCE: http://leafletjs.com/reference.html#icon
		//RESOURCE: https://github.com/perliedman/leaflet-routing-machine/blob/gh-pages/index.js#L16
		plan: L.Routing.plan(waypoints, {
			createMarker: function(i, waypoints) {
				//mark endpoint different color
				if(i==1){
					fibIcon = fiberIcon;
				}
				else{
					fibIcon = fiberIcon2;
				}
				return L.marker(waypoints.latLng, {
					draggable: false,//don't let users change the route by dragging
					icon: fibIcon,
					title: "Fiber ID: " + fiber.id + "\n" + "Fiber Cost: $" + fiber.cost,
					riseOnHover: false, //if markers overlap the marker with mouse hover with rise above other markers
					riseOffset: 250 //how far the icon rises onHover
				});
			},
			//If a way point is changed, recalculate
			routeWhileDragging: false
		}),
		//If a way point is changed, recalculate
		routeWhileDragging: false,
		fitSelectedRoutes: false,
		lineOptions: {
          styles: [
              {color: 'purple', opacity: 0.15, weight: 9},
              {color: 'white', opacity: 0.8, weight: 6},
              {color: color, opacity: 0.5, weight: weight}
          ]
        }
	  });
	  routing.options.addWaypoints=false;//don't let users add waypoints -- if true users can drag the route itself (the line) and add more fibers
	  routing.options.show=false;
	  fiber.route = routing;
	  
	  console.log("fiber set:")
  }
}
