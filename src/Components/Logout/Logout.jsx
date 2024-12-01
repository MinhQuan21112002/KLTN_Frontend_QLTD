import "react-toastify/dist/ReactToastify.css";
import { hostName, webHost } from "../../global";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const Logout = () => {
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

export default Logout;
