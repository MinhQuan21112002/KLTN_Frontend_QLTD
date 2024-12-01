import "./App.css";
import React, { useState,useEffect } from "react";
import Navbar1 from "./Components/Navbar/Navbar1";
import AllRoutes from "./Routes/AllRoutes";
import AllRoutesAd from "./Routes/AllRoutesAd";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Footer from "./Components/Footer/Footer";
import { BrowserRouter} from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Navbar, FooterAdmin, Sidebar} from "./Components-admin";
import ChatGPT from "./Components/ChatGPT/ChatGPT";
import ChatApp from "./Components/Chat/components_user/ChatApp";
import Cookies from "universal-cookie";

const cookies = new Cookies();
function App() {
  const data=JSON.parse(localStorage.getItem("data"));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatOpen2, setIsChatOpen2] = useState(false);
  const [gptFirst, setGptFirst] = useState(false);
  const [chatApp, setChatApp] = useState(false);
  const isAuthenticated = !!cookies.get("auth-token");
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if(isChatOpen)
    { 
      if(isChatOpen2==false)
      { 
        setGptFirst(true);
        setChatApp(false);
      }
      
    }

  };  
  const toggleChat2 = () => {
    setIsChatOpen2(!isChatOpen2);
    if(isChatOpen2)
    { 
      if(isChatOpen==false)
      {   
        setChatApp(true);
        setGptFirst(false);
      }
      
    }
  };  
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();

   useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);
    // localStorage.removeItem("data");
  if(data!==null)
  {
    if(data.data.role==="ADMIN" ||data.data.role==="INTERVIEWER" ||data.data.role==="RECRUITER" )
  return(
    
    <BrowserRouter>
     <Provider store={store}>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="Top">
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
            }
          >
             <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg w-full ">
              <Navbar />
            </div>
            <div>
              {/* {themeSettings && <ThemeSettings />} */}
              <AllRoutesAd />
            </div>
            <FooterAdmin />
          </div>
        </div>
        </Provider>
      </BrowserRouter>
  )}
  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className="App">
          <Navbar1 />
          <AllRoutes />
          <Footer />

           {/* Chat Button for ChatGPT */}
  <div className="chat-button" onClick={toggleChat}>
  </div>

  {/* ChatGPT Popup */}
  {isChatOpen  &&(
    <div className={`chat-popup ${gptFirst ? "" : "adjust-right"}`}>
      <button className="chat-close-btn" onClick={toggleChat}>
        ✖
      </button>
      <ChatGPT />
    </div>
  )}

  {/* Chat Button for ChatApp */}
  {isAuthenticated && (
    <>
      <div className="chat-button2" onClick={toggleChat2}>
        💬
      </div>
      {isChatOpen2 && (
        <div className={`chat-popup2 ${chatApp ? "" : "adjust-right"}`}>
          <button className="chat-close-btn2" onClick={toggleChat2}>
            ✖
          </button>
          <div className="chat-content">
            <ChatApp />
          </div>
        </div>
      )}
    </>
  )}
        </div>
      </Provider>
    </BrowserRouter>
  )
}

export default App;
