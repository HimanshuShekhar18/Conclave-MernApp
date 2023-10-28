import React from "react";
import { StepPhoneEmail } from "../Steps/StepPhoneEmail/StepPhoneEmail";
import { StepOtp } from "../Steps/StepOtp/StepOtp";
import { useState } from "react";

// hashmap for different step pages as a object
const steps = {
  1: StepPhoneEmail,
  2: StepOtp,
};

export const Login = () => {
  const incrementStep = () => {
    setStep(step + 1);
  };

  // local state inside the Register component
  const [step, setStep] = useState(1);
  // har ek component iss Step variable mein store honge
  const Step = steps[step];

  return (
    <div>
      <Step onClick={incrementStep} />
    </div>
  );
};