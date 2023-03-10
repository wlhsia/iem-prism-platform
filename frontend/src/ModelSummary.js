import * as React from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function ModelSummary() {
  let navigate = useNavigate();
  const { area } = useParams();
  const { software } = useParams();
  const [tbody, setTbody] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [total, setTotal] = React.useState({});
  const [isInEditMode, setEditMode] = React.useState(false);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  React.useEffect(() => {
    console.log("getdata");
    axios
      .get(`/api/model_summary/${area}/${software}`)
      .then((res) => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  }, [software]);

  React.useEffect(() => {
    console.log("tbodyRender");
    tbodyRender();
  }, [data, isInEditMode]);

  const handleOpenAllClick = () => {
    const newData = data;
    newData.forEach((d) => {
      d.modelShowNumber = d.factories.length;
      d.factories.forEach((f) => {
        f.modolsShow = true;
      });
    });
    setData(newData);
    tbodyRender();
  };

  const handleCloseAllClick = () => {
    const newData = data;
    newData.forEach((d) => {
      d.modelShowNumber = 0;
      d.factories.forEach((f) => {
        f.modolsShow = false;
      });
    });
    setData(newData);
    tbodyRender();
  };

  const handleFactoryClick = (division, factory) => {
    const newData = data;
    const divisionData = newData.find((d) => d.division === division);
    const factoryData = divisionData.factories.find(
      (f) => f.factory === factory
    );
    factoryData.modolsShow = !factoryData.modolsShow;
    divisionData.modelShowNumber = divisionData.factories.filter(
      (f) => f.modolsShow
    ).length;
    setData(newData);
    tbodyRender();
  };

  const handaleQuantityInput = (event, d_index, f_index) => {
    console.log(d_index, f_index);
    console.log(event);
    setData((prevState) => {
      prevState[d_index].factories[f_index]["??????"] = event.target.value;
      return [...prevState];
    });
  };

  const setReservations = () => {
    axios
      .patch(`/api/reservations/${area}/${software}/model`, data, {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        },
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  };

  const tbodyRender = () => {
    const newTbody = [];
    data.forEach((d, d_index) => {
      newTbody.push(
        <tr key={d.division}>
          <td rowSpan={d.factories.length + d.modelShowNumber * 4 + 1}>
            {d.division}
          </td>
        </tr>
      );
      if (d.factories.length !== 0) {
        d.factories.forEach((f, f_index) => {
          newTbody.push(
            <tr key={f.factory}>
              <td>
                {f.factory}
                {f.modolsShow ? (
                  <IndeterminateCheckBoxIcon
                    color="primary"
                    onClick={() => handleFactoryClick(d.division, f.factory)}
                  />
                ) : (
                  <AddBoxIcon
                    color="primary"
                    onClick={() => handleFactoryClick(d.division, f.factory)}
                  />
                )}
              </td>
              <td>
                {isInEditMode ? (
                  <TextField
                    name={f.factory}
                    value={f["??????"]}
                    size="small"
                    type="number"
                    sx={{ width: "8ch" }}
                    onChange={(event) =>
                      handaleQuantityInput(event, d_index, f_index)
                    }
                  />
                ) : (
                  f["??????"]
                )}
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}`}
                >
                  {f["??????"]}
                </Link>
              </td>
              <td>
                {isInEditMode ? (
                  <DatePicker
                    inputFormat="yyyy/MM/dd"
                    value={new Date(f["?????????"])}
                    onChange={(newValue) => {
                      setData((prevState) => {
                        console.log(
                          prevState[d_index].factories[f_index]["?????????"]
                        );
                        prevState[d_index].factories[f_index][
                          "?????????"
                        ] = `${newValue.getFullYear()}/${
                          newValue.getMonth() + 1
                        }/${newValue.getDate()}`;
                        return [...prevState];
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        sx={{ width: "18ch" }}
                        {...params}
                      />
                    )}
                  />
                ) : Date.parse(f["?????????"]).valueOf() < new Date().valueOf() ? (
                  f["?????????"]
                ) : (
                  `(${f["?????????"]})`
                )}
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true`}
                >
                  {f["????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/??????`}
                >
                  {f["??????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/??????`}
                >
                  {f["??????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/????????????`}
                >
                  {f["????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/????????????`}
                >
                  {f["????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/??????%2FPI????????????`}
                >
                  {f["??????/PI????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/??????`}
                >
                  {f["??????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/%20`}
                >
                  {f["??????????????????????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/true`}
                >
                  {f["OA??????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/pass/false/???????????????`}
                >
                  {f["???????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/?????????????????????`}
                >
                  {f["?????????????????????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/??????`}
                >
                  {f["OA??????"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/%20`}
                >
                  {f["OA????????????????????????"]}
                </Link>
              </td>
            </tr>
          );
          if (f.models.length !== 0) {
            if (f.modolsShow) {
              f.models.forEach((m) => {
                newTbody.push(
                  <tr key={`${f.factory}${m.type}`}>
                    <td className="text-end" colSpan={4}>
                      {m.type}
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true`}
                      >
                        {m["????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/??????`}
                      >
                        {m["??????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/??????`}
                      >
                        {m["??????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/????????????`}
                      >
                        {m["????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/????????????`}
                      >
                        {m["????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/??????%2FPI????????????`}
                      >
                        {m["??????/PI????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/??????`}
                      >
                        {m["??????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/%20`}
                      >
                        {m["??????????????????????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/ture`}
                      >
                        {m["OA??????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/pass/false/???????????????`}
                      >
                        {m["???????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/?????????????????????`}
                      >
                        {m["?????????????????????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/??????`}
                      >
                        {m["OA??????"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/%20`}
                      >
                        {m["OA????????????????????????"]}
                      </Link>
                    </td>
                  </tr>
                );
              });
            }
          }
        });
      }
    });
    setTbody(newTbody);
  };

  return (
    <div className="container">
      <h1 className="text-center">
        ??????{software}??????AI????????????/OA?????????????????????
      </h1>
      <div className="text-end">
        <button
          className="btn btn-success"
          onClick={() => handleOpenAllClick()}
        >
          ??????
        </button>
        <button
          className="btn btn-danger ms-1"
          onClick={() => handleCloseAllClick()}
        >
          ??????
        </button>
        <table className="table table-bordered border-dark mt-1 text-center align-middle">
          <thead className="align-middle">
            <tr>
              <th rowSpan={3}>
                <div align="right">
                  ??????
                  <br />
                  ??????
                </div>
                <br />
                <br />
                <div align="left">?????????</div>
              </th>
              <th rowSpan={3}>
                ???<br />???<br />???
              </th>
              <th rowSpan={3}>
                ???<br />???
              </th>
              <th rowSpan={3}>
                ???<br />???
              </th>
              <th rowSpan={3}>
                ???<br />???<br />???
              </th>
              <th colSpan={8}>?????????????????????</th>
              <th colSpan={5}>OA???????????????</th>
            </tr>
            <tr>
              <th rowSpan={2}>
                ??????
                <br />???<br />???
              </th>
              <th colSpan={7}>
                ?????????????????????(
                <Link to={`../datagrid/${area}/${software}/all/all/pass/false`}>
                  {total["?????????????????????"]}
                </Link>
                )
              </th>
              <th rowSpan={2}>
                OA
                <br />???<br />???
              </th>
              <th colSpan={4}>
                OA???????????????(
                <Link
                  to={`../datagrid/${area}/${software}/all/all/pass/pass/pass/false`}
                >
                  {total["OA???????????????"]}
                </Link>
                )
              </th>
            </tr>
            <tr>
              <th>
                ???<br />???
              </th>
              <th>
                ???<br />???
              </th>
              <th>
                ??????
                <br />
                ??????
              </th>
              <th>
                ??????
                <br />
                ??????
              </th>
              <th>
                ??????/PI
                <br />
                ????????????
              </th>
              <th>
                ???<br />???
              </th>
              <th>
                ?????????
                <br />
                ??????
              </th>
              <th>
                ??????
                <br />
                ?????????
              </th>
              <th>
                ????????????
                <br />
                ?????????
              </th>
              <th>
                ???<br />???
              </th>
              <th>
                ?????????
                <br />
                ??????
              </th>
            </tr>
          </thead>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <tbody>{tbody.map((ele) => ele)}</tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>??????</td>
                <td>{total["??????"]}</td>
                <td>
                  <Link to={`../datagrid/${area}/${software}/all`}>
                    {total["??????"]}
                  </Link>
                </td>
                <td>
                  {Date.parse(total["?????????"]).valueOf() < new Date().valueOf()
                    ? total["?????????"]
                    : `(${total["?????????"]})`}
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true`}
                  >
                    {total["????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/??????`}
                  >
                    {total["??????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/??????`}
                  >
                    {total["??????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/????????????`}
                  >
                    {total["????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/????????????`}
                  >
                    {total["????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/??????%2FPI????????????`}
                  >
                    {total["??????/PI????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/??????`}
                  >
                    {total["??????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/%20`}
                  >
                    {total["??????????????????????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/true`}
                  >
                    {total["OA??????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/pass/false/???????????????`}
                  >
                    {total["???????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/?????????????????????`}
                  >
                    {total["?????????????????????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/??????`}
                  >
                    {total["OA??????"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/%20`}
                  >
                    {total["OA????????????????????????"]}
                  </Link>
                </td>
              </tr>
            </tfoot>
          </LocalizationProvider>
        </table>
        {isInEditMode ? (
          <button
            className="btn btn-warning"
            onClick={() => {
              setEditMode(false);
              setReservations();
            }}
          >
            ??????
          </button>
        ) : (
          <button
            className="btn btn-outline-warning"
            onClick={() => {
              setEditMode(true);
            }}
          >
            ??????
          </button>
        )}
      </div>
    </div>
  );
}
