import AuthenticationForm from "./authentication_form";

export default function MyForm({user, setUser, panelStatus, setPanelStatus }) {
  
  return (<AuthenticationForm
        user={user} 
        setUser={setUser}
        panelStatus={panelStatus}
        setPanelStatus={setPanelStatus}
      ></AuthenticationForm>
  );
}
