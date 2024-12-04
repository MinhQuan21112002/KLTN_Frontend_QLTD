import { auth,provider } from "../../../firebase";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";
import googleLogo from "./google.png";
import { toast, ToastContainer } from "react-toastify";
const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {

  const mail=cookies.get("roommail");
 
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const getmail=result.user.email;
    if(getmail===(mail))
    {
      toast.success("Logged in successfully!", { position: "top-center" });
      cookies.set("auth-token", result.user.refreshToken);
      cookies.set("userNameGG", result.user.displayName);
      
      setIsAuth(true);
    }
    else{
      toast.error("Vui lòng đăng nhập đúng Email", { position: "top-center" });
      return;
    }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div
    
    className="auth"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
    }}
  >
   <p style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
  Sign In With Google To Continue
</p>

    <button
      className="google-signin-btn"
      onClick={signInWithGoogle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        backgroundColor: "white",
        color: "#757575",
        fontSize: "16px",
        fontWeight: "bold",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px 20px",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        transition: "box-shadow 0.2s ease, background-color 0.2s ease",
        marginBottom:"40%",
        marginTop:"1%",
      }}
    >
      <img
        src={googleLogo}
        alt="Google Logo"
        style={{
          width: "24px",
          height: "24px",
          marginRight: "10px",
        }}
      />
      Sign In With Google
    </button>
    <ToastContainer/>
  </div>
  
  );
};
