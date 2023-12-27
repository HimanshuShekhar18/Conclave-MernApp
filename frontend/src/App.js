import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activation from "./pages/Activation/Activation";
import Rooms from "./pages/Rooms/Rooms";

import { useSelector } from "react-redux";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authenticate" element={<GuestRoute />} />
        <Route path="/activate" element={<SemiProtectedRoute />} />
        <Route path="/rooms" element={<ProtectedRoute />} />
      </Routes>
    </Router>
  );
}

const GuestRoute = () => {

  const { isAuth } = useSelector((state) => state.auth);  // from auth-slice

  return isAuth ? <Navigate to="/rooms" /> : <Authenticate />;
};

const SemiProtectedRoute = () => {
  
  const { user, isAuth } = useSelector((state) => state.auth);

  return (
    <>
      {!isAuth ? (
        <Navigate to="/" />
      ) : !user.activated ? (
        <Activation />
      ) : (
        <Navigate to = "/rooms"/>
      )}
    </>
  );
};

const ProtectedRoute = () => {
  const { user, isAuth } = useSelector((state) => state.auth);


  return (
    <>
      {!isAuth ? (
        <Navigate to="/" />
      ) : !user.activated ? (
        <Navigate to="/activate" />
      ) : (
        <Rooms/>
      )}
    </>
  );
};

export default App;
