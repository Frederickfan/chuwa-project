import Header from "../header";
import Authentication from "../authentication";
import { useState, useEffect, useRef } from "react";
import { PANEL_STATUS } from "../constants/";
import MainPage from "../main_page";
const { v4: uuidv4 } = require("uuid");

const Home = () => {
  const [user, setUser] = useState(null);
  const [panelStatus, setPanelStatus] = useState(PANEL_STATUS.LOADDING);
  const [visible, setVisible] = useState(true);
  const [products, setProducts] = useState([]);
  const shouldLogUser= useRef(true);
  const shouldLogProducts = useRef(true);

  useEffect(() => {
    if (!shouldLogUser.current) {
      return () => {};
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

      // adjust
    }

    getUserStatus();
  }, []);

  useEffect(() => {
    if (!shouldLogProducts.current) {
      return () => {};
    }
    shouldLogProducts.current = false;

    console.log(`reached here in second useEffect`);
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
    window.localStorage.setItem("panelStatus", panelStatus);
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("products", JSON.stringify(products));
  }, [panelStatus, user, products]);

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
          products={products}
          setProducts={setProducts}
          panelStatus={panelStatus}
          setPanelStatus={setPanelStatus}
        ></MainPage>
      )}
    </>
  );
};

export default Home;
