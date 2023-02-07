import ProductCard from "../product_card";
import "./index.css";

export default function ProductList({
  user,
  panelStatus,
  setPanelStatus,
  products,
  setProductID,
  setEditId,
  setProducts,
}) {
  console.log(`product list: ${products}`);
  return (
    <div className="product_list">
      {products.map((product, index) => {
        return (
          <ProductCard
            user={user}
            key={`${product.id}-${index}`}
            imgUrl={product.imgUrl}
            name={product.name}
            detail={product.detail}
            category={product.category}
            price={product.price}
            createdAt={product.createdAt}
            updatedAt={product.updatedAt}
            id={product.id}
            quantity={product.quantity}
            panelStatus={panelStatus}
            setPanelStatus={setPanelStatus}
            setProductID={setProductID}
            setEditId={setEditId}
            setProducts={setProducts}
          ></ProductCard>
        );
      })}
    </div>
  );
}
