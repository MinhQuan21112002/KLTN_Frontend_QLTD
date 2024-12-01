import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import "./App.css";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat }) => {
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
    <div className="Chat">
    

      <div className="app-container">{children}</div>
      {isAuth && (
        <div className="sign-out">
          <button onClick={signUserOut}> Sign Out</button>
        </div>
      )}
    </div>
  );
};
