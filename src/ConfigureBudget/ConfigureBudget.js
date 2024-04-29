import React, { useEffect, useState } from "react";
import "./ConfigureBudget.css";
// import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
// import Chip from '@mui/material/Chip';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from "@mui/material/TableCell";
import Navbar from "../Navbar";
import DeleteIcon from '@mui/icons-material/Delete';


import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import {
  Button,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Chip,
  TextField,
  Paper,
  TableContainer,
  IconButton,
} from "@mui/material";
import BudgetForm from "./BudgetForm";
import EditIcon from '@mui/icons-material/Edit';
import BudgetCard from "./BudgetCard";
const ConfigureBudget = (props) => {
  const [catagory, setCatagory] = useState("");
  const [chipData, setChipData] = useState({});
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [catagoryBudget, setCatagoryBudget] = useState("");
  const [calculatedAmmount, setCalculatedAmmount] = useState(0);
  const [budgetId, setBudgetId] = useState("");
  const [budgetName, setBudgetName] = useState("");

  const {
    getBudgetData,
    addBudgetData,
    budgetsData,
    createCatgory,
    deleteCategory,
  } = props;
  // console.log(budgetsData);
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#424bf995",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
      fontFamily: '"Agbalumo", system-ui',
      color: 'black'
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#12006c",
      fontFamily: '"Agbalumo", system-ui',
      color: theme.palette.common.white,
      fontSize: 20,
      fontWeight: 700
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      color: 'black'
    },
  }));

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await getBudgetData();
      } catch (er) {
        alert("Something went Wrong", er.message);
      }
    };
    fetchBudgetData();
  }, []);

  useEffect(() => {
    if (budgetsData != null && Object.keys(budgetsData).length > 0) {
      setBudgetId(budgetsData._id);
      setMonthlyBudget(budgetsData.totalAmount);
      setBudgetName(budgetsData.name);
      const { categories } = budgetsData;

      const transformedObject = categories.reduce((result, item) => {
        result[item.name] = item.allocatedAmount;
        return result;
      }, {});
      setChipData(transformedObject);

      let totalCategoryAmount = 0;
      budgetsData.categories.map((cat) => {
        totalCategoryAmount += cat.allocatedAmount;
      });
      setCalculatedAmmount(totalCategoryAmount);
    }
  }, [budgetsData]);

  const handleDataSubmit = async () => {
    try {
      await addBudgetData(budgetName, monthlyBudget, chipData);
    } catch (er) {
      alert("Something went Wrong");
    }
  };

  const handleChipData = async () => {
    if (budgetsData && Object.keys(budgetsData).length > 0) {
      try {
        await createCatgory(catagory, catagoryBudget, budgetId);
      } catch (er) {
        alert("Something went Wrong");
      }
    }
    // else {
    const newChipObject = {
      ...chipData,
      ...{ [catagory]: catagoryBudget },
    };
    setCalculatedAmmount(
      parseInt(calculatedAmmount) + parseInt(catagoryBudget)
    );
    setChipData(newChipObject);
    // }
    // handleDataSubmit();
    setCatagoryBudget("");
    setCatagory("");
  };

  const handleCategoryDelete = async (index) => {
    if (budgetsData && Object.keys(budgetsData).length > 0) {
      const { categories } = budgetsData;
      // console.log(budgetsData.categories[index]);
      try {
        await deleteCategory(categories[index]?._id);
      } catch (err) {
        alert(`Error in category deletion ${err.message}`);
      }
    }
  };
  const handleChipDelete = (chipKey, value, index) => {
    const newDataObject = Object.fromEntries(
      Object.entries(chipData).filter(([key]) => key !== chipKey)
    );
    setCalculatedAmmount(parseInt(calculatedAmmount) - parseInt(value));
    setChipData(newDataObject);
    handleCategoryDelete(index);
  };

  const [openDialog, setDialog] = useState(false);

  const categories = budgetsData?.categories;
  return (
    <>
      <div className="masterConfigureBudgetContainer">
        <Navbar title={"Configure Budget"} />
        <div className="totalBudgetHeader">
          <div className="fractionContainerAmount">
            <div className="totalBudget">
              Budget: {monthlyBudget}
            </div>
            <div className="spentAmount">
              Spent: {calculatedAmmount}
            </div>
            <div className="leftWith">
              Left with: {monthlyBudget - calculatedAmmount}
            </div>
          </div>
        </div>
        <div className="budgetCardsContainer">
          {/* <BudgetCard /> */}
          {categories && categories.length > 0 && categories.map((catagory) => <BudgetCard budgetsData={budgetsData} catagory={catagory} />)}
        </div>
        <Box onClick={() => setDialog(true)} className="speedDialicon" sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
          <SpeedDial

            ariaLabel="SpeedDial openIcon example"
            sx={{ position: 'absolute', bottom: 16, right: 16, border: "2px solod red !important" }}
            icon={<SpeedDialIcon openIcon={<EditIcon />} />}
            direction="down"
          >
          </SpeedDial>
        </Box>
        <BudgetForm open={openDialog} setOpen={setDialog} />
      </div >
    </>
  );
};

export default ConfigureBudget;
