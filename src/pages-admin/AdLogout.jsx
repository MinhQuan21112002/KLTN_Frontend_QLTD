import "react-toastify/dist/ReactToastify.css";
import { webHost } from "../global";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const AdLogout = () => {
  localStorage.removeItem("data");
  window.location.replace(`${webHost}`);
  cookies.remove("auth-token", { path: "/" });
  cookies.remove("roommail", { path: "/" });
  cookies.remove("username", { path: "/" });
 
  return(
    <div>

    </div>
  );
};

export default AdLogout;
