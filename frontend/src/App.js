import * as React from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Navigation from "./Navigation";

function App() {

  return (
    <div>
      <Navigation></Navigation>
      <Outlet />
    </div>
  );
}
export default App;
