import { useState, useRef, useEffect, useCallback } from "react";

export const useStateWithCallback = (intialState) => {
  const [state, setState] = useState(intialState);

  // callback reference --> change update karlo but component render nahi honga
  // usually useState wale mein change update karke component ko render karte hain
  const cbRef = useRef(null);

  // designing setClients method ka second function jo basically state update karne ke liye hoti hain
  /*
      useCallback hook --> in every rendering funtion inside it naye se create nahi honga, hence performance is better
      it receives two parameter newState and a callback(cb)
      */
  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;

    /* prev --> ek state hain pehle(previous) wala; useState mein milta hain
       newState --> naya state jo aaya hain
       useState mein normal data and normal function bhi pass kar sakte hain
    */
    console.log("newState", newState);

    setState((prev) => {
      return typeof newState === "function" ? newState(prev) : newState;
    });
    console.log("state", state);
  }, []);

  /*
  • Recommend way of using useState()
const [state, setState] = useState(intialState);
setState((prev) => {[…prev, newState]}  );
  */

  // useEffect --> callback function (cb) called when state is updated
  useEffect(() => {
    // cbRef by default function nahi hoti
    if (cbRef.current) {
      cbRef.current(state); // cb ko call karenge and updated state ko pass karenge
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState]; // as an array return karo
};
