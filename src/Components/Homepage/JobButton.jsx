import { Box, Button, Flex, Grid, Heading, Image } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from "../../firebase";  // Đảm bảo import db từ firebase cấu hình của bạn

const JobButton = () => {
  const [suggest, setSuggest] = useState([]);

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const messagesRef = collection(db, "popularJob"); // Thay 'popularJob' bằng tên collection của bạn
    const queryRooms = query(messagesRef);
    const unsubscribe = onSnapshot(queryRooms, (snapshot) => {
      const roomsSet = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data) {
          roomsSet.push({ ...data, id: doc.id });
        }
      });
      setSuggest(roomsSet); // Cập nhật state với dữ liệu lấy từ Firestore
    });

    // Cleanup function khi component unmount
    return () => unsubscribe();
  }, []); // Chạy khi component được mount lần đầu

  return (
    <div style={{marginBottom:"15%"}}>
        <Heading fontFamily={'Montserrat'} mt={5} textAlign={'center'} fontWeight={'700'} fontSize={'27px'} lineHeight={'40px'} mb={'6px'}>
          Gợi ý công việc
        </Heading>
      <Box width='80%' height='auto' margin='auto' mt={16}>
        <Grid h='170px' templateRows='repeat(6, 2fr)'>
        <Flex justifyContent='center'>
  <Grid 
    templateColumns='repeat(6, 3fr)' // 6 button mỗi hàng
    gap={7} // Khoảng cách giữa các button
  >
    {suggest && suggest.map((job, index) => (
      <Link 
        key={index} 
        to={`/jobpage-search/${job.name || 'all'}/${job.location || 'all'}/${job.exp || 'all'}/${job.salary || 'all'}`}
      >
        <Button
          textAlign="center"
          h="70px"
          width="170px"
          bg="white"
          boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
          borderTopLeftRadius={20}
          borderBottomRightRadius={20}
          _hover={{
            bg: 'white',
            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          }}
        >
          <Image src={job.imgLink} height={10} />{' '}
          <p>{job.name}</p>
        </Button>
      </Link>
    ))}
  </Grid>
</Flex>

        </Grid>
      </Box>
    </div>
  );
};

export default JobButton;
