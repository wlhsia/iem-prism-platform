import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

export default function IconBreadcrumbs() {
  let navigate = useNavigate();
  function handleClick(event) {
    event.preventDefault();
    navigate(`/${event.target.id}`);
  }

  const logout = () => {
    axios.post("/api/logout").then((res) => {
      navigate("/login");
    });
  };

  const [user, setUser] = React.useState({});
  const [area, setArea] = React.useState("tw");

  React.useEffect(() => {
    axios.get("/api/user").then((res) => {
      setUser(res.data);
    });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row justify-content-between">
        <div className="col">
          <div role="presentation" onClick={handleClick}>
            <Breadcrumbs aria-label="breadcrumb">
              {area === "tw" ? (
                <Typography variant="h6" color="text.primary">
                  台灣廠區
                </Typography>
              ) : (
                <Link
                  variant="h6"
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  component="button"
                  onClick={() => {
                    console.log("tw");
                    setArea("tw");
                  }}
                >
                  台灣廠區
                </Link>
              )}
              {/* <Typography variant="h6" color="text.primary">
                寧波廠區
              </Typography> */}
              {area === "nb" ? (
                <Typography variant="h6" color="text.primary">
                  寧波廠區
                </Typography>
              ) : (
                <Link
                  variant="h6"
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  component="button"
                  onClick={() => {
                    setArea("nb");
                  }}
                >
                  寧波廠區
                </Link>
              )}
            </Breadcrumbs>
            {area === "tw" ? (
              <div>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href=""
                    id="model_summary/tw/iEM"
                  >
                    <ShowChartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    iEM模型彙總畫面
                  </Link>
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href=""
                    id="model_summary/tw/PRiSM"
                  >
                    <ShowChartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                    PRiSM模型彙總畫面
                  </Link>
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href="/"
                    id="datagrid/tw/all"
                  >
                    <FormatListBulletedIcon
                      sx={{ mr: 0.5 }}
                      fontSize="inherit"
                    />
                    iEM/PRiSM整合畫面
                  </Link>
                </Breadcrumbs>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href=""
                    id="equipment_summary/tw/iEM"
                  >
                    <PrecisionManufacturingIcon
                      sx={{ mr: 0.5 }}
                      fontSize="inherit"
                    />
                    iEM設備彙總畫面
                  </Link>
                  <Link
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center" }}
                    color="inherit"
                    href=""
                    id="equipment_summary/tw/PRiSM"
                  >
                    <PrecisionManufacturingIcon
                      sx={{ mr: 0.5 }}
                      fontSize="inherit"
                    />
                    PRiSM設備彙總畫面
                  </Link>
                </Breadcrumbs>
              </div>
            ) : (
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  href=""
                  id="model_summary/nb/PRiSM"
                >
                  <ShowChartIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  PRiSM模型彙總畫面
                </Link>
                <Link
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  href=""
                  id="equipment_summary/nb/PRiSM"
                >
                  <PrecisionManufacturingIcon
                    sx={{ mr: 0.5 }}
                    fontSize="inherit"
                  />
                  PRiSM設備彙總畫面
                </Link>
                <Link
                  underline="hover"
                  sx={{ display: "flex", alignItems: "center" }}
                  color="inherit"
                  href="/"
                  id="datagrid/nb/all"
                >
                  <FormatListBulletedIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  PRiSM整合畫面
                </Link>
              </Breadcrumbs>
            )}
          </div>
        </div>
        <div className="col-2 text-end" git branch>
          <p className="d-inline">
            <strong>{user.Description}</strong>
          </p>
          <button
            className="btn btn-outline-secondary ms-1"
            onClick={() => logout()}
          >
            登出
          </button>
        </div>
      </div>
    </div>
  );
}
