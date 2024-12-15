import React,{ useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { db } from "../firebase";
import { collection, query, where, getDocs ,Timestamp} from "firebase/firestore";
import { Cart, Chat, Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import { Avatar, Box, WrapItem } from "@chakra-ui/react";
import "./navbarcss.css"
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const user = JSON.parse(localStorage.getItem("data")).userInfo;
  const avatar = JSON.parse(localStorage.getItem("avatar"));
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  const [notifications, setNotifications] = useState([]);
   // Hàm lấy dữ liệu từ Firestore
   const fetchNotifications = async () => {
     try {
       const infoAppyRef = collection(db, "applyInfomation_candidate"); // Thay đổi thành collection phù hợp
   
       // Lấy thời điểm hiện tại và thời điểm 3 ngày trước
       const now = Timestamp.now();
       const threeDaysAgo = Timestamp.fromMillis(now.toMillis() - 3 * 24 * 60 * 60 * 1000); // 3 ngày trước
   
       // Lọc dữ liệu với reccerId khớp và dateApply từ 3 ngày trước đến hôm nay
       const q = query(
         infoAppyRef,
         where("reccerId", "==", data.data.userInfo.id), // Lọc reccerId khớp
       );
   
       const querySnapshot = await getDocs(q);
       const fetchedData = querySnapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));
       const filteredData = fetchedData.filter(item => {
         const applyDate = new Date(item.dateApply.seconds * 1000); // Chuyển đổi dateApply
         return (
           applyDate >= threeDaysAgo.toDate() && 
           applyDate <= now.toDate()
         );
       });
   
       // Lưu dữ liệu vào state
       setNotifications(filteredData);
       console.log("Fetched Notifications: ", fetchedData); // Debug thông tin
     } catch (error) {
       console.error("Error fetching notifications: ", error);
     }
   };
 
   // Gọi fetchNotifications khi component được mount
   useEffect(() => {
     fetchNotifications();
   }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      {/* Menu Button */}
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        {/* Notification Button */}
        <TooltipComponent content="Notifications" position="BottomCenter">
  <div className="relative">
    <button
      type="button"
      onClick={() => handleClick("notification")}
      style={{ color: currentColor }}
      className={`relative text-2xl rounded-full p-4 hover:bg-light-gray ${
        notifications.length > 0 ? 'animate-flicker' : ''
      }`}
    >
      <RiNotification3Line />
      {notifications.length > 0 && (
        <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2 bg-red-500" />
      )}
       </button>
    {/* Notification Dropdown */}
    {isClicked.notification && (
      <div className="absolute right-0 mt-10 bg-white shadow-lg rounded-lg w-64 p-4">
        <p className="font-bold text-lg mb-2">Notifications</p>
        <ul className="list-none space-y-2">
          {notifications.map((notification) => (
            <li
          
              className="text-sm text-gray-600 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</TooltipComponent>


        {/* Profile Section */}
        <TooltipComponent content="Profile" position="BottomCenter">
  <Box
    className="flex items-center gap-4 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
    onClick={() => handleClick("userProfile")}
    fontFamily={"Montserrat"}
    fontWeight={400}
  >
    <WrapItem>
      <Avatar
        name={user && user.fullName ? user.fullName : data.data.email}
        src={avatar}
        size="md" 
      />
    </WrapItem>
    <p>
      <span className="text-gray-400 text-14">Hi,</span>{" "}
      <span className="text-gray-400 font-bold ml-1 text-14">
        {data.data.username ? data.data.username : data.data.email}
      </span>
    </p>
    <MdKeyboardArrowDown className="text-gray-400 text-16" /> {/* Increase size of arrow */}
  </Box>
</TooltipComponent>


        {/* Conditional Rendering */}
    
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
