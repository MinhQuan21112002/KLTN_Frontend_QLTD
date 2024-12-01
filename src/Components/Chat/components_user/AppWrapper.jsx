import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import "./App.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
 
  return (
    <div className="App2">
    
      <div className="app-container">{children}</div>
    
    </div>
  );
};
