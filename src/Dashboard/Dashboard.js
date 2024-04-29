import React, { useEffect, useState } from 'react';


import { AgChartsReact } from "ag-charts-react";
import './Dashboard.css';
import Navbar from '../Navbar';
import "ag-charts-enterprise";
import { Divider } from '@mui/material';



const Dashboard = (props) => {


  const {
    getBudgetData,
    budgetsData,
    getAllExpensesAndDate,
    expensesData,
    getExpenses,
    barChartExpnesesData,
  } = props;

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        await getBudgetData();
        await getAllExpensesAndDate();
        await getExpenses();
      }
      catch (er) {
        alert('Something went Wrong', er.message);
      }
    }
    fetchBudgetData();
  }, []);

  const [dataForExpanses, setDataForExpanses] = useState(expensesData);
  const [dataForBudget, setDataForBudget] = useState(budgetsData);
  const [dataForLine, setDataForLine] = useState(barChartExpnesesData)

  useEffect(() => {
    setDataForExpanses(expensesData);
    setDataForBudget(budgetsData);
    setDataForLine(barChartExpnesesData);
  }, [expensesData, budgetsData, barChartExpnesesData])
  const [optionsForRadar, setOptionsForRadar] = useState({
    data: [],
    title: {
      text: "Expanses done in each category",
    },
    series: [
      {
        type: "radar-line",
        angleKey: "department",
        radiusKey: "quality",
        radiusName: "Expanse",
      }
    ],
    axes: [
      {
        type: "angle-category",
        shape: "circle",
      },
      {
        type: "radius-number",
        shape: "circle",
      },
    ],
  });
  function formatNumber(value) {
    value /= 1000_000;
    return `${Math.floor(value)}M`;
  }
  const [optionsForBar, setOptionsForBar] = useState({
    data: [],
    title: {
      text: "Allocated Amount per category",
    },

    series: [
      {
        type: "bar",
        xKey: "year",
        yKey: "visitors",
        cornerRadius: 15,
        label: {
          formatter: ({ value }) => `$ ${value}`,
        },
        tooltip: {
          renderer: ({ datum, xKey, yKey }) => {
            // return "asdsad"
            return { title: datum[xKey], content: `$${datum[yKey]}` };
          },
        },
      },
    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Allocated AMount",
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "Allocated Amount",
        },
        label: {
          formatter: ({ value }) => `$${value}`,
        },
        crosshair: {
          label: {
            renderer: ({ value }) =>
              `<div style="padding: 0 7px; border-radius: 2px; line-height: 1.7em; background-color: rgb(71,71,71); color: rgb(255, 255, 255);">${formatNumber(value)}</div>`,
          },
        },
      },
    ],
  });


  const [optionsForLine, setOptionsForLine] = useState({
    data: [],
    title: {
      text: "Expanses Vs Date",
    },

    series: [
      {
        type: "line",
        xKey: "week",
        yKey: "belize",
        yName: "Date: Expanse",
      },

    ],
    axes: [
      {
        type: "category",
        position: "bottom",
        title: {
          text: "Dates",
        },
        label: {
          formatter: (params) => `${params.value}`,
        },
      },
      {
        type: "number",
        position: "left",
        title: {
          text: "$ per Date",
        },
      },
    ],
  })
  useEffect(() => {
    console.error(dataForBudget)
    if (dataForExpanses && dataForExpanses.length > 0) {
      const data = [];
      dataForExpanses.map((expanse) => {
        data.push({
          department: expanse.categoryName,
          quality: expanse.amount,
        });
      });
      console.log(data)
      setOptionsForRadar({ ...optionsForRadar, data: [...data] });
    }
    if (dataForBudget && Object.keys(dataForBudget).length > 0) {
      const data = [];
      dataForBudget.categories && dataForBudget.categories.length > 0 && dataForBudget.categories.map((category) => {

        data.push({
          year: category.name,
          visitors: category.allocatedAmount,
        });
      });

      setOptionsForBar({ ...optionsForBar, data: [...data] });
    }
    if (dataForLine && dataForLine.length > 0) {
      const data = [];
      dataForLine.map((expanse) => {
        data.push({
          week: expanse.date,
          belize: expanse.totalAmountSpent,
          // age: expanse.totalAmountSpent,
        })
      })
      setOptionsForLine({ ...optionsForLine, data: data });
    }
  }, [dataForExpanses, dataForBudget, dataForLine]);
  // console.log(optionsForRadar)




  const handleFilter = (date) => {
    const monthObj = new Date(date);
    const monthIndex = monthObj.getMonth();
    console.log(monthIndex)

    const filterdHBarData = expensesData.filter(expanse => {
      const transactionDate = new Date(expanse.date);
      return transactionDate.getMonth() === monthIndex;
    });
    // debugger
    setDataForExpanses(filterdHBarData);

    const filterdLineData = barChartExpnesesData.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === monthIndex;
    });
    setDataForLine(filterdLineData);
  }

  return (<>
    <div className="masterDashBoardContainer">
      <Navbar title={'Dashboard'} />
      <div className="masteChartsContainer">
        <div className="chartSection">
          <input type="month" className='filter' onChange={(e) => handleFilter(e.target.value)} name="" id="" />
          <div className="chartContainer">
            <AgChartsReact options={optionsForRadar} />
          </div>
          <Divider sx={{ width: "100%" }} />
          {/* <hr className='dividers' /> */}
          <div className="chartContainer">
            <AgChartsReact options={optionsForBar} />
          </div>
          <Divider sx={{ width: "100%" }} />
          {/* <hr className='dividers' /> */}
          <div className="chartContainer">
            <AgChartsReact options={optionsForLine} />
          </div>
        </div>
      </div>

    </div>
  </>)
}

export default Dashboard;