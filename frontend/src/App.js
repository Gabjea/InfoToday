import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Home from "./components/Home/Home";
import Pg404 from "./components/Pg404/Pg404";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Sidebar from "./components/Sidebar/Sidebar";

export default function BasicExample() {
    return (
        <Router>
            <div className="md:flex">
            <Sidebar />
            <div className="w-screen h-screen ">
               
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Pg404 />} />

                </Routes>
                </div>
            
            </div>
        </Router >
    );
}