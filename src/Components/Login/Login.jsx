import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Box } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import axios from 'axios'
import './styleLogin.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { hostName, webHost } from '../../global'
import { Button, ButtonGroup, CircularProgress, Image, Spinner } from '@chakra-ui/react'
import { IoEyeOutline } from 'react-icons/io5'
import { IoEyeOffOutline } from 'react-icons/io5'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth,provider } from "../../firebase";
import googleLogo from "./google.png";
const cookies = new Cookies();

const Login = () => {
  const [passShow, setPassShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return false;
    }
    if (!email.includes("@")) {
      toast.warning("Email must include '@'!", { position: "top-center" });
      return false;
    }
    if (!password) {
      toast.error("Password is required!", { position: "top-center" });
      return false;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters!", { position: "top-center" });
      return false;
    }
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const config = { headers: { "Content-type": "application/json" } };
      const { data } = await axios.post(`${hostName}/auth/login`, { email, password }, config);

      if (data.data) {
        toast.success("User logged in successfully!", { position: "top-center" });
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("avatar", JSON.stringify(data.data.userInfo.avatar));
        cookies.set("roommail", email);
        cookies.set("username", data.data.username);
        window.location.replace(`${webHost}`);
      } else if (data.message === "Your account is not activate!!!") {
        toast.error(data.message, { position: "top-center" });
        await axios.post(`${hostName}/auth/send-otp`, { email }, config);
        setTimeout(() => navigate(`/verify/${email}`), 2000);
      } else {
        toast.error(data.message, { position: "top-center" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };


  const signInWithGoogle = async () => {
    try {
      const config = { headers: { "Content-type": "application/json" } };
      const result = await signInWithPopup(auth, provider);
      const googleEmail = result.user.email;
      const googlePassword = result.user.uid;
      const username = result.user.displayName;
      const image =result.user.photoURL;
      cookies.set("auth-token", result.user.refreshToken);
      cookies.set("roommail", googleEmail);
      cookies.set("username", username);
      console.log(result);
     
      setLoading(true);
      const { data } = await axios.post(`${hostName}/auth/login`, { email: googleEmail, password: googlePassword });

      if (data.data) {
        toast.success("Google login successful!", { position: "top-center" });
        localStorage.setItem("data", JSON.stringify(data));
        localStorage.setItem("avatar", JSON.stringify(data.data.userInfo.avatar));
        console.log(data.access_token);
        navigate(`/`);
        
      } else if (data.message === "Your account is not activate!!!") {
        toast.error(data.message, { position: "top-center" });
        await axios.post(`${hostName}/auth/send-otp`, googleEmail , config);
        setTimeout(() => navigate(`/verify/${googleEmail}`), 2000);
      } else {
        toast.error(data.message, { position: "top-center" });
      }
   
    } catch (error) {
      toast.error("Firebase login failed!", { position: "top-center" });
    }
  };

  return (
    <section className="login_section">
      <Box mb={40} fontFamily="Montserrat" display="flex" mt={5}>
        <Box
          style={{
            backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/007/559/359/non_2x/panda-an-illustration-of-a-panda-logo-climbing-a-bamboo-tree-free-vector.jpg')`,
          }}
          className="left_section"
        >
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{ marginLeft: "10%", marginTop: "10%", fontSize: "20px" }}>Register For Free</button>
          </Link>
        </Box>
        <Box className="form_data">
          <div className="form_heading">
            <p>Welcome Back, Log In</p>
          </div>
          <form onSubmit={submitHandler}>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                id="email"
                placeholder="Enter Your email here"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={passShow ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  id="password"
                  placeholder="Enter Your password"
                  style={{ borderRadius: "10px" }}
                />
                <div className="showpass" onClick={() => setPassShow(!passShow)}>
                  {passShow ? "Hide" : "Show"}
                </div>
              </div>
            </div>
            <Button type="submit" style={{ width: "100%" }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
       
          </form>
         
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
        marginBottom:"5%",
        marginTop:"2%",
        width:"74%"
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

          <Link fontFamily={'Montserrat'} to={`/resetPassword`} style={{width:"74%"}}>
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
        marginBottom:"5%",
        marginTop:"1%",
        width:"100%",
      }}
    >
    Quên tài khoản 
    </button>
            </Link>
          <ToastContainer />
        </Box>
      </Box>
    </section>
  );
};

export default Login;
