import React from "react";
import { Button } from "antd";
import { ajaxConfigHelper } from "../../../../helper";

const PlusMinusControl = ({ 
  cart, 
  setCart, 
  user_id, 
  product_id 
}) => {
  cart = cart ? cart : {};
  const addHandler = async (user_id, product_id) => {
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
    setCart((cart) => {
      return {
        ...cart,
        [product_id]: String(Number(cart[product_id]) + 1),
      };
    });
  };
  const minusHandler = async (user_id, product_id) => {
    if (Number(cart[product_id]) > 1) {
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
      setCart((cart) => {
        return {
          ...cart,
          [product_id]: String(Number(cart[product_id]) - 1),
        };
      });
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

      const { message, status } = await response.json();
      setCart(cart => {
        return {
            ...cart,
            [product_id]: String(0),
        };
    })
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button onClick={() => minusHandler(user_id, product_id)}>
        -
      </Button>
      <div style={{ margin: "0 10px" }}>{cart[product_id]}</div>
      <Button onClick={() => addHandler(user_id, product_id)}>+</Button>
    </div>
  );
};

export default PlusMinusControl;
