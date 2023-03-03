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
      prevState[d_index].factories[f_index]["預定"] = event.target.value;
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
                    value={f["預定"]}
                    size="small"
                    type="number"
                    sx={{ width: "8ch" }}
                    onChange={(event) =>
                      handaleQuantityInput(event, d_index, f_index)
                    }
                  />
                ) : (
                  f["預定"]
                )}
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}`}
                >
                  {f["實際"]}
                </Link>
              </td>
              <td>
                {isInEditMode ? (
                  <DatePicker
                    inputFormat="yyyy/MM/dd"
                    value={new Date(f["預完日"])}
                    onChange={(newValue) => {
                      setData((prevState) => {
                        console.log(
                          prevState[d_index].factories[f_index]["預完日"]
                        );
                        prevState[d_index].factories[f_index][
                          "預完日"
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
                ) : Date.parse(f["預完日"]).valueOf() < new Date().valueOf() ? (
                  f["預完日"]
                ) : (
                  `(${f["預完日"]})`
                )}
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true`}
                >
                  {f["軟體啟動"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/修模`}
                >
                  {f["修模"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/定檢`}
                >
                  {f["定檢"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/配合產銷`}
                >
                  {f["配合產銷"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/異常檢修`}
                >
                  {f["異常檢修"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/保全%2FPI系統問題`}
                >
                  {f["保全/PI系統問題"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/其他`}
                >
                  {f["其他"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/%20`}
                >
                  {f["軟體未啟動原因未選擇"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/true`}
                >
                  {f["OA啟動"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/false/pass/false/軟體未啟動`}
                >
                  {f["軟體未啟動"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/建模完成驗證中`}
                >
                  {f["建模完成驗證中"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/其他`}
                >
                  {f["OA其他"]}
                </Link>
              </td>
              <td>
                <Link
                  to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/pass/true/%20/false/%20`}
                >
                  {f["OA未啟動原因未選擇"]}
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
                        {m["軟體啟動"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/修模`}
                      >
                        {m["修模"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/定檢`}
                      >
                        {m["定檢"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/配合產銷`}
                      >
                        {m["配合產銷"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/異常檢修`}
                      >
                        {m["異常檢修"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/保全%2FPI系統問題`}
                      >
                        {m["保全/PI系統問題"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/其他`}
                      >
                        {m["其他"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/%20`}
                      >
                        {m["軟體未啟動原因未選擇"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/ture`}
                      >
                        {m["OA啟動"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/false/pass/false/軟體未啟動`}
                      >
                        {m["軟體未啟動"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/建模完成驗證中`}
                      >
                        {m["建模完成驗證中"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/其他`}
                      >
                        {m["OA其他"]}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`../datagrid/${area}/${software}/${d.division}/${f.factory}/${m.type}/true/%20/false/%20`}
                      >
                        {m["OA未啟動原因未選擇"]}
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
        各廠{software}設備AI監控啟停/OA傳簽模型數彙總
      </h1>
      <div className="text-end">
        <button
          className="btn btn-success"
          onClick={() => handleOpenAllClick()}
        >
          展開
        </button>
        <button
          className="btn btn-danger ms-1"
          onClick={() => handleCloseAllClick()}
        >
          收合
        </button>
        <table className="table table-bordered border-dark mt-1 text-center align-middle">
          <thead className="align-middle">
            <tr>
              <th rowSpan={3}>
                <div align="right">
                  模型
                  <br />
                  數量
                </div>
                <br />
                <br />
                <div align="left">事業部</div>
              </th>
              <th rowSpan={3}>
                生<br />產<br />廠
              </th>
              <th rowSpan={3}>
                預<br />定
              </th>
              <th rowSpan={3}>
                實<br />際
              </th>
              <th rowSpan={3}>
                預<br />完<br />日
              </th>
              <th colSpan={8}>設備建模完成數</th>
              <th colSpan={5}>OA預警傳簽數</th>
            </tr>
            <tr>
              <th rowSpan={2}>
                軟體
                <br />啟<br />動
              </th>
              <th colSpan={7}>
                軟體未啟動原因(
                <Link to={`../datagrid/${area}/${software}/all/all/pass/false`}>
                  {total["軟體未啟動原因"]}
                </Link>
                )
              </th>
              <th rowSpan={2}>
                OA
                <br />啟<br />動
              </th>
              <th colSpan={4}>
                OA未啟動原因(
                <Link
                  to={`../datagrid/${area}/${software}/all/all/pass/pass/pass/false`}
                >
                  {total["OA未啟動原因"]}
                </Link>
                )
              </th>
            </tr>
            <tr>
              <th>
                修<br />模
              </th>
              <th>
                定<br />檢
              </th>
              <th>
                配合
                <br />
                產銷
              </th>
              <th>
                異常
                <br />
                檢修
              </th>
              <th>
                保全/PI
                <br />
                系統問題
              </th>
              <th>
                其<br />他
              </th>
              <th>
                未選擇
                <br />
                原因
              </th>
              <th>
                軟體
                <br />
                未啟動
              </th>
              <th>
                建模完成
                <br />
                驗證中
              </th>
              <th>
                其<br />他
              </th>
              <th>
                未選擇
                <br />
                原因
              </th>
            </tr>
          </thead>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <tbody>{tbody.map((ele) => ele)}</tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>合計</td>
                <td>{total["預定"]}</td>
                <td>
                  <Link to={`../datagrid/${area}/${software}/all`}>
                    {total["實際"]}
                  </Link>
                </td>
                <td>
                  {Date.parse(total["預完日"]).valueOf() < new Date().valueOf()
                    ? total["預完日"]
                    : `(${total["預完日"]})`}
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true`}
                  >
                    {total["軟體啟動"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/修模`}
                  >
                    {total["修模"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/定檢`}
                  >
                    {total["定檢"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/配合產銷`}
                  >
                    {total["配合產銷"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/異常檢修`}
                  >
                    {total["異常檢修"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/保全%2FPI系統問題`}
                  >
                    {total["保全/PI系統問題"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/其他`}
                  >
                    {total["其他"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/%20`}
                  >
                    {total["軟體未啟動原因未選擇"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/true`}
                  >
                    {total["OA啟動"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/false/pass/false/軟體未啟動`}
                  >
                    {total["軟體未啟動"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/建模完成驗證中`}
                  >
                    {total["建模完成驗證中"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/其他`}
                  >
                    {total["OA其他"]}
                  </Link>
                </td>
                <td>
                  <Link
                    to={`../datagrid/${area}/${software}/all/all/pass/true/%20/false/%20`}
                  >
                    {total["OA未啟動原因未選擇"]}
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
            完成
          </button>
        ) : (
          <button
            className="btn btn-outline-warning"
            onClick={() => {
              setEditMode(true);
            }}
          >
            編輯
          </button>
        )}
      </div>
    </div>
  );
}
