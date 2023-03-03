import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const login = () => {
    axios
      .post("/api/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res);
        navigate("/model_summary/tw/iEM");
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <div className="container">
      <h1 className="display-4 text-center mt-5">台化公司設備AI預警軟體平台</h1>
      <div className="text-center">
        <img
          src={process.env.PUBLIC_URL + "/台化logo.png"}
          height="280"
          width="400"
        />
      </div>
      <div className="row justify-content-md-center">
        <div className="col-3">
          <div className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <p className="text-center text-danger"></p>
            <label htmlFor="inputID" className="sr-only">
              使用者
            </label>
            <input
              type="text"
              id="inputID"
              className="form-control"
              placeholder="Username"
              required
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <label htmlFor="inputPassword" className="sr-only">
              密碼
            </label>
            <input
              type="password"
              id="inputPassword"
              className="form-control"
              placeholder="Password"
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <button
              className="btn btn-primary w-100 mt-2"
              onClick={() => login()}
            >
              登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
