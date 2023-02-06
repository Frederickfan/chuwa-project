import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Button, Row, Col } from "antd";
import { PANEL_STATUS } from "../../constants";
import "./index.css";
const { Meta } = Card;

export default function ProductCard({
  name,
  detail,
  category,
  id,
  price,
  imgUrl,
  createdAt,
  updatedAt,
  panelStatus,
  setPanelStatus,
}) {

  return (
    <div className="card">
      <div className="card_image">
        <img src={imgUrl} alt={name}/>
      </div>
      <div className="card_info">
        <h4>{name}</h4>
        <h4>${price.toLocaleString()}</h4>
        <Button>Add</Button>
        <Button onClick={() => setPanelStatus(PANEL_STATUS.EDIT_PRODUCT)}>Edit</Button>
      </div>
    </div>
  );
}
