import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Table from "./Table";

const PoseTable = () => (
  <DataProvider endpoint="/poses/poses/"
                render={data => <Table data={data} />} />
);
const wrapper = document.getElementById("pose-table-container");
wrapper ? ReactDOM.render(<PoseTable />, wrapper) : null;

