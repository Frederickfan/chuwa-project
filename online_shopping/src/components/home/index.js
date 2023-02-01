import Header from "../header";
import Authentication from "../authentication";
import { useState } from "react";
import PANEL_STATUS from "../constants";

const Home = () => {
  const [panelStatus, setPanelStatus] = useState(PANEL_STATUS.SIGN_IN);
  const [visible, setVisible] = useState(true);

  return (
    <>
      <Header 
        visible={visible} 
        setVisible={setVisible}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
       ></Header>
      <Authentication
        visible={visible}
        setVisible={setVisible}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
      ></Authentication>
    </>
  );
};

export default Home;
