import ProductList from "../productList";
import Pagination from "../pagination";
import { useState } from "react";

export default function ProductsGallary({ panelStatus, setPanelStatus, products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentProducts = products.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <h1>Products Gallary</h1>
      <ProductList
        products={currentProducts}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
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
