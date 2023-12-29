import React from "react";
import { useState } from "react";
import { Phone } from "./Phone/Phone";
import { Email } from "./Email/Email";
import styles from "./StepPhoneEmail.module.css"; // Correct import statement

const phoneEmailMap = {
  phone: Phone, // component banaya phone wale design ke liye
  email: Email, // component banaya email wale design ke liye
};

export const StepPhoneEmail = ({ onClick }) => {
  const [type, setType] = useState("phone");
  const Component = phoneEmailMap[type];

  return (
    <>
      <div className={styles.cardWrapper}>
        <div>
        <div className={styles.buttonWrapper}>
          <button className={`${styles.tabButton} ${type==='phone'?styles.active:''}`} onClick={() => setType("phone")}>
            <img src="./images/phone.png" alt="phone"></img> 
          </button>
          <button className={`${styles.tabButton} ${type==='email'?styles.active:''}`} onClick={() => setType("email")}>
            <img src="/images/email.png" alt="email"></img>
          </button>
        </div> 
        <Component onClick={onClick} />
        </div>
      </div>
    </>
  );
};
