import ProductsController from "./products_controller";
import ProductsGallary from "./products_gallary";
import CreateOrEditProduct from "./create_product";
import { PANEL_STATUS } from "../constants";

export default function MainPage({
  products,
  setProducts,
  panelStatus,
  setPanelStatus,
}) {
  const pageSwitchHelper = (panelStatus) => {
    if (panelStatus === PANEL_STATUS.MAIN_PAGE) {
      return (
        <>
          <ProductsController
            panelStatus={panelStatus}
            setPanelStatus={setPanelStatus}
          ></ProductsController>
          <ProductsGallary
            products={products}
            panelStatus={panelStatus}
            setPanelStatus={setPanelStatus}
          ></ProductsGallary>
        </>
      );
    } else {
      return (
        <>
          <CreateOrEditProduct
            products={products}
            panelStatus={panelStatus}
            setPanelStatus={setPanelStatus}
          ></CreateOrEditProduct>
        </>
      );
    }
  };

  return pageSwitchHelper(panelStatus);
}
