import { ajaxConfigHelper } from "../../helper";
import { PANEL_STATUS } from "../constants";
import ShoppingCart from "./shoppingCart";
import { Button } from "antd";

import "./index.css";

export default function Header({
  user,
  setUser,
  panelStatus,
  setVisible,
  setPanelStatus,
  cart,
  setCart,
  products,
  setIsMerged,
}) {
  const signInHandler = () => {
    setVisible((prevState) => !prevState);
    setPanelStatus(PANEL_STATUS.SIGN_IN);
  };

  const signOutHandler = async () => {
    const response = await fetch(
      "/customerSignOut",
      ajaxConfigHelper(
        {
          user: user,
        },
        "PUT"
      )
    );
    const { message, status } = await response.json();
    console.log(message);

    if (status === "200") {
      alert(`Status: ${message}`);
      setUser(null);
      setPanelStatus(PANEL_STATUS.SIGN_IN);
      setCart(null);
      setIsMerged(false);
    }
  };

  return (
    <div className="header-wrapper">
      <ShoppingCart 
        user={user}
        cart={cart} 
        setCart={setCart}
        products={products}
      ></ShoppingCart>
      <Button
        className="header-sigin"
        onClick={() => {
          if (
            panelStatus === PANEL_STATUS.SIGN_IN ||
            panelStatus === PANEL_STATUS.SIGN_UP ||
            panelStatus === PANEL_STATUS.UPDATE_PASSWORD || 
            panelStatus === PANEL_STATUS.LINK_SENT || 
            !user
          ) {
            signInHandler();
          } else {
            signOutHandler();
          }
        }}
      >
        {panelStatus === PANEL_STATUS.SIGN_IN ||
        panelStatus === PANEL_STATUS.SIGN_UP ||
        panelStatus === PANEL_STATUS.UPDATE_PASSWORD || 
        panelStatus === PANEL_STATUS.LINK_SENT || 
        user === null
          ? "Sign In"
          : "Sign Out"}
      </Button>
      <Button onClick={() => setPanelStatus(PANEL_STATUS.MAIN_PAGE)}>
        Main Page
      </Button>
      <input className="searchBox" type="text" placeholder="Search"></input>
    </div>
  );
}
