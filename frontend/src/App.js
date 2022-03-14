import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
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

export default function BasicExample() {
    const [x, setX] = React.useState();

    React.useEffect(() => {
        socket.on('connected', message => {
            //console.log(message);
            setX(message);
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
        if (x) {
            socket.emit('join-session', 'wuj');
        }
    }, [x])

    return (
        <Router>
            <div className="md:flex ">
                <Sidebar socket={socket} />
                <div className="w-screen ">

                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard socket={socket} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/applies" element={<Applies />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/messages" element={<Messages socket={socket} />} />
                        <Route path="/signout" element={<Signout />} />
                        <Route path="/upload-pb" element={<UploadPb />} />
                        <Route path="/probleme" element={<Problems socket={socket} />} />
                        <Route path="/rtc" element={<RtcStream socket={socket} x={x} />} />
                        <Route path="/create-session" element={<CreateSession />} />

                        <Route path="*" element={<Pg404 />} />
                    </Routes>
                </div>

            </div>
        </Router >
    );
}