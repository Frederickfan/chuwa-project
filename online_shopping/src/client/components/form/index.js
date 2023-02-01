import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import PANEL_STATUS from "../constants";
import SignupWrapper from "../signup_wrapper";
import SigninWrapper from "../signin_wrapper";
import { ajaxConfigHelper } from "../../helper";
const { v4: uuidv4 } = require("uuid");

export default function MyForm({ panelStatus, setPanelStatus }) {
  const [form] = Form.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpHandler = async (email, password) => {
    const response = await fetch(
      "/customerSignUp",
      ajaxConfigHelper({
        id: uuidv4(),
        email: email,
        password: password,
        isLoggedIn: false,
      })
    );
    
    const { message, status } = await response.json();
    alert(`Sign up status: ${message}, status code: ${status}`);
    
    setEmail("");
    setPassword("");
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const buttonSwitchHandler = (panelStatus) => {
    if (panelStatus === PANEL_STATUS.SIGN_IN) {
      return "Sign in";
    } else if (panelStatus === PANEL_STATUS.SIGN_UP) {
      return "Sign up";
    } else {
      return "Update password";
    }
  };

  const authenWrapperSwitchHandler = (panelStatus) => {
    if (panelStatus === PANEL_STATUS.SIGN_IN) {
      return <SigninWrapper setPanelStatus={setPanelStatus} />;
    } else if (panelStatus === PANEL_STATUS.SIGN_UP) {
      return <SignupWrapper setPanelStatus={setPanelStatus} />;
    } else {
      return <div>update password</div>;
    }
  };

  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={() => {
          form.resetFields();
          signUpHandler(email, password);
        }}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
            {
              type: "email",
              message: "Please input email format!",
            },
          ]}
        >
          <Input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            {buttonSwitchHandler(panelStatus)}
          </Button>
        </Form.Item>

        {authenWrapperSwitchHandler(panelStatus)}
      </Form>
    </>
  );
}
