import React from 'react'
import styles from './Card.module.css'

// receiving data as a props
export const Card = ({title, icon, children}) => {
  return (
      <div className={styles.card}>
    
      <div className={styles.headerWrapper}>
         <img src={`/images/${icon}.png`} width={37.5} height={30} alt='Emoji'/>
         <h1 className={styles.heading}>{title}</h1>
      </div>
      {children}
    </div>
  )
}
