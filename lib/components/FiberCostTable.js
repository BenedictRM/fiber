import React, {Component, PropTypes} from 'react'

import _ from 'lodash'

// React component for visualizing fiber locations on a map
export default class FiberCostTable extends Component {

  render(){
    const { fibers } = this.props

    // TODO: implement the table header
    const rowHeaders = <div className='row'><h6>
    <div className="col s2"><b> id </b></div>
    <div className="col s4"><b> Cost($) </b></div>
    <div className="col s6"><b> Map Distance(Meters) </b></div>
    <div className="col s12 center-align"><hr/></div>
	</h6></div>

    const rowElements = _.map(fibers, (fiber, i) => {

	var row_color=''
	if(fiber.isSelected)
	{
		
		return <div key={i} className={row_color} style={{marginBottom:0}}>
		<div className="col s2"> {i} </div>
		<div className="col s5"> {fiber.cost.toFixed(0)} </div>
		<div className="col s5"> {fiber.distance} </div>
			   </div>

	}
	else
	{
		  row_color='row'
	}

    //const className = !fiber.isSelected ? 'row' : 'row blue'
  //Alternative solution -- doesn't work
  //const classNameStyle = !fiber.isSelected ? 'marginBottom:0' : 'marginBottom:0 backgroundColor:"yellow"'


    })

    return <div>
      { rowHeaders }
      { rowElements }
    </div>

  }

}
