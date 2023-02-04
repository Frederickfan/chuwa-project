import { Select, Button } from "antd";
import { MAINPAGE_STATUS } from "../../constants";

export default function ProductsController({setMainPageStatus}) {
  const handleChange = (value) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  return (
    <>
      <div>Products</div>
      <Select
        labelInValue
        defaultValue={{
          value: "Last added",
          label: "Last added",
        }}
        style={{
          width: 120,
        }}
        onChange={handleChange}
        options={[
          {
            value: "Last added",
            label: "Last added",
          },
          {
            value: "Price: low to high",
            label: "Price: low to high",
          },
          {
            value: "Price: high to low",
            label: "Price: high to low",
          },
        ]}
      />
      <Button onClick={() => setMainPageStatus(MAINPAGE_STATUS.CREATE_PRODUCT)}>Add Product</Button>
    </>
  );
}
