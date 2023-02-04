import ProductsController from "./products_controller";
import ProductsGallary from "./products_gallary";
import CreateOrEditProduct from "./create_product";
import { PRODUCT_STATUS } from "../constants";
import { MAINPAGE_STATUS } from "../constants";
import { useState } from "react";

export default function MainPage() {
  const [mainPageStatus, setMainPageStatus] = useState(
    MAINPAGE_STATUS.MAIN_PAGE
  );

  const pageSwitchHelper = (mainPageStatus) => {
    console.log(mainPageStatus);
    if (mainPageStatus === MAINPAGE_STATUS.MAIN_PAGE) {
      return (
        <>
          <ProductsController
            mainPageStatus={mainPageStatus}
            setMainPageStatus={setMainPageStatus}
          ></ProductsController>
          <ProductsGallary></ProductsGallary>
        </>
      );
    } else if (mainPageStatus === MAINPAGE_STATUS.CREATE_PRODUCT) {
      return (
        <>
          <CreateOrEditProduct productStatus={PRODUCT_STATUS.CREATE_PRODUCT}></CreateOrEditProduct>
        </>
      );
    }
  };

  return pageSwitchHelper(mainPageStatus);
}
