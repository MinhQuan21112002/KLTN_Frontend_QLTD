import { MdOutlineCancel } from "react-icons/md";
import { Button } from ".";
import { chatData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import { collection, query, where, getDocs ,Timestamp} from "firebase/firestore";
import { db } from "../firebase";
import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { webHost } from "../global";
const Notification = () => {
  const { currentColor } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const data=JSON.parse(localStorage.getItem("data"));
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


  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-97">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <p className="font-semibold text-lg dark:text-gray-200">
            Notifications
          </p>
          <button
            type="button"
            className="text-white text-xs rounded p-1 px-2 bg-orange-theme "
          >
            {" "}
            5 New
          </button>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="mt-5 ">
        {notifications?.map((item, index) => (
       <Link
      to={`/jobDetail_Recruiter/${item.jobId}`} // Đường dẫn đến trang chi tiết công việc
      className="flex items-center leading-8 gap-5 border-b-1 border-color p-3"
    >
      <img
        className="rounded-full h-10 w-10"
        src={item.image}
        alt={item.emailCandiate}
      />
      <div>
        <p className="font-semibold dark:text-gray-200">{item.emailCandiate}</p>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {item.nameCandidate} đã apply công việc
        </p>
      </div>
    </Link>
        ))}
        <div className="mt-5">
          <Button
            color="white"
            bgColor={currentColor}
            text="See all notifications"
            borderRadius="10px"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
