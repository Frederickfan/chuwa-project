import { Modal } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import MyForm from "../form";

export default function Authentication({visible, setVisible, panelStatus, setPanelStatus }) {

  return (
    <>
      <Modal
        width={400}
        bodyStyle={{ height: 500, backgroundColor:'white'}}
        closeIcon={<CloseCircleOutlined />}
        title={"LOGIN"}
        visible={visible}
        footer={null}
        mask={false}
        onCancel={() => setVisible(false)}
      >
        <MyForm panelStatus={panelStatus} setPanelStatus={setPanelStatus}></MyForm>
      </Modal>
    </>
  );
}

