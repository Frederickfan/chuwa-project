import Header from "../header";
import Authentication from "../authentication";
import { useState, useEffect, useRef } from "react";
import { PANEL_STATUS } from "../constants/";
import MainPage from "../main_page";
import Cart from "../../../server/database/cartModel";
const { v4: uuidv4 } = require("uuid");

const Home = () => {
  const [panelStatus, setPanelStatus] = useState(PANEL_STATUS.LOADDING);
  const [visible, setVisible] = useState(true);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [sortStatus, setSortStatus] = useState("last_added");
  const [cart, setCart] = useState(null);
  const [user, setUser] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [isOnDetailPage, setIsOnDetailPage] = useState(false);

  const [userUseEffectFinished, setUserUseEffectFinished] = useState(false);

  const shouldLogUser = useRef(true);
  const shouldLogProducts = useRef(true);
  const shouldLogEditId = useRef(true);
  const shouldLogSortStatus = useRef(true);
  const shouldLogDetailId = useRef(true);
  const shouldLogIsOnDetailPage = useRef(true);

  // gain cart data from the backend first.

  useEffect(() => {
    if (!shouldLogUser.current) {
      return;
    }
    shouldLogUser.current = false;

    // gain data from localStorage
    const panelStatusData = window.localStorage.getItem("panelStatus");
    const userData = JSON.parse(window.localStorage.getItem("user"));
    console.log(`user after reload: ${JSON.stringify(userData)}`);

    async function getUserStatus() {
      const id = userData ? userData.id : uuidv4();
      console.log(`check this id in database now: ${id}`);
      const response = await fetch(`/customers/:${id}`);
      const { userStatus } = await response.json();
      console.log(userStatus);

      if (userStatus === "unauthenticated") {
        console.log(panelStatusData);

        if (panelStatusData === null) {
          setPanelStatus(PANEL_STATUS.SIGN_IN);
        } else {
          setPanelStatus(panelStatusData);
        }
        return;
      }

      // Logged in
      setUser(userData);
      setPanelStatus(panelStatusData);
    }

    getUserStatus();
    return () => setUserUseEffectFinished(true);
  }, []);

  useEffect(() => {
    if (!userUseEffectFinished || !user) return;

    async function getCart(user) {
      const response = await fetch(`/getCart/:${user.id}`);

      const { status, cart } = await response.json();

      console.log(`GET Cart request status: ${status}`);
      if (status === "succeed") {
        setCart(cart);
      } else {
        alert("Internal server error");
      }
    }


    if (user === null) {
      setCart(null);
      return () => {};
    }

    console.log(`we want the cart info from this user_id ${user.id}`);
    // pull data from localStorage first.
    const cartData = JSON.parse(window.localStorage.getItem("cart"));
    if (cartData !== null) {
      setCart(cartData);
    } else {
      getCart(user);
    }
  }, [userUseEffectFinished, user]);

  useEffect(() => {
    if (!shouldLogProducts.current) {
      return () => {};
    }
    shouldLogProducts.current = false;

    console.log(
      `reached here in second useEffect and panelStatus is ${panelStatus}`
    );
    // if user current in authentication page, no need to gain products data.
    if (
      panelStatus === PANEL_STATUS.SIGN_IN ||
      panelStatus === PANEL_STATUS.SIGN_UP ||
      panelStatus === PANEL_STATUS.UPDATE_PASSWORD
    ) {
      return () => {};
    }

    // Gain data from localStorage first.
    async function getAllProducts() {
      const response = await fetch("/getAllProducts");

      const { status, products } = await response.json();

      console.log(`GET products request status: ${status}`);
      if (status === "succeed") {
        setProducts(products);
      } else {
        alert("Internal server error");
      }
    }

    const productsData = JSON.parse(window.localStorage.getItem("products"));

    // When use logged in, the product data in localStorage is null.
    // So we get all data from DB, and save to localStorage.
    if (productsData !== null) {
      setProducts(productsData);
    } else {
      getAllProducts();
    }
  }, []);

  useEffect(() => {
    if (!shouldLogEditId.current) {
      return () => {};
    }
    shouldLogEditId.current = false;

    const editIdData = window.localStorage.getItem("editId");
    if (editIdData !== null) {
      setEditId(editIdData);
    }
  }, []);

  useEffect(() => {
    if (!shouldLogDetailId.current) {
      return () => {};
    }
    shouldLogDetailId.current = false;

    const detailIdData = window.localStorage.getItem("detailId");
    if (detailIdData !== null) {
      setDetailId(detailIdData);
    }
  }, []);

  useEffect(() => {
    if (!shouldLogSortStatus.current) {
      return () => {};
    }
    shouldLogSortStatus.current = false;

    const sortStatusData = window.localStorage.getItem("sortStatus");
    if (sortStatusData !== null) {
      setSortStatus(sortStatusData);
    }
  }, []);

  useEffect(() => {
    if (!shouldLogIsOnDetailPage.current) {
      return () => {};
    }
    shouldLogIsOnDetailPage.current = false;

    const isOnDetailPageData = JSON.parse(window.localStorage.getItem("isOnDetailPage"));
    if (isOnDetailPageData !== null) {
      setIsOnDetailPage(isOnDetailPageData);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("panelStatus", panelStatus);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("products", JSON.stringify(products));
    window.localStorage.setItem("editId", editId);
    window.localStorage.setItem("sortStatus", sortStatus);
    window.localStorage.setItem("cart", JSON.stringify(cart));
    window.localStorage.setItem("isOnDetailPage", JSON.stringify(isOnDetailPage));
    window.localStorage.setItem("detailId", detailId);
  }, [panelStatus, user, products, editId, sortStatus, cart, isOnDetailPage]);

  return panelStatus === PANEL_STATUS.LOADDING ? (
    <div>loading...</div>
  ) : (
    <>
      <Header
        user={user}
        setUser={setUser}
        visible={visible}
        setVisible={setVisible}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
        setProducts={setProducts}
      ></Header>
      {panelStatus === PANEL_STATUS.SIGN_IN ||
      panelStatus === PANEL_STATUS.SIGN_UP ||
      panelStatus === PANEL_STATUS.UPDATE_PASSWORD ? (
        <Authentication
          user={user}
          setUser={setUser}
          visible={visible}
          setVisible={setVisible}
          panelStatus={panelStatus}
          setPanelStatus={setPanelStatus}
        ></Authentication>
      ) : (
        <MainPage
          isOnDetailPage={isOnDetailPage}
          setIsOnDetailPage={setIsOnDetailPage}
          detailId={detailId}
          setDetailId={setDetailId}
          cart={cart}
          setCart={setCart}
          user={user}
          editId={editId}
          setEditId={setEditId}
          products={products}
          setProducts={setProducts}
          panelStatus={panelStatus}
          setPanelStatus={setPanelStatus}
          sortStatus={sortStatus}
          setSortStatus={setSortStatus}
        ></MainPage>
      )}
    </>
  );
};

export default Home;
