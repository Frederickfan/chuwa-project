import ProductControlForm from "../../form/productControlForm";

export default function CreateOrEditProduct({ panelStatus, setPanelStatus }) {
  return (
    <ProductControlForm 
      panelStatus={panelStatus}
      setPanelStatus={setPanelStatus}  
    ></ProductControlForm>
  );
}
