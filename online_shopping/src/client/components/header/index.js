import { ajaxConfigHelper } from "../../helper";
import {PANEL_STATUS} from "../constants";
import "./index.css";

export default function Header({
  user, 
  setUser, 
  panelStatus, 
  setVisible, 
  setPanelStatus, 
  setProducts,
}) {
  const signInHandler = () => {
    setVisible((prevState) => !prevState);
  };

  const signOutHandler = async() => {
    const response = await fetch(
        '/customerSignOut',
        ajaxConfigHelper(
            {
              user: user,
            },
            "PUT",
          )
        );
    const {message, status} = await response.json(); 
    console.log(message);

    if (status === '200') {
        alert(`Status: ${message}`);
        setUser(null);
        setPanelStatus(PANEL_STATUS.SIGN_IN);
    }
  };

  return (
    <div className="header-wrapper">
      <button
        className="header-sigin"
        onClick={() => {
          if (panelStatus === PANEL_STATUS.SIGN_IN 
            || panelStatus === PANEL_STATUS.SIGN_UP
            || panelStatus === PANEL_STATUS.UPDATE_PASSWORD) {
            signInHandler();
          } else {
            signOutHandler();
          }
        }}
      >
        {(panelStatus === PANEL_STATUS.SIGN_IN 
        || panelStatus === PANEL_STATUS.SIGN_UP
        || panelStatus === PANEL_STATUS.UPDATE_PASSWORD)
         ? "Sign In" 
         : "Sign Out"}
      </button>
      <input className="searchBox" type="text" placeholder="Search"></input>
    </div>
  );
}
