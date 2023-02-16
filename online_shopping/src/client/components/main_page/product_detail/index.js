import { Button, Modal } from "antd";
import { ajaxConfigHelper } from "../../../helper";
import PlusMinusControl from "../product_card/plus_minus_controller";
import { PANEL_STATUS } from "../../constants";
import ErrorModal from "../../Error";
import { useState } from "react";
import ErrorPage from "../../Error";
import { useErrorHandler } from "react-error-boundary";
const { v4: uuidv4 } = require("uuid");

export default function ProductDetail({
  products,
  detailId,
  setPanelStatus,
  user,
  cart,
  setCart,
  setEditId,
  setIsOnDetailPage,
  setProducts,
  setHasError,
}) {
  const [visible, setVisible] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);

  console.log(`detail Id is ${JSON.stringify(detailId)}`);
  const product = products.find((product) => product.id === detailId);
  const currentProduct = product ? product : {};
  const id = currentProduct.id;
  const quantity = currentProduct.quantity;
  const name = currentProduct.name;
  const handleError = useErrorHandler();

  const addHandler = async () => {
    const response = await fetch(
      "/addCartProduct",
      ajaxConfigHelper(
        {
          id: uuidv4(),
          product_id: id,
          product_name: name,
          amount: 1,
        },
        "POST",
        window.localStorage.getItem("token")
      )
    );
    const { message, status } = await response.json();
    setCart((cart) => {
      return {
        ...cart,
        [id]: "1",
      };
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    try {
      if (!cart) return;
      console.log(Number(cart[detailId]));
      if (Number(cart[detailId]) >= 1) {
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

  return (
    <>
      <h2>Product Detail</h2>
      <div className="product_detail_page">
        <img src={currentProduct.imgUrl}></img>
        <div className="product_card">
        <h2>Product Name: {currentProduct.name}</h2>
          <h4>Category: {currentProduct.category}</h4>

          <div className="price">
            <h4>price: {currentProduct.price}</h4>
            {currentProduct.quantity === "0" ? (
              <div style={{ color: "red", border: "1px solid red", margin: "10px 50px 30px 0" }}>
                Out of Stock
              </div>
            ) : (
              <></>
            )}
            <h4>Product Detail: </h4>
            <div>{currentProduct.detail}</div>
          </div>

          <div className="button_group">
            {cart && Number(cart[id]) > 0 ? (
              <PlusMinusControl
                user_id={user.id}
                product_id={id}
                cart={cart}
                setCart={setCart}
              ></PlusMinusControl>
            ) : (
              <Button disabled={quantity === "0"} onClick={addHandler}>
                Add to Cart
              </Button>
            )}
            <Button
              onClick={() => {
                setEditId(id);
                setPanelStatus(PANEL_STATUS.EDIT_PRODUCT);
              }}
            >
              Edit
            </Button>
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

            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setIsOnDetailPage(false);
                setPanelStatus(PANEL_STATUS.MAIN_PAGE);
              }}
            >
              Back
            </Button>
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
        </div>
      </div>
    </>
  );
}
