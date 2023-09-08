import React from "react";
import { Layout, Menu, theme, Button } from "antd";
import { UserAuth } from "../Context/AuthContext";
import { Outlet, useNavigate } from "react-router";
import { HomeOutlined, DownCircleOutlined, UpCircleOutlined, DollarCircleOutlined, LineChartOutlined } from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = () => {
        try {
            logout();
            navigate("/login");
        }
        catch(error){
            console.log(error.message);
        }
    }
    const { token: { colorBgContainer }, } = theme.useToken();
    return (
        <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items=
            {
                [
                    {
                        key: '1',
                        icon: <HomeOutlined/>,
                        label: "Home",
                        onClick: () => navigate("/dashboard/home"),
                    },
                    {
                        key: '2',
                        icon: <DownCircleOutlined/>,
                        label: "Income",
                        onClick: () => navigate("/dashboard/income"),
                    },
                    {
                        key: '3',
                        icon: <UpCircleOutlined/>,
                        label: "Expense",
                        onClick: () => navigate("/dashboard/expense"),
                    },
                    {
                        key: '4',
                        icon: <DollarCircleOutlined/>,
                        label: "Savings",
                        onClick: () => navigate("/dashboard/savings"),
                    },
                    {
                      key: '5',
                      icon: <LineChartOutlined/>,
                      label: "Budget Visualisation",
                      onClick: () => navigate("/dashboard/budget-visualisation"),
                    },
                ]

            }
          />
        </Sider>
        <Layout>
        <Header
          
            style={{
              padding: 10,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          > 
          <div style={{ display: "flex", justifyItems: "left", gap: 25}}>
            <h2 style={{marginTop: -10}} >Hi, {user && user.email}</h2>
            <Button style={{marginTop: 6}} onClick={handleSignOut}>Logout</Button>
          </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px 0',
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 605,
                background: colorBgContainer,
              }}
            >
              {/* content :  */}
              <Outlet />
             
            </div>
            
          </Content>
          <Footer
            style={{
              textAlign: 'center',
              // fontSize: 10,
              fontWeight: 500,
              
            }}
          >
            Budget Tracker App
          </Footer>
        </Layout>
      </Layout>
    );
}

export default Dashboard;