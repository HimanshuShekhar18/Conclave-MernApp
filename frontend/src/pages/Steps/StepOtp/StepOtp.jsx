import React from "react";
import { Card } from "../../../components/shared/Card/Card";
import { Button } from "../../../components/shared/Button/Button";
import styles from './StepOtp.module.css';
import { Textinput } from "../../../components/shared/Textinput/Textinput";
import { useState } from "react";
import { verifyOtp } from '../../../http';
import { useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { useDispatch } from 'react-redux';

export const StepOtp = () => {
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();  // hook
  const { phone, hash } = useSelector((state) => state.auth.otp);   // data store se fetch karne ke liye

  async function submit() {
    try {
        const { data } = await verifyOtp({ otp, phone, hash });  // data mein accessToken receive hua hain
        console.log(data);
        dispatch(setAuth(data));
    } catch (err) {
        console.log(err);
    }
}
  return (
    <div className={styles.cardWrapper}>
      <Card title="Enter the code we just texted you" icon="lock">
        <Textinput value={otp} onChange={(e) => setOtp(e.target.value)} />
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
