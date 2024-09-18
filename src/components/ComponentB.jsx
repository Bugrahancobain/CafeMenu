import React from 'react'
import "../style/ComponentB.css"

function ComponentB() {
  return (
    <div className='ComponentB'>
      <div className="headerDiv">
        <hr />
        <h1 className='header'>Cart Curt Cafe</h1>
      </div>
      <div className="contextDiv">
        <h2>Cart Coffee</h2>
        <h2>Curt Coffee</h2>
      </div>
      <a href="/menu">
        <button className='goMenu' style={{marginLeft: "100px"}}>Beni Menüye Götür</button>
        </a>
    </div>
  )
}

export default ComponentB