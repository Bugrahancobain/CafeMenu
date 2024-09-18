import React from 'react'
import "../style/ComponentC.css"

function ComponentC() {

  
  return (
    <div className='ComponentC'>
      <div className="konumDiv">
        <p id="typewriter" className='konumN'>42.7047"N</p>
        <p id="typewriter" className='konumE'>64.3228"E</p>
      </div>
      <a href="/menu">
        <button className='goMenu' style={{marginLeft: "100px"}}>Beni Menüye Götür</button>
        </a>
    </div>
  )
}

export default ComponentC