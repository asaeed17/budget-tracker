import React, { useState, useEffect } from "react";
import { Typography, Col, Row } from "antd";
import { UserAuth } from "../../Context/AuthContext";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend); //registers bar and line chart properties, also resets the chart

const { Title: AntTitle } = Typography;

const BudgetVisualisation = () => {
  const [last7Days, setLast7Days] = useState([]);
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const { fetchData, refresh } = UserAuth();

  useEffect(() => {
    fetchData("income",'C').then(incomeData => {
      setIncomeData(incomeData);
      //console.log("incomedata: ", incomeData);           
    });

    fetchData("expense",'D').then(expenseData => {
        setExpenseData(expenseData);
        //console.log("expense data: ", expenseData)
    });
  }, [fetchData, refresh]);

  useEffect(() => {
    const generateLast7Days = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        days.push(moment().subtract(i, "days").format("ddd"));
      }
      setLast7Days(days);
    };

    const generateCurrentMonthDays = () => {
      const days = [];
      const startOfMonth = moment().startOf('month');
      const endOfMonth = moment().endOf('month');
      let day = startOfMonth;

      while (day <= endOfMonth) {
        days.push(day.format("D MMM"));
        day = day.add(1, 'day');
      }

      setCurrentMonthDays(days);
    };

    generateLast7Days();
    generateCurrentMonthDays();
  }, []);

  const aggregateAmounts = (data, days, format) => {
    const amounts = Array(days.length).fill(0);

    data.forEach(item => {
      const date = moment(item["transactionDate"]).format(format);
      const index = days.indexOf(date);
      if (index !== -1) {
        amounts[index] += item.amount;
      }
    });

    return amounts;
  };

  const incomeAmounts7Days = aggregateAmounts(incomeData, last7Days, "ddd");
  const expenseAmounts7Days = aggregateAmounts(expenseData, last7Days, "ddd");

  const incomeAmountsMonth = aggregateAmounts(incomeData, currentMonthDays, "D MMM");
  const expenseAmountsMonth = aggregateAmounts(expenseData, currentMonthDays, "D MMM");

  const barChartData = {
    labels: last7Days,
    datasets: [
      {
        label: "Income",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: incomeAmounts7Days,
      },
      {
        label: "Expenses",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: expenseAmounts7Days,
      },
    ],
  };

  const lineChartData = {
    labels: currentMonthDays,
    datasets: [
      {
        label: "Income",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 3,
        data: incomeAmountsMonth,
      },
      {
        label: "Expenses",
        fill: false,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 3,
        data: expenseAmountsMonth,
      },
    ],
  };

  return (
    <div>
      <AntTitle level={2} style={{ display: "flex", justifyContent: "center", marginBottom: 100 }}>
        Budget Visualisation
      </AntTitle>
      <Row gutter={16} style={{ marginLeft: 0 }}>
        <Col span={12}>
          <Bar data={barChartData} />
          <h2 style={{ display: "flex", justifyContent: "center" }}>Income vs Expenses (last 7 days)</h2>
        </Col>
        <Col span={12}>
          <Line data={lineChartData} />
          <h2 style={{ display: "flex", justifyContent: "center" }}>Income vs Expenses (Current Month: {moment().format("MMMM")})</h2>
        </Col>
      </Row>
    </div>
  );
};

export default BudgetVisualisation;
