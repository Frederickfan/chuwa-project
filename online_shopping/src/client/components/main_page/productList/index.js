import ProductCard from "../product_card";
import "./index.css";

export default function ProductList({
    panelStatus, 
    setPanelStatus, 
    products, 
    setProductID    
}) {
  console.log(products);
  return (
    <div className="product_list">
        {console.log('run map func here')}
    {
      products.map((product, index) => {
        return (
          <ProductCard
            key={`${product.id}-${index}`}
            imgUrl={product.imgUrl}
            name={product.name}
            detail={product.detail}
            category={product.category}
            price={product.price}
            createdAt={product.createdAt}
            updatedAt={product.updatedAt}
            id={product.id}
            panelStatus={panelStatus}
            setPanelStatus={setPanelStatus}
            setProductID={setProductID}
          ></ProductCard>
        );
      })}
    </div>
  );
}
