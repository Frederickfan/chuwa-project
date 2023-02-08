import { Form, Input, InputNumber, Select, Button, Image } from "antd";
import { PANEL_STATUS } from "../../constants";
import { useState } from "react";
import { ajaxConfigHelper } from "../../../helper";
const { v4: uuidv4 } = require("uuid");
const { TextArea } = Input;

const ProductControlForm = ({
  panelStatus,
  setPanelStatus,
  editId,
  setProducts,
  products,
  isOnDetailPage,
}) => {
  const editingProduct = products.find((product) => product.id === editId);
  const editingProductUrl = editingProduct ? editingProduct.imgUrl : "";
  const [imageURL, setImageURL] = useState(
    panelStatus === PANEL_STATUS.CREATE_PRODUCT ? "" : editingProductUrl
  );
  const [uploaded, setUploaded] = useState(false);

  const initialValuesForEditing = editingProduct
    ? {
        name: editingProduct.name,
        detail: editingProduct.detail,
        category: editingProduct.category,
        quantity: editingProduct.quantity,
        price: editingProduct.price,
      }
    : {};

  const addProductHandler = async (productDetails) => {
    const productID = uuidv4();
    const product = {
      ...productDetails,
      imgUrl: imageURL,
      id: productID,
    };

    const addResponse = await fetch("/addProduct", ajaxConfigHelper(product));
    const productsResponse = await fetch("/getAllProducts");
    const { productsStatus, products } = await productsResponse.json();

    const { message, status } = await addResponse.json();
    alert(`New product status: ${message}, status code: ${status}`);
    setProducts(products);

    setPanelStatus(PANEL_STATUS.MAIN_PAGE);
  };

  const editProductHandler = async (productDetails) => {
    const product = {
      ...productDetails,
      imgUrl: imageURL,
      id: editId,
    };

    const editResponse = await fetch(
      "/editProduct",
      ajaxConfigHelper(product, "PUT")
    );
    const { message, editStatus } = await editResponse.json();
    const productsResponse = await fetch("/getAllProducts");
    const { productsStatus, products } = await productsResponse.json();

    if (editStatus === "succeed") {
      alert(message);
      setProducts(products);
      setPanelStatus(PANEL_STATUS.MAIN_PAGE);
    }
  };

  const backHandler = (isOnDetailPage) => {
    if (isOnDetailPage) {
      setPanelStatus(PANEL_STATUS.PRODUCT_DETAIL);
    } else {
      setPanelStatus(PANEL_STATUS.MAIN_PAGE);
    }
  }

  return (
    <>
      {panelStatus === PANEL_STATUS.CREATE_PRODUCT ? (
        <h1>Create Product</h1>
      ) : (
        <h1>Edit Product</h1>
      )}
      <Form
        initialValues={initialValuesForEditing}
        onFinish={
          panelStatus === PANEL_STATUS.CREATE_PRODUCT
            ? addProductHandler
            : editProductHandler
        }
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
        <Form.Item label="Product Name" name="name">
          <Input />
        </Form.Item>

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
          <InputNumber required={true} min={0} />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <InputNumber required={true} min={0} controls={false} />
        </Form.Item>

        <Form.Item label="Image URL" name="imgUrl">
          <Input
            defaultValue={
              panelStatus === PANEL_STATUS.EDIT_PRODUCT
                ? editingProduct.imgUrl
                : ""
            }
            onChange={(e) => {
              setUploaded(false);
              setImageURL(e.target.value);
            }}
          ></Input>
        </Form.Item>
        <Button
          onClick={(e) => {
            console.log(imageURL);
            setUploaded(true);
          }}
        >
          Preview
        </Button>
        {uploaded ? (
          <Image width={210} height={230} src={imageURL}></Image>
        ) : (
          <Image
            width={210}
            height={230}
            src={
              "https://st4.depositphotos.com/14953852/22772/v/450/depositphotos_227725184-stock-illustration-image-available-icon-flat-vector.jpg"
            }
          ></Image>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {panelStatus === PANEL_STATUS.CREATE_PRODUCT
              ? "Add Product"
              : "Update Product"}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => backHandler(isOnDetailPage)}
          >
            Back
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductControlForm;
