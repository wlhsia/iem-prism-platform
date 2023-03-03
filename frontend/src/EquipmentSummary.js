import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function EquipmentSummary() {
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
      .get(`/api/equipment_summary/${area}/${software}`)
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
      .patch(`/api/reservations/${area}/${software}/equipment`, data, {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        },
      })
      .catch((error) => {
        if (error.response.status == 401) {
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
                {f.factory}{" "}
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
              <td>{f["實際"]}</td>
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
              <td>{f["軟體啟動"]}</td>
              <td>{f["修模"]}</td>
              <td>{f["定檢"]}</td>
              <td>{f["配合產銷"]}</td>
              <td>{f["異常檢修"]}</td>
              <td>{f["保全/PI系統問題"]}</td>
              <td>{f["其他"]}</td>
              <td>{f["軟體未啟動原因未選擇"]}</td>
              <td>{f["OA啟動"]}</td>
              <td>{f["軟體未啟動"]}</td>
              <td>{f["建模完成驗證中"]}</td>
              <td>{f["OA其他"]}</td>
              <td>{f["OA未啟動原因未選擇"]}</td>
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
                    <td>{m["軟體啟動"]}</td>
                    <td>{m["修模"]}</td>
                    <td>{m["定檢"]}</td>
                    <td>{m["配合產銷"]}</td>
                    <td>{m["異常檢修"]}</td>
                    <td>{m["保全/PI系統問題"]}</td>
                    <td>{m["其他"]}</td>
                    <td>{m["軟體未啟動原因未選擇"]}</td>
                    <td>{m["OA啟動"]}</td>
                    <td>{m["軟體未啟動"]}</td>
                    <td>{m["建模完成驗證中"]}</td>
                    <td>{m["OA其他"]}</td>
                    <td>{m["OA未啟動原因未選擇"]}</td>
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
        各廠{software}設備AI監控啟停/OA傳簽設備台數彙總
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
                  設備
                  <br />
                  台數
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
              <th colSpan={7}>軟體未啟動原因({total["軟體未啟動原因"]})</th>
              <th rowSpan={2}>
                OA
                <br />啟<br />動
              </th>
              <th colSpan={4}>OA未啟動原因({total["OA未啟動原因"]})</th>
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
                <td>{total["實際"]}</td>
                <td>
                  {Date.parse(total["預完日"]).valueOf() < new Date().valueOf()
                    ? total["預完日"]
                    : `(${total["預完日"]})`}
                </td>
                <td>{total["軟體啟動"]}</td>
                <td>{total["修模"]}</td>
                <td>{total["定檢"]}</td>
                <td>{total["配合產銷"]}</td>
                <td>{total["異常檢修"]}</td>
                <td>{total["保全/PI系統問題"]}</td>
                <td>{total["其他"]}</td>
                <td>{total["軟體未啟動原因未選擇"]}</td>
                <td>{total["OA啟動"]}</td>
                <td>{total["軟體未啟動"]}</td>
                <td>{total["建模完成驗證中"]}</td>
                <td>{total["OA其他"]}</td>
                <td>{total["OA未啟動原因未選擇"]}</td>
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
