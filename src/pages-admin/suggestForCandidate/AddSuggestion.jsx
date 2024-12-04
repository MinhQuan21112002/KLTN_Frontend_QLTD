import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Header } from "../../Components-admin";
import { Button, Box, Select, Stack, Input } from "@chakra-ui/react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const AddSuggestion = () => {
  const messagesRef = collection(db, "popularJob");
  const navigate = useNavigate();

  // Trạng thái để lưu dữ liệu của các input
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    exp: "",
    salary: "",
    imgLink: "",
    id: "",
  });

  // Xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý khi bấm "Save"
  const handleSubmit = async () => {
    const { name, location, exp, salary, imgLink, id } = formData;


    try {
      await addDoc(messagesRef, {
        name,
        location,
        exp,
        salary,
        imgLink,
        id,
      });
      toast.success("Dữ liệu đã được lưu thành công!");
      navigate("/suggest");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu dữ liệu!");
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Add Suggestion" title="Suggestion" />

        <Stack spacing={5}>
          <Input
            name="name"
            variant="outline"
            value={formData.name}
            placeholder="Tên gợi ý"
            onChange={handleChange}
          />

          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select
              fontFamily={'Montserrat'}
              onChange={handleChange}
              name="location"
              color={'#8292b4'}
              border={'none'}
              defaultValue={formData.location || 'all'}
            >
                <option value='all'>Địa điểm</option>
                    <option value='Hồ Chí Minh'>Hồ Chí Minh</option>
<option value='Đà Nẵng'>Đà Nẵng</option>
<option value='Hà Nội'>Hà Nội</option>
<option value='Cần Thơ'>Cần Thơ</option>
<option value='Hải Phòng'>Hải Phòng</option>
<option value='Quảng Ninh'>Quảng Ninh</option>
<option value='Thừa Thiên Huế'>Thừa Thiên Huế</option>
<option value='Bình Dương'>Bình Dương</option>
<option value='Đồng Nai'>Đồng Nai</option>
<option value='Khánh Hòa'>Khánh Hòa</option>
<option value='Lâm Đồng'>Lâm Đồng</option>
<option value='Nghệ An'>Nghệ An</option>
<option value='Thanh Hóa'>Thanh Hóa</option>
<option value='Bình Thuận'>Bình Thuận</option>
<option value='Bà Rịa - Vũng Tàu'>Bà Rịa - Vũng Tàu</option>
<option value='Kiên Giang'>Kiên Giang</option>
<option value='An Giang'>An Giang</option>
<option value='Bắc Ninh'>Bắc Ninh</option>
<option value='Hà Nam'>Hà Nam</option>
<option value='Thái Nguyên'>Thái Nguyên</option>
<option value='Quảng Ngãi'>Quảng Ngãi</option>
            </Select>
          </Box>

          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select
              fontFamily={'Montserrat'}
              onChange={handleChange}
              name="exp"
              color={'#8292b4'}
              border={'none'}
              defaultValue={formData.exp || 'all'}
            >
              <option value="all">Kinh nghiệm</option>
              <option value="chưa có">Chưa có</option>
              <option value="dưới 1 năm">Dưới 1 năm</option>
              <option value="1 năm">1 năm</option>
              <option value="2 năm">2 năm</option>
              <option value="3 năm">3 năm</option>
              <option value="4 năm">4 năm</option>
              <option value="5 năm">5 năm</option>
              <option value="trên 5 năm">Trên 5 năm</option>
            </Select>
          </Box>

          <Box w={'223px'} h={'100%'} pr={'0px'} pt={'4px'} pl={'10px'} pb={'6px'}>
            <Select
              fontFamily={'Montserrat'}
              onChange={handleChange}
              name="salary"
              color={'#8292b4'}
              border={'none'}
              defaultValue={formData.salary || 'all'}
            >
              <option value="all">Mức lương</option>
              <option value="Dưới 10 triệu">Dưới 10 triệu</option>
              <option value="10 -15 triệu">10 -15 triệu</option>
              <option value="15 -20 triệu">15 -20 triệu</option>
              <option value="20 -25 triệu">20 -25 triệu</option>
              <option value="25 -30 triệu">25 -30 triệu</option>
              <option value="30 -50 triệu">30 -50 triệu</option>
              <option value="trên 50 triệu">Trên 50 triệu</option>
              <option value="thỏa thuận">Thỏa thuận</option>
            </Select>
          </Box>

          <Input
            name="imgLink"
            variant="outline"
            value={formData.imgLink}
            placeholder="Link ảnh"
            onChange={handleChange}
          />
        </Stack>

        <div className="mt-24">
          <div className="flex flex-wrap lg:flex-nowrap justify-center ">
            <div className="mt-6">
              <Button
                height="50px"
                color="white"
                bgColor="#97a4a6"
                borderRadius="10px"
                onClick={() => navigate("/suggest")}
              >
                Cancel
              </Button>
              <Button
                height="50px"
                color="white"
                bgColor="#03C9D7"
                borderRadius="10px"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
