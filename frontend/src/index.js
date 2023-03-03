import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "bootstrap/dist/css/bootstrap.css";

import Login from "./Login";
import EquipmentSummary from "./EquipmentSummary";
import ModelSummary from "./ModelSummary";
import DataGrid from "./DataGrid";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<App />}>
          <Route
            path="equipment_summary/:area/:software"
            element={<EquipmentSummary />}
          />
          <Route path="model_summary/:area/:software" element={<ModelSummary />} />
          <Route path="datagrid">
            <Route index element={<DataGrid />} />
            <Route path=":area/:software" element={<DataGrid />} />
            <Route path=":area/:software/:division" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory/:modelType" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory/:modelType/:softStart" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory/:modelType/:softStart/:softStopReason" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory/:modelType/:softStart/:softStopReason/:oaStart" element={<DataGrid />} />
            <Route path=":area/:software/:division/:factory/:modelType/:softStart/:softStopReason/:oaStart/:oaStopReason" element={<DataGrid />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
