import React, { useState, useEffect } from "react";
import { UserAuth } from "../../Context/AuthContext";
import { Typography, Card, Row, Col } from "antd";

const { Title } = Typography;

const Home = () => {
  const [amountData, setAmountData] = useState([]);
  const { fetchTotalAmounts } = UserAuth();

  useEffect(() => {
    fetchTotalAmounts().then((userCreditDebit) => {
      setAmountData(userCreditDebit);
    });
  }, [fetchTotalAmounts]);

  return (
    <div>
      <Title level={2} style={{display: "flex", justifyContent: "center", marginBottom: 100}}>Welcome Home!</Title>

      <Row gutter={16} style={{marginLeft: 175}}>
        <Col span={8}>
          <Card title="Total Credit" bordered={false} style={{textAlign: "center"}}>
            <Typography.Title level={2}>{amountData[0]}</Typography.Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Debit" bordered={false} style={{textAlign: "center"}}>
            <Typography.Title level={2}>{amountData[1]}</Typography.Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Current Savings" bordered={false} style={{textAlign: "center"}}>
            <Typography.Title level={2}>
              {amountData[0] - amountData[1]}
            </Typography.Title>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
