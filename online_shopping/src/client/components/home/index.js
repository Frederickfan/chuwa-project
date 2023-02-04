import Header from "../header";
import Authentication from "../authentication";
import { useState, useEffect, useRef } from "react";
import {PANEL_STATUS} from "../constants/";
import MainPage from "../main_page";
const { v4: uuidv4 } = require("uuid");


const Home = () => {
  const [user, setUser] = useState(null);
  const [panelStatus, setPanelStatus] = useState(PANEL_STATUS.LOADDING);
  const [visible, setVisible] = useState(true);
  const shouldLog = useRef(true);
  useEffect(() => {
    if (!shouldLog.current) {
      return () => {};
    }

    shouldLog.current = false;
    const panelStatusData = window.localStorage.getItem("panelStatus");
    const userData = JSON.parse(window.localStorage.getItem("user"));
    console.log(`user after reload: ${JSON.stringify(userData)}`);

    async function getUserStatus(panelStatusData, userData) {
        const id = userData ? userData.id : uuidv4();
        console.log(`check this id in database now: ${id}`);
        const response = await fetch(
          `/customers/:${id}`,
        );
        const { userStatus } = await response.json();
        console.log(userStatus);

        if (userStatus === "unauthenticated") {
          console.log(panelStatusData);

          if (panelStatusData === null) {
            setPanelStatus(PANEL_STATUS.SIGN_IN);
          } else {
            setPanelStatus(panelStatusData);
          }
        } else {
          setUser(userData);
          setPanelStatus(PANEL_STATUS.LOGGED_IN);
        }
    }
    getUserStatus(panelStatusData, userData);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("panelStatus", panelStatus);
    window.localStorage.setItem("user", JSON.stringify(user));
  }, [panelStatus, user]);

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
      {panelStatus !== PANEL_STATUS.LOGGED_IN ? (
        <Authentication
          user={user}
          setUser={setUser}
          visible={visible}
          setVisible={setVisible}
          panelStatus={panelStatus}
          setPanelStatus={setPanelStatus}
        ></Authentication>
      ) : (
        <MainPage></MainPage>
      )}
    </>
  );
};

export default Home;
