import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/shared/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import {Invitation} from "./pages/Invitation/Invitation";
import Activation from "./pages/Activation/Activation";
import Rooms from "./pages/Rooms/Rooms";
import Room from './pages/Room/Room';


import { useSelector } from "react-redux";

import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';

import Loader from './components/shared/Loader/Loader';

function App() {

  


  // call refresh endpoint
  const { loading } = useLoadingWithRefresh();   // destructoring the loading object

  return loading ? (<Loader message="Loading, please wait.." />) : (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authenticate" element={<GuestRoute />} />
        <Route path="/invitation" element={<GuestRoute2 />} />
        <Route path="/activate" element={<SemiProtectedRoute />} />
        <Route path="/inviteactivate" element={<SemiProtectedRoute2 />} />
        <Route path="/rooms" element={<ProtectedRoute />} />
        <Route path="/room/:id" element={<Room />} />   
      </Routes>
    </Router>
  );
}

const GuestRoute = () => {

  const { isAuth } = useSelector((state) => state.auth);  // from auth-slice

  return isAuth ? <Navigate to="/rooms" /> : <Authenticate />;
};

const GuestRoute2 = () => {

  const { isAuth } = useSelector((state) => state.auth);  // from auth-slice
  
  return isAuth ? <Navigate to="/inviteactivate"/>: <Authenticate />;
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

const SemiProtectedRoute2 = () => {
  const { user, isAuth } = useSelector((state) => state.auth);


  return (
    <>
      {!isAuth ? (
        <Navigate to="/" />
      ) : !user.activated ? (
        <Activation/>
      ) : (
        <Invitation/>
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
