import React, { useState, useEffect } from "react";
import { Typography, Col, Row } from "antd";
import { UserAuth } from "../../Context/AuthContext";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend); //registers bar chart properties, also resets the bar chart
const { Title: AntTitle } = Typography;

const BudgetVisualisation = () => {
  const [last7Days, setLast7Days] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const { fetchData, refresh } = UserAuth();

  useEffect(() => {
    

    fetchData("income",'C').then(incomeData => {

      setIncomeData(incomeData);
      //console.log("incomedata: ", incomeData);           

    })

    fetchData("expense",'D').then(expenseData => {
        setExpenseData(expenseData);
        //console.log("expense data: ", expenseData)
    })

  }, [fetchData, refresh]);

  useEffect(() => {
    const generateLast7Days = () => {
      const days = [];
      for (let i = 6; i >= 0; i--) {
        days.push(moment().subtract(i, "days").format("ddd"));
      }
      setLast7Days(days);
    };

    generateLast7Days();
  }, []);

  const aggregateAmounts = (data) => {
    const amounts = Array(7).fill(0);

    data.forEach(item => {
      const dayIndex = 6 - moment().diff(moment(item["transactionDate"]), "days");
      if (dayIndex >= 0 && dayIndex < 7) {
        amounts[dayIndex] += item.amount;
      }
    });

    return amounts;
  };

  const incomeAmounts = aggregateAmounts(incomeData);
  const expenseAmounts = aggregateAmounts(expenseData);

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
        data: incomeAmounts,
      },
      {
        label: "Expenses",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: expenseAmounts,
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
          <Bar data={barChartData}/>
          <h2 style={{ display: "flex", justifyContent: "center"}}>Income vs Expenses (last 7 days)</h2>
        </Col>
        <Col span={12}>
            {/* add line chart code for last 30 days/monthly income vs expenses */}
        </Col>
      </Row>
    </div>
  );
};

export default BudgetVisualisation;
