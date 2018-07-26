import React from "react";
import ReactDOM from "react-dom";
import TopNav from "./TopNav";
import "./PoseTable";

const topnav = document.getElementById("topnav");
topnav ? ReactDOM.render(<TopNav />, topnav) : null;
