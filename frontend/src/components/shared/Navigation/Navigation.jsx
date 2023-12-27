import React from 'react'
import { Link } from 'react-router-dom'
// default import of module
import styles from './Navigation.module.css'

const Navigation = () => {
  
  // inline styling object creation
  // object hain to as a string dena honga
  // in JS camelcase format "-" not allowed
  const brandstyle = {
    color: '#fff',
    textDecoration: 'none',  // to remove underline
    fontWeight: 'bold',
    fontSize: '22px',
    // for vertically centering 
    display: 'flex',  
    alignItems: 'center',    
  }

  // to give some spacing between Emogi and Text
  const logotext = {
    marginLeft: '10px',
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandstyle} to="/">
            <img src="/images/Emoji.png" width={37.5} height={30} alt = "Emoji" />
            <span style={logotext} > Conclave </span>
      </Link>
    </nav>
  );
}; 

export default Navigation;