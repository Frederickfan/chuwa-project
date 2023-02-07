import ProductControlForm from "../../form/productControlForm";

export default function CreateOrEditProduct({
  panelStatus,
  setPanelStatus,
  editId,
  setProducts,
  products,
}) {
  return (
    <ProductControlForm
      products={products}
      editId={editId}
      setProducts={setProducts}
      panelStatus={panelStatus}
      setPanelStatus={setPanelStatus}
    ></ProductControlForm>
  );
}
