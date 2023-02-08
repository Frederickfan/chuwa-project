import ProductList from "../productList";
import Pagination from "../pagination";
import { useState } from "react";

export default function ProductsGallary({
    user, 
    panelStatus, 
    setPanelStatus, 
    products, 
    setEditId, 
    setProducts,
    cart, 
    setCart,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentProducts = products.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <h1>Products Gallary</h1>
      <ProductList
        cart={cart}
        setCart={setCart}
        user={user}
        setEditId={setEditId}
        products={currentProducts}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
        setProducts={setProducts}
      ></ProductList>
      <Pagination
        totalPosts={products.length}
        postsPerPage={postsPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      ></Pagination>
    </>
  );
}
