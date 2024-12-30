import style from './login.module.css';
import google from './Google Icon.png';
import leftDesign from './Group 2.png';
import bottomDesign from './Ellipse 1.png';
import rightDesign from './Ellipse 2.png';
import { NavLink, useNavigate} from 'react-router';
import { useState,useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const token = document.cookie
        .split(';')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
    const userId = document.cookie
        .split('; ')
        .find((row) => row.startsWith('userId='))
        ?.split('=')[1];
    if (token && userId) {
        navigate(`/dashboard/${userId}`);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login button clicked'); // Debugging log

    if (!email || !password) {
      toast.error('Please enter both email and password.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials:'include'
      });

      const data = await response.json();
      console.log('Response:', data.userName); // Debugging log


      console.log('Cookies after login:', document.cookie);

      if (response.ok) {
        toast.success(data.message, {
          position: 'top-right',
          autoClose: 3000,
        });

      // Navigate to the dashboard with the userId
      setTimeout(()=>navigate(`/dashboard/${data.userId}`), 3000);
      } else{
        toast.error(data.message|| 'Login failed.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error:', error); // Debugging log
      toast.error('Something went wrong. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.leftDesign}>
          <img src={leftDesign} alt="" />
        </div>
        <div className={style.login}>
          <form onSubmit={handleLogin} className={style.form}>
            <div className={style.email}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={style.email}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={style.email}>
              <button type="submit" className={style.btn}>
                Log in
              </button>
              <h6>OR</h6>
              <div className={style.btnG}>
                <img src={google} alt="" /> Sign in with Google
              </div>
              <p>
                Don't have an account?{' '}
                <NavLink to="/signup" className={style.a}>
                  Register now
                </NavLink>
              </p>
            </div>
          </form>
        </div>
        <div className={style.bottomDesign}>
          <img src={bottomDesign} alt="" />
        </div>
        <div className={style.rightDesign}>
          <img src={rightDesign} alt="" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default LoginPage;
