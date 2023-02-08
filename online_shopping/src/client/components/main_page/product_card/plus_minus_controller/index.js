import React from "react";
import { Button } from "antd";
import { ajaxConfigHelper } from "../../../../helper";

const PlusMinusControl = ({ count, setCount, user_id, product_id }) => {
  const addHandler = async (count, user_id, product_id) => {
    const response = await fetch(
      "/modCartAmount",
      ajaxConfigHelper(
        {
          user_id: user_id,
          product_id: product_id,
          type: "+",
        },
        "PUT"
      )
    );
    const { message, status } = await response.json();
    alert(message);
    setCount((count) => count + 1);
  };
  const minusHandler = async (count, user_id, product_id) => {
    if (count > 1) {
      const response = await fetch(
        "/modCartAmount",
        ajaxConfigHelper(
          {
            user_id: user_id,
            product_id: product_id,
            type: "-",
          },
          "PUT"
        )
      );
      const { message, status } = await response.json();
      alert(message);
      setCount((count) => count - 1);
    } else {
      const response = await fetch(
        "/deleteCartProduct",
        ajaxConfigHelper(
          {
            user_id: user_id,
            product_id: product_id,
          },
          "DELETE"
        )
      );

      const {message, status} = await response.json();
      alert(message);
      setCount((count) => count - 1);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button onClick={() => minusHandler(count, user_id, product_id)}>
        -
      </Button>
      <div style={{ margin: "0 10px" }}>{count}</div>
      <Button onClick={() => addHandler(count, user_id, product_id)}>+</Button>
    </div>
  );
};

export default PlusMinusControl;
