import { Row, Col, Button, Form, Typography, Input, Divider, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/AuthContext";

const SignUp = () => {
    const email = "", password = "";

    const { createUser } = UserAuth();
    const navigate = useNavigate();

    const handleSignUp = (values) => {

          createUser(values.email, values.password)// createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              // console.log(userCredential);
              message.success("Signed up successfully!");
              navigate("/dashboard/home");
          })

          .catch((error) => {
              console.log(error);

              if (error.code === "auth/email-already-in-use"){
                  message.warning("This account already exists!")
              }
              else if (error.code === "auth/weak-password"){
                  message.warning("Weak Password!")
              }
              else if (error.code === "auth/invalid-email"){
                message.warning("Invalid email!");
              }
          });
        
    }


    return (
    <Row>
    <Form
      className='login-form'
      name="basic"
      autoComplete="off"
      onFinish={handleSignUp}
    >
      <Typography.Title style={{marginLeft: 70}}>Sign Up!</Typography.Title>
    <Col span={30} offset={2}>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
          {
            validator(rule, email){
              return new Promise((resolve, reject) => {
                if (email?.endsWith("gmail.com")){
                  reject("Sign in with Google on login page!")
                }
                else{
                  resolve();
                }})
            } 
          }
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
        <Button type="primary" htmlType="submit" onSubmit={handleSignUp} block>
         Sign Up
        </Button>
        <Divider style={{borderColor: 'black'}}></Divider>
        <Divider>Already have an account? <Link to={`/login`}>Login</Link></Divider>
    </Form>
    </Row>
  )};

export default SignUp;