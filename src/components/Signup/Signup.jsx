import * as style from './signup.module.css';
import google from './Google Icon.png';
import leftDesign from './Group 2.png';
import bottomDesign from './Ellipse 1.png';
import rightDesign from './Ellipse 2.png';
import { NavLink , useNavigate} from 'react-router';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  // State for form inputs
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const apiUrl =  process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, email, password ,confirmPassword }),
      });

      const data = await response.text();
      if (response.ok) {
        toast.success(data || 'Signup successful!',
        { position: 'top-right', autoClose: 3000 });
        setTimeout(() => {
            navigate('/login');
          }, 2000);
      } else {
        toast.error(data || 'Signup failed!', 
        { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong. Please try again later.', { position: 'top-right', autoClose: 3000 });
    }
  };

  return (
    <div className={style.container}>
      {/* Left design */}
      <div className={style.leftDesign}>
        <img src={leftDesign} alt="" />
      </div>
      {/* Signup Form */}
      <form className={style.login} onSubmit={handleSignup}>
        <div className={style.email}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={style.email}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={style.email}>
          <label>Password</label>
          <input
            type="password"
            placeholder="***********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={style.email}>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="***********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={style.email}>
          <button type="submit" className={style.btn}>Sign up</button>
          <h6>OR</h6>
          <div className={style.btnG}>
            <img src={google} alt="" /> Sign in with Google
          </div>
          <p>
            Already have an account? <NavLink to="/login" className={style.a}>Login</NavLink>
          </p>
        </div>
      </form>
      {/* Bottom design */}
      <div className={style.bottomDesign}>
        <img src={bottomDesign} alt="" />
      </div>
      {/* Right design */}
      <div className={style.rightDesign}>
        <img src={rightDesign} alt="" />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;