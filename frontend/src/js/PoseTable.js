import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import SsbTable from "./Table";

var header = [
    "English Name",
    "Sanskrit Name",
    "Body Position",
    "Spinal Position",
    "Challenge Level"
];
const PoseTable = () => (
  <DataProvider endpoint="/poses/poses/"
                render={data => <SsbTable header={header} data={data} orderBy='english_name' />} />
);
const wrapper = document.getElementById("pose-table-container");
wrapper ? ReactDOM.render(<PoseTable />, wrapper) : null;

