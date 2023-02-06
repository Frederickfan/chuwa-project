import { Button, Form, Input } from "antd";
import { useState } from "react";
import SigninWrapper from "../../signin_wrapper";
import SignupWrapper from "../../signup_wrapper";
import { PANEL_STATUS } from "../../constants";
import { ajaxConfigHelper } from "../../../helper";
const { v4: uuidv4 } = require("uuid");

export default function AuthenticationForm({
  user,
  setUser,
  panelStatus,
  setPanelStatus,
}) {
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

  const signInHandler = async (email, password) => {
    const response = await fetch(
      "/customerSignIn",
      ajaxConfigHelper(
        {
          email: email,
          password: password,
        },
        "PUT"
      )
    );

    const { message, status, customer } = await response.json();
    alert(
      `Sign in staus:: ${message}, User login status: ${customer.isLoggedIn}`
    );

    if (status === "200") {
      setUser(customer);
      setPanelStatus(PANEL_STATUS.MAIN_PAGE);
    }
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
    } else if (panelStatus === PANEL_STATUS.UPDATE_PASSWORD) {
      return <></>;
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
          if (PANEL_STATUS.SIGN_UP === panelStatus) {
            form.resetFields();
            signUpHandler(email, password);
          } else if (PANEL_STATUS.SIGN_IN === panelStatus) {
            form.resetFields();
            signInHandler(email, password);
          }
        }}
        autoComplete="off"
      >
        <Form.Item
          label={"Email"}
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

        {panelStatus !== PANEL_STATUS.UPDATE_PASSWORD ? (
          <>
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
          </>
        ) : (
          <div></div>
        )}

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
        {panelStatus === PANEL_STATUS.UPDATE_PASSWORD ? (
          <Button 
            type="primary" 
            htmlType="submit"
            onClick={() => {setPanelStatus(PANEL_STATUS.SIGN_IN)}}
          >
            Back
          </Button>
        ) : (
          authenWrapperSwitchHandler(panelStatus)
        )}
      </Form>
    </>
  );
}
