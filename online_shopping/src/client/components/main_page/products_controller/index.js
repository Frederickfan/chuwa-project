import { Select, Button } from "antd";
import { PANEL_STATUS } from "../../constants";

export default function ProductsController({
  user,
  setPanelStatus,
  setSortStatus,
  sortStatus,
}) {
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
      <div>Products</div>
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
    </>
  );
}
