import React from "react";
import { Card } from "../../../../components/shared/Card/Card";
import { Button } from "../../../../components/shared/Button/Button";
import { Textinput } from "../../../../components/shared/Textinput/Textinput";
import { useState } from "react";
import styles from "../StepPhoneEmail.module.css";
import { sendOtp } from "../../../../http/index";
import { useDispatch } from "react-redux"; // hook to send data received from server to store.js
import { setOtp } from "../../../../store/authSlice";

export const Phone = ({ onClick }) => {


  // state banate hai
  const [phoneNumber, setPhoneNumber] = useState("");

  const dispatch = useDispatch(); // hook

  async function submit() {
    // 2) if you are using await then fucntion shoule be async

    //server request
    console.log(phoneNumber);
    const { data } = await sendOtp({ phone: phoneNumber });
    console.log(data);
    // to send data recieved from server to store.js
    dispatch(setOtp({ phone: data.phone, hash: data.hash }));
    onClick();
  }

  const handleKeyDown = (e) => {
    // Allow only numeric and control keys
    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete')) {
        e.preventDefault();
    }
};

  return (
    <div>
      <Card title="Enter your Phone Number" icon="Telephone">
        <Textinput
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          onClear={() => setPhoneNumber("")}
          pattern="[0-9]*" 
          inputMode="numeric"
          onKeyDown={handleKeyDown}
        />

  
        <div>
          <div className={styles.actionButtonWrap}>
            <Button onClick={submit} text="Next" icon="Arrow" />
          </div>

          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  );
};
