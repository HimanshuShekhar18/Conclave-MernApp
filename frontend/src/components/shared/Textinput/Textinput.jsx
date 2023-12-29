import React from 'react'
import styles from './Textinput.module.css'

export const Textinput = ({placeholder, value,onChange, onClear, pattern, inputMode, handleKeyDown}) => {

  return (
    <div className={styles.inputContainer}>
      <input className={styles.input} placeholder={placeholder} type="text" pattern={pattern} inputMode={inputMode} value={value} onChange={onChange} onKeyDown={handleKeyDown}/>
      <button className={styles.clearButton} onClick={onClear}>
        Reset
      </button>
    </div>
  )
}