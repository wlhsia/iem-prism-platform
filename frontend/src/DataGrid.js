import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import Box from "@mui/material/Box";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import CircleIcon from "@mui/icons-material/Circle";

import { alpha, styled } from "@mui/material/styles";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  gridClasses,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  // GridToolbarExport,
} from "@mui/x-data-grid";
import { lightGreen, yellow, grey, red } from "@mui/material/colors";

const ODD_OPACITY = 0.2;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
            theme.palette.action.selectedOpacity +
            theme.palette.action.hoverOpacity
        ),
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export default function Grid() {
  const params = useParams();
  let navigate = useNavigate();
  const [queryParams, setQueryParams] = React.useState(params);
  const [user, setUser] = React.useState({
    Description: "",
  });
  const [division, setDivision] = React.useState("all");
  const [factory, setFactory] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [OAStartNum, setOAStartNum] = React.useState(0);
  const [OAStopNum, setOAStopNum] = React.useState(0);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
  const twfactories = {
    "": [],
    all: [],
    化一部: [
      { item: "全", value: "all" },
      { item: "ARO1", value: "ARO1" },
      { item: "ARO2", value: "ARO2" },
      { item: "ARO3", value: "ARO3" },
    ],
    化二部: [
      { item: "全", value: "all" },
      { item: "SM麥寮", value: "SM麥寮" },
      { item: "PHENOL", value: "PHENOL" },
      { item: "SM海豐", value: "SM海豐" },
    ],
    化三部: [
      { item: "全", value: "all" },
      { item: "麥寮PTA", value: "麥寮PTA" },
      { item: "HAC", value: "HAC" },
      { item: "龍德PTA", value: "龍德PTA" },
    ],
    塑膠部: [
      { item: "全", value: "all" },
      { item: "PP", value: "PP" },
      { item: "PC", value: "PC" },
      { item: "麥寮PABS", value: "麥寮PABS" },
      { item: "新港PABS", value: "新港PABS" },
    ],
    工務部: [
      { item: "全", value: "all" },
      { item: "新港公用", value: "新港公用" },
      { item: "龍德公用", value: "龍德公用" },
    ],
  };

  const nbfactories = {
    "": [],
    all: [],
    化一部: [
      { item: "全", value: "all" },
      { item: "寧波MX廠", value: "寧波MX廠" },
    ],
    化二部: [
      { item: "全", value: "all" },
      { item: "寧波苯酚廠", value: "寧波苯酚廠" },
    ],
    塑膠部: [
      { item: "全", value: "all" },
      { item: "寧波PABS廠", value: "寧波PABS廠" },
    ],
    工務部: [
      { item: "全", value: "all" },
      { item: "寧波熱電廠", value: "寧波熱電廠" },
    ],
  };

  const handleDivisionSelectChange = (event) => {
    setFactory("all");
    setDivision(event.target.value);
    setQueryParams({
      area: params.area,
      software: "all",
      division: event.target.value,
    });
  };

  const handleFactorySelectChange = (event) => {
    setFactory(event.target.value);
    setQueryParams({
      area: params.area,
      software: "all",
      division: division,
      factory: event.target.value,
    });
  };

  const fetchData = () => {
    axios
      .post("/api/models", queryParams, {
        headers: {
          "X-CSRF-TOKEN": getCookie("csrf_access_token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setRows(response.data.models);
        setOAStartNum(response.data.oaStartNum);
        setOAStopNum(response.data.oaStopNum);
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/login");
        }
      });
  };

  React.useEffect(() => {
    fetchData();
    axios.get("/api/user").then((res) => {
      setUser(res.data);
    });
  }, [queryParams]);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow) => {
    if (
      newRow.SoftStopReason === "其他" &&
      (newRow.SoftOtherReason == null || newRow.SoftOtherReason === "")
    ) {
      alert("請輸入其他說明");
    } else if (
      newRow.OAStopReason === "其他" &&
      (newRow.OAOtherReason == null || newRow.OAOtherReason === "")
    ) {
      alert("請輸入其他說明");
    } else {
      if (newRow.EquipmentID == null || newRow.EquipmentID === "") {
        alert("請輸入設備編號");
      } else {
        if (newRow.OAStart) {
          newRow.OAStopReason = "";
        }
        await axios.patch(
          `/api/models/${params.area}/${newRow.ModelID}`,
          newRow,
          {
            headers: {
              "X-CSRF-TOKEN": getCookie("csrf_access_token"),
            },
          }
        );
        await fetchData();
        return newRow;
      }
    }
  };

  const handleExportClick = () => {
    console.log("handleExportClick");
    axios({
      url: "/api/export",
      method: "POST",
      data: rows,
      responseType: "blob",
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "台化公司設備AI預警軟體平台.csv");
      document.body.appendChild(link);
      link.click();
    });
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "編輯",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
        ];
      },
    },
    {
      field: "ModelState",
      headerName: "狀態",
      width: 50,
      renderCell: (params) => {
        const StateColors = {
          1: grey[300],
          2: yellow[500],
          3: grey[900],
          4: lightGreen[600],
          5: red[700],
        };
        return (
          <CircleIcon label="State" sx={{ color: StateColors[params.value] }} />
        );
      },
    },
    {
      field: "Software",
      headerName: "軟體別",
      width: 70,
    },
    {
      field: "Company",
      headerName: "公司",
      width: 40,
    },
    {
      field: "Division",
      headerName: "事業部",
      width: 70,
    },
    {
      field: "Factory",
      headerName: "生產廠",
      width: 90,
    },
    {
      field: "Area",
      headerName: "廠區別",
      width: 70,
    },
    {
      field: "ProcessType",
      headerName: "製程別",
      width: 150,
      editable: true,
    },
    {
      field: "EquipmentID",
      headerName: "設備編號",
      width: 100,
      editable: true,
    },
    {
      field: "EquipmentName",
      headerName: "設備名稱",
      width: 200,
      editable: true,
    },
    {
      field: "ModelType",
      headerName: "模型類別",
      width: 90,
      type: "singleSelect",
      valueOptions: ["", "靜態模", "轉機模", "電儀模", "製程模"],
      editable: true,
    },
    {
      field: "ModelName",
      headerName: "模型名稱",
      width: 200,
    },
    {
      field: "id",
      headerName: "模型序號",
      width: 80,
    },
    {
      field: "SoftStart",
      headerName: "軟體啟動",
      type: "boolean",
      width: 80,
    },
    {
      field: "SoftStopReason",
      headerName: "軟體未啟動原因",
      type: "singleSelect",
      valueOptions: [
        "",
        "修模",
        "定檢",
        "配合產銷",
        "異常檢修",
        "保全/PI系統問題",
        "其他",
      ],
      width: 150,
      editable: true,
    },
    {
      field: "SoftOtherReason",
      headerName: "其他說明",
      width: 150,
      editable: true,
    },
    {
      field: "OAStart",
      headerName: "OA啟動",
      type: "boolean",
      width: 80,
      editable: true,
    },
    {
      field: "OAStopReason",
      headerName: "OA未啟動原因",
      type: "singleSelect",
      valueOptions: ["", "建模完成驗證中", "其他"],
      width: 120,
      editable: true,
    },
    {
      field: "OAOtherReason",
      headerName: "其他說明",
      width: 150,
      editable: true,
    },
    {
      field: "SoftStartDays",
      headerName: "軟體啟動天數",
      width: 100,
    },
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {/* <GridToolbarExport /> */}
        <Button
          color="primary"
          component="label"
          size="small"
          onClick={handleExportClick}
        >
          <FileDownloadIcon fontSize="small" />
          匯出
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <Typography align="center" variant="h3" component="h2">
        {params.area === "tw" ? "iEM/PRiSM整合畫面" : "PRiSM整合畫面"}
      </Typography>
      <div className="row justify-content-between">
        <div className="col">
          {user.IsAdmin ? (
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="division-select-label">事業部</InputLabel>
              <Select
                labelId="division-select-label"
                value={division}
                label="事業部"
                onChange={handleDivisionSelectChange}
              >
                <MenuItem key="all" value={"all"}>
                  全
                </MenuItem>
                <MenuItem key="chem1" value={"化一部"}>
                  化一部
                </MenuItem>
                <MenuItem key="chem2" value={"化二部"}>
                  化二部
                </MenuItem>
                {params.area === "tw" ? (
                  <MenuItem key="chem3" value={"化三部"}>
                    化三部
                  </MenuItem>
                ) : null}
                <MenuItem key="plastic" value={"塑膠部"}>
                  塑膠部
                </MenuItem>
                <MenuItem key="egr" value={"工務部"}>
                  工務部
                </MenuItem>
              </Select>
            </FormControl>
          ) : null}
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="factory-select-label">生產廠</InputLabel>
            <Select
              labelId="factory-select-label"
              value={factory}
              label="生產廠"
              onChange={handleFactorySelectChange}
            >
              {params.area === "tw"
                ? user.IsAdmin
                  ? twfactories[division].map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.item}
                      </MenuItem>
                    ))
                  : twfactories[user.Description].map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.item}
                      </MenuItem>
                    ))
                : user.IsAdmin
                ? nbfactories[division].map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.item}
                    </MenuItem>
                  ))
                : nbfactories[user.Description].map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.item}
                    </MenuItem>
                  ))}
            </Select>
          </FormControl>
        </div>
        <div className="col text-end align-self-end">
          iEM:&emsp;
          <CircleIcon label="State" sx={{ color: lightGreen[600] }} />
          正常 <CircleIcon label="State" sx={{ color: yellow[500] }} />
          異動 <CircleIcon label="State" sx={{ color: grey[300] }} />|
          <CircleIcon label="State" sx={{ color: grey[900] }} />
          停機
          <br />
          PRiSM:&emsp;
          <CircleIcon label="State" sx={{ color: lightGreen[600] }} />
          正常 <CircleIcon label="State" sx={{ color: yellow[500] }} />
          警告
          <CircleIcon label="State" sx={{ color: red[700] }} />
          警報
        </div>
      </div>

      <Box
        sx={{
          height: 760,
          width: "100%",
        }}
      >
        <StripedDataGrid
          sx={{
            boxShadow: 5,
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          components={{ Toolbar: CustomToolbar }}
          experimentalFeatures={{ newEditingApi: true }}
          isCellEditable={(params) => {
            return !(
              (params.row.Software === "iEM" &&
                params.field === "ProcessType") ||
              (params.row.Software === "iEM" &&
                params.field === "EquipmentID") ||
              (params.row.Software === "iEM" &&
                params.field === "EquipmentName") ||
              (params.row.SoftStart && params.field === "SoftStopReason") ||
              (!params.row.SoftStart && params.field === "OAStart") ||
              (!params.row.SoftStart && params.field === "OAStopReason") ||
              (params.row.OAStart && params.field === "OAStopReason") ||
              (params.row.SoftStartDays >= 90 && params.field === "OAStart")
            );
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
          localeText={{
            toolbarColumns: "欄位",
            columnsPanelTextFieldLabel: "找尋欄位",
            columnsPanelTextFieldPlaceholder: "欄位名稱",
            columnsPanelDragIconLabel: "重新排序",
            columnsPanelShowAllButton: "顯示全部",
            columnsPanelHideAllButton: "隱藏全部",
            toolbarFilters: "篩選",
            filterPanelColumns: "欄位",
            filterPanelOperators: "算式",
            filterPanelInputLabel: "值",
            filterPanelInputPlaceholder: "篩選值",
            filterOperatorContains: "包含",
            filterOperatorEquals: "等於",
            filterOperatorStartsWith: "開始於",
            filterOperatorEndsWith: "結束於",
            filterOperatorIsEmpty: "空值",
            filterOperatorIsNotEmpty: "不是空值",
            filterOperatorIsAnyOf: "是任何一個",
            columnMenuShowColumns: "顯示欄位",
            columnMenuFilter: "篩選",
            columnMenuHideColumn: "隱藏欄位",
            columnMenuUnsort: "無排序",
            columnMenuSortAsc: "升冪排序",
            columnMenuSortDesc: "降冪排序",
            toolbarExport: "匯出",
            toolbarExportCSV: "下載CSV檔",
            toolbarExportPrint: "列印",
          }}
        />
      </Box>
      <Typography align="right" variant="h6">
        OA啟動數: {OAStartNum}&emsp;OA關閉數: {OAStopNum}&emsp;總數:
        {OAStartNum + OAStopNum}
      </Typography>
    </div>
  );
}
