import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Pg404 from "./components/Pg404/Pg404";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Sidebar from "./components/Sidebar/Sidebar";
import Teachers from "./components/Teachers/Teachers";
import Applies from "./components/Applies/Applies";
import Account from "./components/Account/Account";
import Messages from "./components/Messages/Messages";
import CookieManager from "./utils/CookieManager";
import Signout from "./components/Signout/Signout";
import UploadPb from "./components/UploadPb/UploadPb";
import Problems from "./components/Problems/Problems";
import CreateSession from "./components/CreateSession/CreateSession";
import AddMoney from './components/AddMoney/AddMoney';
import Session from "./components/Session/Session";

export default function App() {

    const [isAuth] = React.useState(() => CookieManager.getCookie('jwt') != null);


    return (
        <Router>
            <div className="md:flex ">
                <Sidebar  />
                <div className="w-screen ">

                    <Routes>
                        {<Route index element={!isAuth ? <Home /> : <Navigate replace to="dashboard" />} />}

                        {<Route path="/dashboard" element={isAuth ? <Dashboard  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/teachers" element={isAuth ? <Teachers  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/applies" element={isAuth ? <Applies  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/account" element={isAuth ? <Account  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/messages" element={isAuth ? <Messages  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/upload-pb" element={isAuth ? <UploadPb  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/probleme" element={isAuth ? <Problems  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/create-session" element={isAuth ? <CreateSession  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/pay" element={isAuth ? <AddMoney  /> : <Navigate replace to="/login" />} />}
                        {<Route path="/session/:id" element={isAuth ? <Session  /> : <Navigate replace to="/login" />} />}

                        {/* !auth */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signout" element={<Signout />} />




                        <Route path="*" element={<Pg404 />} />
                    </Routes >
                </div >

            </div >
        </Router >
    );
}