import React, { useState } from 'react';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Both.css';
import { hostName } from '../../global';
import { Box, Button } from '@chakra-ui/react';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { GoogleLogin } from '@react-oauth/google';
import jwtDecode from "jwt-decode";
import Cookies from "universal-cookie";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";

const cookies = new Cookies();

const Signup = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      toast.warning('Name is required!', { position: 'top-center' });
    } else if (!email) {
      toast.error('Email is required!', { position: 'top-center' });
    } else if (!email.includes('@')) {
      toast.warning('Include "@" in your email!', { position: 'top-center' });
    } else if (!password) {
      toast.error('Password is required!', { position: 'top-center' });
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters!', { position: 'top-center' });
    } else if (!confirmpassword) {
      toast.error('Confirm password is required!', { position: 'top-center' });
    } else if (password !== confirmpassword) {
      toast.error('Passwords do not match!', { position: 'top-center' });
    } else {
      try {
        const config = { headers: { 'Content-type': 'application/json' } };
        setLoading(true);

        const { data } = await axios.post(`${hostName}/auth/register`, { username, email, password }, config);
        console.log(data);
        setTimeout(() => navigate(`/verify/${email}`), 2000);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        toast.error(errorMessage, { position: 'top-center' });
        setLoading(false);
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      const username = result.user.displayName;
      const password = result.user.uid;

    
      setLoading(true);

      const config = { headers: { 'Content-type': 'application/json' } };
      const { data } = await axios.post(`${hostName}/auth/register`, { username, email, password }, config);

      if (data.data) {
        setTimeout(() => navigate(`/verify/${email}`), 2000);
      } else {
        toast.error(data.message, { position: 'top-center' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google Sign-In failed';
      toast.error(errorMessage, { position: 'top-center' });
      setLoading(false);
    }
  };

  return (
    <session>
      <Box fontFamily={'Montserrat'} mt={15} className='main'>
        <Box
          h={'auto'}
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/34/e7/eb/34e7eb9d5803c1e4ec087637c4d15076.jpg')`,
          }}
          className='form_data3'>
          <Box mt={10} fontSize={25} className='form_heading'>
            Find a job & grow your career
          </Box>
          <form>
            <div className='form_input_name'>
              <label htmlFor='name'>Full Name</label>
              <input type='text' value={username} onChange={(e) => setName(e.target.value)} name='name' id='name' placeholder='Enter Your Name' />
            </div>
            <div className='form_input'>
              <label htmlFor='email'>Email</label>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} name='email' id='email' placeholder='Enter Your Email' />
            </div>
            <div className='form_input'>
              <label htmlFor='password'>Password</label>
              <div className='two'>
                <input type={passShow ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' placeholder='Enter Your Password' />
                <div className='showpass1' onClick={() => setPassShow(!passShow)}>
                  {passShow ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </div>
              </div>
            </div>
            <div className='form_input'>
              <label htmlFor='confirmpassword'>Confirm Password</label>
              <div className='two'>
                <input type={cpassShow ? 'text' : 'password'} value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} name='confirmpassword' id='confirmpassword' placeholder='Confirm Your Password' />
                <div className='showpass1' onClick={() => setCPassShow(!cpassShow)}>
                  {cpassShow ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </div>
              </div>
            </div>

            <button type='button' onClick={signInWithGoogle}>Sign In With Google</button>
            <Button color={'white'} mb={10} backgroundColor={'#87b2c4'} onClick={handleSubmit}>
              Register Now
            </Button>
          </form>
          <ToastContainer />
        </Box>
      </Box>
    </session>
  );
};

export default Signup;
