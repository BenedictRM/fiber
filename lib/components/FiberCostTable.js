import React, {Component, PropTypes} from 'react'

import _ from 'lodash'

// React component for visualizing fiber locations on a map
export default class FiberCostTable extends Component {

  render(){
    const { fibers } = this.props

    // TODO: implement the table header
    const rowHeaders = <div><h5>
    <div className="col s2"><u> id </u></div>
    <div className="col s5"><u> Cost($) </u></div>
    <div className="col s5"><u> Distance(Meters) </u></div>
  </h5></div>

    const rowElements = _.map(fibers, (fiber, i) => {

    const className = !fiber.isSelected ? 'row' : 'row yellow'
  //Alternative solution -- doesn't work
  //const classNameStyle = !fiber.isSelected ? 'marginBottom:0' : 'marginBottom:0 backgroundColor:"yellow"'

    return <div key={i} className={className} style={{marginBottom:0}}>
    <div className="col s2"> {i} </div>
    <div className="col s5"> {fiber.cost.toFixed(0)} </div>
    <div className="col s5"> {fiber.distance} </div>
    </div>

  })

    return <div>
      { rowHeaders }
      { rowElements }
    </div>

  }

}