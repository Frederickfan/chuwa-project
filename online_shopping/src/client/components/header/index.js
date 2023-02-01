import PANEL_STATUS from "../constants";
import "./index.css";

export default function Header({visible, setVisible, setPanelStatus}) {
    return(
        <div className="header-wrapper">
            <button 
                className="header-sigin" 
                onClick={() =>{
                        setVisible(prevState => !prevState);
                        setPanelStatus(PANEL_STATUS.SIGN_IN);
                    }
                }
            > 
                Sign In 
            </button>
            <input className="searchBox" type="text" placeholder="Search"></input>
        </div>    
    );
}
