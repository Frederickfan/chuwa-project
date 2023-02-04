import { PRODUCT_STATUS } from "../../constants";
import ProductControlForm from "../../form/productControlForm";

export default function CreateOrEditProduct({productStatus}) {
    return <ProductControlForm 
                productStatus={productStatus}
            ></ProductControlForm>;
}