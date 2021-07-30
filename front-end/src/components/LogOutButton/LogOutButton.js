
import Button from '@material-ui/core/Button';

import { useHistory } from "react-router-dom";

import "./LogOutButton.css";

export default function LogInPage() {

  const history = useHistory();


  const handleClick= () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user_id");
    setTimeout(() => history.push("/login"), 800);
  };



  return (
    
        <Button
        id="logout-button"
        variant="contained"
        onClick={handleClick}
        >
            Log Out
        </Button>
    
  );
}
