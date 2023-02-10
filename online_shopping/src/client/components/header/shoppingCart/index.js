import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, message } from "antd";
import React, { useState } from "react";
import cartSchema from "../../../../server/database/cartSchema";
import { ajaxConfigHelper } from "../../../helper";
import ProductCard from "../../main_page/product_card";
import CartProduct from "./cartProduct";
import "./index.css";
const { v4: uuidv4 } = require("uuid");

const ShoppingCart = ({ user, cart, setCart, products }) => {
  const [visible, setVisible] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState("0");

  console.log(cart);
  let totalCount = 0;
  let subTotal = 0;
  const cartData = cart === null ? {} : cart;
  for (const [key, value] of Object.entries(cartData)) {
    totalCount += Number(value);
    const currentProduct = products.find((product) => product.id === key);
    if (!currentProduct) continue;
    subTotal += Number(currentProduct.price) * Number(value);
  }
  const cartEntries = Object.entries(cartData).filter(
    (entry) => Number(entry[1]) > 0
  );
  const tax = (subTotal * 0.1).toFixed(2);
  const total = subTotal - Number(discount) + parseFloat(tax);

  const applyCodeHandler = async () => {
    const response = await fetch(`/getPromocode/:${promoCode}`);
    const { status, discount } = await response.json();

    if (status === "204") {
      message.error("Promotion code is not valid!");
      console.log("code does not exist reset to 0");
      setDiscount("0");
      return;
    }

    setDiscount(discount);
  };

  return (
    <div className="shopping-cart">
      <div className="icon-container">
        <div className="cart-icon">
          <ShoppingCartOutlined
            style={{ fontSize: "36px" }}
            onClick={() => setVisible(true)}
          />
          {totalCount > 0 && <div className="count-icon">{totalCount}</div>}
        </div>

        <div className="price">${subTotal.toFixed(2)}</div>
      </div>
      <Drawer
        bodyStyle={{}}
        title={`Cart (${totalCount} items)`}
        placement="right"
        mask={true}
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        width={"35%"}
      >
        <div
          className="drawer-products"
          style={{ height: "45%", overflow: "auto" }}
        >
          {cartEntries.map((cartEntry) => {
            return (
              <CartProduct
                key={uuidv4()}
                cart={cart}
                setCart={setCart}
                user={user}
                products={products}
                cartEntry={cartEntry}
              ></CartProduct>
            );
          })}
        </div>

        <div className="promocode-box" style={{ height: "14%" }}>
          <h4>Apply Promotion Code</h4>
          <Input onChange={(e) => setPromoCode(e.target.value)}></Input>
          <Button onClick={applyCodeHandler}>Apply</Button>
        </div>

        <div className="checkout" style={{ height: "33%" }}>
          <div className="subtotal">
            <h5>Subtotal</h5>
            <h5>${subTotal.toFixed(2)}</h5>
          </div>

          <div className="discount">
            <h5>Tax</h5>
            <h5>${tax}</h5>
          </div>

          <div className="promocode">
            <h5>Discount</h5>
            <h5>
              {discount === "0" || Number(discount).toFixed(2) === "0.00"
                ? "$0.00"
                : "$-" + Number(discount).toFixed(2)}
            </h5>
          </div>

          <div className="Total">
            <h5>Total</h5>
            <h5>${Number(total).toFixed(2)}</h5>
          </div>

          <Button>Checkout</Button>
        </div>
      </Drawer>
    </div>
  );
};

export default ShoppingCart;
