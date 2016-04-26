// create a store with initial values
let store = {
  center: [40.01, -105.25], // Boulder
  selectedPosition: null,
  selectedPosition2: null,
  clicks: 0,
  cost: 0,
  distance: 0,
  fibers: []
}

// make it a global variable (easy for debugging in the developer's console)
global.store = store

// export it
export default store
