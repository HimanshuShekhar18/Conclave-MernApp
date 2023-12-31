import React from 'react'
import styles from './Card.module.css'

// receiving data as a props
export const Card = ({title, icon, children}) => {
  return (
      <div className={styles.card}>   
    
      <div className={styles.headerWrapper}>
        
         {icon && <img src={`/images/${icon}.png`} width={37.5} height={30} alt='Emoji'/>}  
         {title && <h1 className={styles.heading}>{title}</h1>}
      </div>
      {children}
    </div>
  )
}

// check laga rahe agar icon and title pass hua tabhi icon and title show karna 