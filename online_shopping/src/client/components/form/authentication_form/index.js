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
  cart,
  setCart,
  setIsMerged
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

  const mergeCart = (customer, localCartData, userCart) => {
    const curUser = customer;
    const mergedCartData = { ...localCartData };
    console.log(`curUser is ${curUser}`);
    console.log(JSON.stringify(localCartData));
    console.log(JSON.stringify(userCart));

    const modCartDb = async (product_id, user_id, amount) => {
      const response = await fetch(
        "/mergeCartAmount",
        ajaxConfigHelper(
          { user_id: user_id, product_id: product_id, amount: amount },
          "PUT"
        )
      );

      const { message, status } = await response.json();
      if (status === "succeed") {
        console.log(`product with id ${product_id} modified in DATABASE NOW`);
      }
    };

    const addCartDb = async (product_id, user_id, amount) => {
      const productsData = JSON.parse(window.localStorage.getItem("products"));
      const product = productsData.find((product) => product.id === product_id);
      const response = await fetch(
        "/addCartProduct",
        ajaxConfigHelper(
          {
            id: uuidv4(),
            product_id: product_id,
            product_name: product.name,
            amount: amount,
            user_id: user_id,
          },
          "POST"
        )
      );

      const { message, status } = await response.json();
      if (status === "201") {
        console.log(`product with id ${product_id} added to DATABASE `);
      }
    };

    for (const key in userCart) {
      if (localCartData.hasOwnProperty(key)) {
        mergedCartData[key] = String(
          Number(mergedCartData[key]) + Number(userCart[key])
        );
      } else {
        mergedCartData[key] = userCart[key];
      }
    }

    // merge后 修改DB
    for (const key in mergedCartData) {
      if (userCart.hasOwnProperty(key)) {
        modCartDb(key, curUser.id, mergedCartData[key]);
      } else {
        addCartDb(key, curUser.id, mergedCartData[key]);
      }
    }

    setIsMerged(true);
    return mergedCartData;
  };

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
    async function getCart(user) {
      const response = await fetch(`/getCart/:${user.id}`);
      const { status, cartInfo } = await response.json();

      if (status === "succeed") {
        console.log(`user's cart from db ${JSON.stringify(cartInfo)}`);
        return cartInfo;
      } else {
        alert("Internal server error");
      }
    }
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
      let localCartData = JSON.parse(window.localStorage.getItem("cart"));
      localCartData = localCartData ? localCartData : {};
      let newCart = null;
      getCart(customer).then((userCart) => {
        console.log(
          `user cart from getCart FUNCTION: ${JSON.stringify(userCart)}`
        );

        const isMergedData = JSON.parse(
          window.localStorage.getItem("isMerged")
        );
        console.log(`isMergedData is ${isMergedData}`);

        newCart = isMergedData
          ? localCartData
          : mergeCart(customer, localCartData, userCart);
        console.log(`newly MERGED CART IS ${JSON.stringify(newCart)}`);
        setCart(newCart);
      });

      console.log(`newly MERGED CART IS ${JSON.stringify(newCart)}`);
      setCart(newCart);
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
          if (
            email.trim() === "" ||
            (password.trim() === "" &&
              panelStatus != PANEL_STATUS.UPDATE_PASSWORD)
          ) {
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
