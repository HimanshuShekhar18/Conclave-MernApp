import React from 'react'
import styles from './Textinput.module.css'

export const Textinput = ({value,onChange, onClear}) => {
 
  const handleKeyDown = (e) => {
    // Allow only numeric and control keys
    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
    }
};

  return (
    <div className={styles.inputContainer}>
      <input className={styles.input} placeholder="Enter your phone number" type="text" pattern="[0-9]*" inputMode="numeric" value={value} onChange={onChange} onKeyDown={handleKeyDown}/>
      <button className={styles.clearButton} onClick={onClear}>
        Reset
      </button>
    </div>
  )
}