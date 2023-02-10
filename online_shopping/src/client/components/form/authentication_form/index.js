import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import SigninWrapper from "../../signin_wrapper";
import SignupWrapper from "../../signup_wrapper";
import { PANEL_STATUS } from "../../constants";
import { ajaxConfigHelper } from "../../../helper";
import { useEffect } from "react";
const { v4: uuidv4 } = require("uuid");

export default function AuthenticationForm({
  user,
  setUser,
  panelStatus,
  setPanelStatus,
}) {
  const [form] = Form.useForm();
  const [email, setEmail] = useState(
    window.localStorage.getItem("email")
      ? window.localStorage.getItem("email")
      : ""
  );
  const [password, setPassword] = useState(
    window.localStorage.getItem("password")
      ? window.localStorage.getItem("password")
      : ""
  );

  useEffect(() => {
    window.localStorage.setItem("email", email);
    window.localStorage.setItem("password", password);
  }, [email, password]);

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

    const { authenMessage, status } = await response.json();

    if (status === "400") {
      message.error(authenMessage);
      return;
    }

    setEmail("");
    setPassword("");
    console.log("reache here");
    message.success("Account created successfully!");
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

    const { authenMessage, status, customer } = await response.json();

    if (status === "no_account") {
      message.error(
        "Account does not exist! Check your email or sign up an account."
      );
      return;
    }

    if (status === "wrong_password") {
      message.error("Password is wrong.");
      return;
    }

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
          email: email,
          password: password,
        }}
        onFinish={() => {
          if (email.trim() === "" || (password.trim() === "" && panelStatus != PANEL_STATUS.UPDATE_PASSWORD)) {
            message.error("Email or Password is empty!");
            return;
          }

          if (PANEL_STATUS.SIGN_UP === panelStatus) {
            form.resetFields();
            signUpHandler(email, password);
          } else if (PANEL_STATUS.SIGN_IN === panelStatus) {
            form.resetFields();
            signInHandler(email, password);
          } else if (PANEL_STATUS.UPDATE_PASSWORD === panelStatus) {
            form.resetFields();
            console.log("reached here");
            setPanelStatus(PANEL_STATUS.LINK_SENT);
          }
        }}
        autoComplete="off"
      >
        {panelStatus === PANEL_STATUS.LINK_SENT ? (
          <div>
            we have sent the update password link to your email, please check
            that!
          </div>
        ) : (
          <>
            <Form.Item
              label={"Email"}
              name="email"
              rules={[
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
                <Form.Item label="Password" name="password" rules={[]}>
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
                onClick={() => {
                  setPanelStatus(PANEL_STATUS.SIGN_IN);
                }}
              >
                Back
              </Button>
            ) : (
              authenWrapperSwitchHandler(panelStatus)
            )}
          </>
        )}
      </Form>
    </>
  );
}
