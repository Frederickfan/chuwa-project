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
import { useErrorHandler } from "react-error-boundary";
const { Meta } = Card;
const { v4: uuidv4 } = require("uuid");

export default function ProductCard({
  user,
  name,
  quantity,
  id,
  price,
  imgUrl,
  setPanelStatus,
  setEditId,
  setProducts,
  cart,
  setCart,
  setDetailId,
  setIsOnDetailPage,
}) {
  const [visible, setVisible] = React.useState(false);
  const handleError = useErrorHandler();

  // delete below
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      if (!cart) return;
      if (Number(cart[id]) >= 1) {
        throw new Error("Remove items from cart before delete prodcut!");
      } else {
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
          setProducts(products);
          setPanelStatus(PANEL_STATUS.MAIN_PAGE);
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const addHandler = async () => {
    if (user) {
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
      const { message, status } = await response.json();
    }

    setCart((cart) => {
      return {
        ...cart,
        [id]: "1",
      };
    });
  };

  return (
    <div>
      <div className="card">
        <div className="card_image">
          <img
            src={imgUrl}
            alt={name}
            onClick={() => {
              setPanelStatus(PANEL_STATUS.PRODUCT_DETAIL);
              setDetailId(id);
              setIsOnDetailPage(true);
            }}
          />
        </div>
        <div className="card_info">
          <h4>{name}</h4>
          {quantity === "0" ? (
            <div style={{ color: "red", border: "1px solid red" }}>
              Out of Stock
            </div>
          ) : (
            <></>
          )}
          <h4>${Number(price).toFixed(2)}</h4>

          {cart && Number(cart[id]) > 0 ? (
            <PlusMinusControl
              user_id={user ? user.id : null}
              product_id={id}
              cart={cart}
              setCart={setCart}
            ></PlusMinusControl>
          ) : (
            <Button disabled={quantity === "0"} onClick={addHandler}>
              Add
            </Button>
          )}

          {user && user.isAdmin ? (
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

          {user && user.isAdmin ? (
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
    </div>
  );
}
