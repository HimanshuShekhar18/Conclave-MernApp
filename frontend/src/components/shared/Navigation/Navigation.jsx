import React from "react";
import { Link, useNavigate } from "react-router-dom";
// default import of module
import styles from "./Navigation.module.css";

import { logout } from "../../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import { Navigate } from "react-router-dom";

const Navigation = () => {
  // inline styling object creation
  // object hain to as a string dena honga
  // in JS camelcase format "-" not allowed
  const brandstyle = {
    color: "#fff",
    textDecoration: "none", // to remove underline
    fontWeight: "bold",
    fontSize: "22px",
    // for vertically centering
    display: "flex",
    alignItems: "center",
  };

  // to give some spacing between Emogi and Text
  const logotext = {
    marginLeft: "10px",
  };

  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <nav className={`${styles.navbar} container`}>
      <Link style={brandstyle} to="/">
        <img src="/images/Emoji.png" width={37.5} height={30} alt="Emoji" />
        <span style={logotext}> Conclave </span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user?.name}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/avatar.png"}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <img src="/images/logout.png" width="53" height="53" alt="logout" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
