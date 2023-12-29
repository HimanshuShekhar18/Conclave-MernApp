import React, { useState } from "react";
import { Card } from "../../../components/shared/Card/Card";
import { Button } from "../../../components/shared/Button/Button";
import { Textinput } from "../../../components/shared/Textinput/Textinput";

import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../store/activateSlice";
import styles from "./StepName.module.css";

const StepName = ({ onNext }) => {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(name);

  function nextStep() {
    if (!fullname) {
      return;
    }
    console.log(fullname);
    dispatch(setName(fullname));
    onNext();
  }

  const handleKeyDown = (e) => {
    // Allow only alphabetic and control keys
    if (!((e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z') || e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault();
    }
  };


  return (
    <>
      <Card title="What’s your full name?" icon="chasmaemoji">
        <Textinput
          placeholder="Enter your full name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          onClear={() => setFullname("")}
          pattern="[A-Za-z]*"
          inputMode="text"
          onKeyDown={handleKeyDown}
        />
        <p className={styles.paragraph}>
          People use real names at Conclave :) !
        </p>
        <div>
          <Button onClick={nextStep} text="Next" icon="Arrow" />
        </div>
      </Card>
    </>
  );
};

export default StepName;
