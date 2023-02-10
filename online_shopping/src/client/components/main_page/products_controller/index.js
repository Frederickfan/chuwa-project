import { Select, Button, message, Modal, Input, Form } from "antd";
import { PANEL_STATUS } from "../../constants";
import { useState } from "react";
import { ajaxConfigHelper } from "../../../helper";

export default function ProductsController({
  user,
  setPanelStatus,
  setSortStatus,
  sortStatus,
}) {
  const [open, setOpen] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [promocode, setPromoCode] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [discount, setDiscount] = useState("");

  function isDigitsOnly(str) {
    return /^\d+$/.test(str);
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (promocode === "" || discount === "") {
      message.error("Promotion code or discount is empty!");
      return;
    } else if (!isDigitsOnly(discount)) {
      message.error("Discount must only contain digits!");
      return;
    }
    setConfirmLoading(true);

    const response = await fetch(
      "/createPromocode",
      ajaxConfigHelper(
        {
          promocode: promocode,
          discount: discount,
        },
        "POST"
      )
    );
    const { status, code } = await response.json();

    if (code === "400") {
      setTimeout(() => {
        setConfirmLoading(false);
        message.error(
          "Promotion code already exists, please create a new one!"
        );
      }, 1000);
      return;
    }

    setTimeout(() => {
      setConfirmLoading(false);
      setOpen(false);
    }, 1000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleChange = (selectedTab) => {
    setSortStatus(selectedTab.value);
  };

  const defaultLabelHandler = (sortStatus) => {
    if (sortStatus === "last_added") {
      return "Last Added";
    } else if (sortStatus === "low_to_high") {
      return "Price: low to high";
    } else {
      return "Price: high to low";
    }
  };

  return (
    <>
      <Select
        labelInValue
        defaultValue={{
          value: { sortStatus },
          label: defaultLabelHandler(sortStatus),
        }}
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "last_added",
            label: "Last added",
          },
          {
            value: "low_to_high",
            label: "Price: low to high",
          },
          {
            value: "high_to_low",
            label: "Price: high to low",
          },
        ]}
      />
      {user.isAdmin ? (
        <Button onClick={() => setPanelStatus(PANEL_STATUS.CREATE_PRODUCT)}>
          Add Product
        </Button>
      ) : (
        <></>
      )}
      {user.isAdmin ? (
        <>
          <Button onClick={showModal}>Add Promotion Code</Button>
          <Modal
            title="Add promotion code to database"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
          >
            <div className="promotion-title">Promotion Code:</div>
            <Input
              className="promotion-input"
              onChange={(e) => setPromoCode(e.target.value)}
            ></Input>
            <div className="promotion-discount">Discount:</div>
            <Input
              className="discount-input"
              onChange={(e) => setDiscount(e.target.value)}
            ></Input>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
