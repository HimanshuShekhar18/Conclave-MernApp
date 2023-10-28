import React from 'react'

import styles from './Button.module.css'

export const Button = ({onClick,text,icon}) => {
  return (
      <button onClick = {onClick} className={styles.buttonstyle} >
      <span style={{ marginRight: '10px' }}>{text}</span>
      <img src={`/images/${icon}.png`}  width={25} height={15}  alt='Arrow' />
      </button> 
  )
}