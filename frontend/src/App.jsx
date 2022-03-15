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
import { baseWsURL } from './utils/serverAPI';
import io from 'socket.io-client';
import CookieManager from "./utils/CookieManager";
import Signout from "./components/Signout/Signout";
import UploadPb from "./components/UploadPb/UploadPb";
import Problems from "./components/Problems/Problems";
import RtcStream from "./components/RtcStream/RtcStream";
import CreateSession from "./components/CreateSession/CreateSession";

const socket = io(baseWsURL);

export default function App() {
    const [connected, setConnected] = React.useState();

    React.useEffect(() => {

        socket.on('connected', message => {
            //console.log(message);
            setConnected(message);
        })

        socket.on('connect-user', message => {
            //console.log(message);
            const jwt = CookieManager.getCookie('jwt');
            if (jwt) {
                //console.log(jwt);
                socket.emit('connect-user', jwt);
            }
        })
        //console.log('here');

        
        return () => socket.close();//*/
    }, [])

    React.useEffect(() => {
        if (connected) {
            socket.emit('join-session', '');
        }
    }, [connected])


    const [isAuth] = React.useState(() => CookieManager.getCookie('jwt') != null);

    return (
        <Router>
            <div className="md:flex ">
                <Sidebar socket={socket} />
                <div className="w-screen ">

                    <Routes>
                        <Route index element={<Home />} />
                        
                        {<Route path="/dashboard" element={isAuth ? <Dashboard socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/teachers" element={isAuth ? <Teachers socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/applies" element={isAuth ? <Applies socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/account" element={isAuth ? <Account socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/messages" element={isAuth ? <Messages socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/upload-pb" element={isAuth ? <UploadPb socket={socket} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/probleme" element={isAuth ? <Problems socket={null} /> : <Navigate replace to="/login" />} />}
                        {<Route path="/create-session" element={isAuth ? <CreateSession socket={socket} /> : <Navigate replace to="/login" />} />}
                        {/* !auth */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signout" element={<Signout />} />

                        <Route path="/rtc" element={<RtcStream socket={socket} />} />


                        <Route path="*" element={<Pg404 />} />
                    </Routes>
                </div>

            </div>
        </Router >
    );
}