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

export default function BasicExample() {
    return (
        <Router>
            <div>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                </ul>

                <hr />

                {/*
          A <Routes> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Routes> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Pg404 />} />

                </Routes>
            </div>
        </Router>
    );
}