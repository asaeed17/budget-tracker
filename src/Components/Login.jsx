import { Row, Col, Button, Form, Input, Typography, Divider, message } from 'antd';
import {GoogleOutlined} from '@ant-design/icons';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext';



const Login = () => {
    const email = "", password = "";

    const navigate = useNavigate();
    const { signIn, signInWithGoogle } = UserAuth(); //from context

    
    const handleLogin = (values) => {
          // console.log("e and p", values)
            signIn(values.email, values.password)

            .then((userCredential) => {
                // console.log(userCredential);
                message.success("Logged in successfully!");
                navigate("/dashboard/home");
            })

            .catch((error) => {
                // console.log("hi", error);
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password"){
                    message.warning("Username or password is incorrect!")
                }
                })
    
            // console.log("login")
    }

    const googleLogin = () => {
      // message.success("Google clicked!")
      signInWithGoogle()
      .then((userCredential) => {
          // console.log(userCredential);
          message.success("Logged in successfully!");
          navigate("/dashboard/home");
        
      })
      .catch((error) => redirect("/"))
  }

    return (
  <Row>    

  <Form
    className='login-form'
    name="basic"
    autoComplete="off"
    onFinish={handleLogin}
  >
    <Typography.Title style={{marginLeft: 10}}>Welcome Back!</Typography.Title>
    
    <Col span={30} offset={2}>
    <Form.Item
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please input your email!',
        },
      ]}
    >
        <Input 
        type="email" 
        placeholder='someone@example.com' 
        value={email}
        // onChange={(e) => setEmail(e.target.value)}
        />    
    </Form.Item>
    </Col>
    
    <Col span={30}>
    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password 
        type="password"
        value={password}
        // onChange={(e) => setPassword(e.target.value)}
        />
    </Form.Item>
    </Col>
      <Button type="primary" htmlType="submit" block>
        Login
      </Button>
      <Divider style={{borderColor : 'black'}}> or Login with</Divider>
      <div>
        <GoogleOutlined style={{marginLeft: 125, fontSize: 24}} onClick={googleLogin}/>
      </div>
      <Divider>Don't have an account? <Link to={`/signup`}>Sign Up</Link></Divider>
  </Form>
  </Row>
)};
export default Login;