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
    ?????????: [
      { item: "???", value: "all" },
      { item: "ARO1", value: "ARO1" },
      { item: "ARO2", value: "ARO2" },
      { item: "ARO3", value: "ARO3" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "SM??????", value: "SM??????" },
      { item: "PHENOL", value: "PHENOL" },
      { item: "SM??????", value: "SM??????" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "??????PTA", value: "??????PTA" },
      { item: "HAC", value: "HAC" },
      { item: "??????PTA", value: "??????PTA" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "PP", value: "PP" },
      { item: "PC", value: "PC" },
      { item: "??????PABS", value: "??????PABS" },
      { item: "??????PABS", value: "??????PABS" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "????????????", value: "????????????" },
      { item: "????????????", value: "????????????" },
    ],
  };

  const nbfactories = {
    "": [],
    all: [],
    ?????????: [
      { item: "???", value: "all" },
      { item: "??????MX???", value: "??????MX???" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "???????????????", value: "???????????????" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "??????PABS???", value: "??????PABS???" },
    ],
    ?????????: [
      { item: "???", value: "all" },
      { item: "???????????????", value: "???????????????" },
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
      newRow.SoftStopReason === "??????" &&
      (newRow.SoftOtherReason == null || newRow.SoftOtherReason === "")
    ) {
      alert("?????????????????????");
    } else if (
      newRow.OAStopReason === "??????" &&
      (newRow.OAOtherReason == null || newRow.OAOtherReason === "")
    ) {
      alert("?????????????????????");
    } else {
      if (newRow.EquipmentID == null || newRow.EquipmentID === "") {
        alert("?????????????????????");
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
      link.setAttribute("download", "??????????????????AI??????????????????.csv");
      document.body.appendChild(link);
      link.click();
    });
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "??????",
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
      headerName: "??????",
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
      headerName: "?????????",
      width: 70,
    },
    {
      field: "Company",
      headerName: "??????",
      width: 40,
    },
    {
      field: "Division",
      headerName: "?????????",
      width: 70,
    },
    {
      field: "Factory",
      headerName: "?????????",
      width: 90,
    },
    {
      field: "Area",
      headerName: "?????????",
      width: 70,
    },
    {
      field: "ProcessType",
      headerName: "?????????",
      width: 150,
      editable: true,
    },
    {
      field: "EquipmentID",
      headerName: "????????????",
      width: 100,
      editable: true,
    },
    {
      field: "EquipmentName",
      headerName: "????????????",
      width: 200,
      editable: true,
    },
    {
      field: "ModelType",
      headerName: "????????????",
      width: 90,
      type: "singleSelect",
      valueOptions: ["", "?????????", "?????????", "?????????", "?????????"],
      editable: true,
    },
    {
      field: "ModelName",
      headerName: "????????????",
      width: 200,
    },
    {
      field: "id",
      headerName: "????????????",
      width: 80,
    },
    {
      field: "SoftStart",
      headerName: "????????????",
      type: "boolean",
      width: 80,
    },
    {
      field: "SoftStopReason",
      headerName: "?????????????????????",
      type: "singleSelect",
      valueOptions: [
        "",
        "??????",
        "??????",
        "????????????",
        "????????????",
        "??????/PI????????????",
        "??????",
      ],
      width: 150,
      editable: true,
    },
    {
      field: "SoftOtherReason",
      headerName: "????????????",
      width: 150,
      editable: true,
    },
    {
      field: "OAStart",
      headerName: "OA??????",
      type: "boolean",
      width: 80,
      editable: true,
    },
    {
      field: "OAStopReason",
      headerName: "OA???????????????",
      type: "singleSelect",
      valueOptions: ["", "?????????????????????", "??????"],
      width: 120,
      editable: true,
    },
    {
      field: "OAOtherReason",
      headerName: "????????????",
      width: 150,
      editable: true,
    },
    {
      field: "SoftStartDays",
      headerName: "??????????????????",
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
          ??????
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <Typography align="center" variant="h3" component="h2">
        {params.area === "tw" ? "iEM/PRiSM????????????" : "PRiSM????????????"}
      </Typography>
      <div className="row justify-content-between">
        <div className="col">
          {user.IsAdmin ? (
            <FormControl sx={{ m: 1, minWidth: 200 }}>
              <InputLabel id="division-select-label">?????????</InputLabel>
              <Select
                labelId="division-select-label"
                value={division}
                label="?????????"
                onChange={handleDivisionSelectChange}
              >
                <MenuItem key="all" value={"all"}>
                  ???
                </MenuItem>
                <MenuItem key="chem1" value={"?????????"}>
                  ?????????
                </MenuItem>
                <MenuItem key="chem2" value={"?????????"}>
                  ?????????
                </MenuItem>
                {params.area === "tw" ? (
                  <MenuItem key="chem3" value={"?????????"}>
                    ?????????
                  </MenuItem>
                ) : null}
                <MenuItem key="plastic" value={"?????????"}>
                  ?????????
                </MenuItem>
                <MenuItem key="egr" value={"?????????"}>
                  ?????????
                </MenuItem>
              </Select>
            </FormControl>
          ) : null}
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="factory-select-label">?????????</InputLabel>
            <Select
              labelId="factory-select-label"
              value={factory}
              label="?????????"
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
          ?????? <CircleIcon label="State" sx={{ color: yellow[500] }} />
          ?????? <CircleIcon label="State" sx={{ color: grey[300] }} />|
          <CircleIcon label="State" sx={{ color: grey[900] }} />
          ??????
          <br />
          PRiSM:&emsp;
          <CircleIcon label="State" sx={{ color: lightGreen[600] }} />
          ?????? <CircleIcon label="State" sx={{ color: yellow[500] }} />
          ??????
          <CircleIcon label="State" sx={{ color: red[700] }} />
          ??????
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
            toolbarColumns: "??????",
            columnsPanelTextFieldLabel: "????????????",
            columnsPanelTextFieldPlaceholder: "????????????",
            columnsPanelDragIconLabel: "????????????",
            columnsPanelShowAllButton: "????????????",
            columnsPanelHideAllButton: "????????????",
            toolbarFilters: "??????",
            filterPanelColumns: "??????",
            filterPanelOperators: "??????",
            filterPanelInputLabel: "???",
            filterPanelInputPlaceholder: "?????????",
            filterOperatorContains: "??????",
            filterOperatorEquals: "??????",
            filterOperatorStartsWith: "?????????",
            filterOperatorEndsWith: "?????????",
            filterOperatorIsEmpty: "??????",
            filterOperatorIsNotEmpty: "????????????",
            filterOperatorIsAnyOf: "???????????????",
            columnMenuShowColumns: "????????????",
            columnMenuFilter: "??????",
            columnMenuHideColumn: "????????????",
            columnMenuUnsort: "?????????",
            columnMenuSortAsc: "????????????",
            columnMenuSortDesc: "????????????",
            toolbarExport: "??????",
            toolbarExportCSV: "??????CSV???",
            toolbarExportPrint: "??????",
          }}
        />
      </Box>
      <Typography align="right" variant="h6">
        OA?????????: {OAStartNum}&emsp;OA?????????: {OAStopNum}&emsp;??????:
        {OAStartNum + OAStopNum}
      </Typography>
    </div>
  );
}
