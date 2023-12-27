import React from "react";
import { Card } from "../../../../components/shared/Card/Card";
import { Button } from "../../../../components/shared/Button/Button";
import styles from "../StepPhoneEmail.module.css";
import { Textinput } from "../../../../components/shared/Textinput/Textinput";
import { useState } from "react";

export const Email = ({ onClick }) => {
  const [email, setEmail] = useState("");

  return (
    <div>
      <Card title="Enter your email id" icon="mail">
        <Textinput value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <div className={styles.actionButtonWrap}>
            <Button onClick={onClick} text="Next" icon="Arrow" />
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
