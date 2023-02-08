import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Button, Modal, Row, Col } from "antd";
import { PANEL_STATUS } from "../../constants";
import React from "react";
import { useState, useEffect } from "react";
import "./index.css";
import { ajaxConfigHelper } from "../../../helper";
import PlusMinusControl from "./plus_minus_controller";
const { Meta } = Card;
const { v4: uuidv4 } = require("uuid");

export default function ProductCard({
  user,
  name,
  quantity,
  detail,
  category,
  id,
  price,
  imgUrl,
  createdAt,
  updatedAt,
  panelStatus,
  setPanelStatus,
  setEditId,
  setProducts,
  cart,
  setCart,
}) {
  const [visible, setVisible] = React.useState(false);
  // delete below
  const [count, setCount] = useState(0);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setVisible(false);
    // Perform the delete operation here
    const deleteResponse = await fetch(
      "/delProduct",
      ajaxConfigHelper({ id }, "DELETE")
    );
    const { message, status } = await deleteResponse.json();
    const updatedProducts = await fetch("/getAllProducts");
    const { products } = await updatedProducts.json();

    if (status === "succeed") {
      alert(message);
      setProducts(products);
      setPanelStatus(PANEL_STATUS.MAIN_PAGE);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const addHandler = async () => {
    const response = await fetch(
      "/addCartProduct",
      ajaxConfigHelper(
        {
          id: uuidv4(),
          product_id: id,
          product_name: name,
          amount: 1,
          user_id: user.id,
        },
        "POST"
      )
    );
    const {message, status} = await response.json();
    alert(message);
    setCount((count) => count + 1);

  };
  return (
    <>
      <div className="card">
        <div className="card_image">
          <img src={imgUrl} alt={name} />
        </div>
        <div className="card_info">
          <h4>{name}</h4>
          {quantity === "0" ? <div>Out of Stock</div> : <></>}
          <h4>${price.toLocaleString()}</h4>

          {count > 0 ? (
            <PlusMinusControl
              user_id={user.id}
              product_id={id}
              count={count}
              setCount={setCount}
            ></PlusMinusControl>
          ) : (
            <Button onClick={addHandler}>Add</Button>
          )}

          {user.isAdmin ? (
            <Button
              onClick={() => {
                setEditId(id);
                setPanelStatus(PANEL_STATUS.EDIT_PRODUCT);
              }}
            >
              Edit
            </Button>
          ) : (
            <></>
          )}

          {user.isAdmin ? (
            <Button
              type="danger"
              onClick={showModal}
              style={{ border: "1px solid red" }}
            >
              Delete
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Modal
        title="Delete Item"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this item?</p>
      </Modal>
    </>
  );
}
