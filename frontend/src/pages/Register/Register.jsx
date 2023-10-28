import React from "react";
import { useState } from "react";
import styles from "./Register.module.css";

import { StepPhoneEmail } from "../Steps/StepPhoneEmail/StepPhoneEmail";
import { StepOtp } from "../Steps/StepOtp/StepOtp";
import { StepName } from "../Steps/StepName/StepName";
import { StepAvatar } from "../Steps/StepAvatar/StepAvatar";
import { StepUsername } from "../Steps/StepUsername/StepUsername";

// hashmap for different step pages as a object
const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
  3: StepName,
  4: StepAvatar,
  5: StepUsername, 
};

export const Register = () => {

  const incrementStep = () => {
    setStep(step + 1);
  };
  
  // local state inside the Register component
  const [step, setStep] = useState(1);
  // har ek component iss Step variable mein store honge
  const Step = steps[step];

  return (
    // ab iss Step component ko render karna hain
    <div>
      <Step onClick = {incrementStep} />
    </div>
  );
};
