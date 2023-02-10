import "./index.css";
import { Card, Button } from "antd";
import React from "react";
import "./index.css";
import PlusMinusControl from "../../../main_page/product_card/plus_minus_controller";
import { ajaxConfigHelper } from "../../../../helper";
import { useState } from "react";
const { Meta } = Card;
const { v4: uuidv4 } = require("uuid");

export default function CartProduct({
  user,
  cart,
  setCart,
  products,
  cartEntry,
}) {
    


  console.log(`cart entry is ${cartEntry}`);
  console.log(`cart entry id is ${cartEntry[0]}`);
  const product = products.find((product) => product.id === cartEntry[0]);
  const quantity = product.quantity;
  const id = product.id;
  const name = product.name;
  const currentUser = user ? user : {};
  const user_id = user.id;

  const removeHandler = async(user_id, product_id) => {
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


  return (
    <div className="cart-item">
      <div className="cart-item-img">
        <img src={product.imgUrl}></img>
      </div>

      <div className="cart-item-box">
        <div className="cart-item-info">
          <h4 className="product-name">{product.name}</h4>
          <h4 className="product-price">${product.price}</h4>
        </div>

        <div className="cart-button-group">
          <PlusMinusControl
            user_id={currentUser.id}
            product_id={id}
            cart={cart}
            setCart={setCart}
          ></PlusMinusControl>

          <Button className="remove-button" onClick={() => removeHandler(user_id, id)} >Remove</Button>
        </div>
      </div>
    </div>
  );
}
