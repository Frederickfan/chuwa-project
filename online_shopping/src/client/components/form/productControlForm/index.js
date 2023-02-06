import { Form, Input, InputNumber, Select, Button } from "antd";
import { PANEL_STATUS } from "../../constants";
import ImageUploader from "./imageUploader";
import { useState } from "react";
import { ajaxConfigHelper } from "../../../helper";
const {v4: uuidv4} = require("uuid");
const { TextArea } = Input;

const ProductControlForm = ({ panelStatus, setPanelStatus }) => {
  const [imageURL, setImageURL] = useState("");

  const addProductHandler = async (productDetails) => {
    const productID = uuidv4();
    const product = {
      ...productDetails, 
      imgUrl: imageURL,
      id: productID,
    }
    console.log(`New product added: ${JSON.stringify(product)}`);

    const response = await fetch(
      '/addProduct', 
      ajaxConfigHelper(product)
    )

    const {message, status} = await response.json(); 
    alert(`New product status: ${message}, status code: ${status}`); 

    setPanelStatus(PANEL_STATUS.MAIN_PAGE);
  };

  return (
    <>
      {panelStatus === PANEL_STATUS.CREATE_PRODUCT ? (
        <h1>Create Product</h1>
      ) : (
        <h1>Edit Product</h1>
      )}
      <Form
        onFinish={addProductHandler}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
      >
        {panelStatus === PANEL_STATUS.CREATE_PRODUCT ? (
          <Form.Item label="Product Name" name="name">
            <Input />
          </Form.Item>
        ) : (
          <Form.Item label="Product ID" name="id">
            <Input />
          </Form.Item>
        )}

        <Form.Item label="Product Detail" name="detail">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="Laptop">Laptop</Select.Option>
            <Select.Option value="Cloth">Cloth</Select.Option>
            <Select.Option value="Phone">Phone</Select.Option>
            <Select.Option value="Homestyle">Homestyle</Select.Option>
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Car">Car</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Quantity" name="quantity">
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <InputNumber min={0} controls={false} />
        </Form.Item>

        <ImageUploader
          imageURL={imageURL}
          setImageURL={setImageURL}
        ></ImageUploader>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {panelStatus === PANEL_STATUS.CREATE_PRODUCT
              ? "Add Product"
              : "Update Product"}
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            onClick={() => setPanelStatus(PANEL_STATUS.MAIN_PAGE)}
          >
              Back
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductControlForm;
