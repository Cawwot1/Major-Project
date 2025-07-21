import '../styles/main.css'
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // can be "login", "signup", "forgot" or "change"

  const handleLoginSignupChange = (e) => {
    e.preventDefault();
    setMode(prev => (prev === "signup" ? "login" : "signup"));
  };

  const handleForgotPasswordToggle = (e) => {
    e.preventDefault();
    setMode(prev => (prev === "forgot" ? "login" : "forgot"));
  };

  const handleChangePasswordToggle = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString(); // e.g., "423984"
    setGeneratedCode(newCode);
    setShowCodePopup(true); // show popup with the code
    setMode("change");
  };
  
  const handleLoginToggle = () => {
    setMode("login"); 
  };

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState(''); //stores the email on the forgot password container
  const [forgotUsername, setForgotUsername] = useState(null);
  
  //Change Password
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCodePopup, setShowCodePopup] = useState(false);


  //FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    if (!forgotUsername || !forgotEmail) {
      let emptyFields = [];
      if (!forgotUsername) emptyFields.push('Username');
      if (!forgotEmail) emptyFields.push('Email');
      alert(`${emptyFields.join(' and ')} is empty`);
      return;
    }
  
    try {
      console.log("Forgot Password Request Sent");
  
      const res = await fetch('http://localhost:5050/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forgotUsername, forgotEmail })
      });
  
      const data = await res.json();
  
      if (res.ok && data.success === true) {
        console.log("Forgot Password Successful");
        handleChangePasswordToggle();
        return;
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Something went wrong.');
      }
    } catch (err) {
      alert('Network or server error.');
      console.error(err);
    }
  };  

  //CHANGE PASSWORD HANDLER
  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    if (codeInput !== generatedCode) {
      alert("Invalid code. Please try again.");
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5050/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword, forgotEmail })
      });
  
      const data = await res.json();
  
      if (res.ok && data.success === true) {
        console.log("Change Password Successful");
        handleLoginToggle();
        return;
      } else if (data.error) {
        alert(data.error);
      } else {
        alert('Something went wrong.');
      }
    } catch (err) {
      alert('Network or server error.');
      console.error(err);
    }
  };
  

  //SIGNUP HANDLER
  const handleSignup = async (e) => {
    e.preventDefault();
  
    console.log("Signup Triggered");
    try {
      const res = await fetch("http://localhost:5050/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
        credentials: 'include',  // This tells the browser to send cookies
      });
  
      console.log("Response Received");

      const csrfToken = res.headers.get("X-Csrf-Token");
      localStorage.setItem("csrfToken", csrfToken);
  
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          console.log("Username Sigup:" + username)
          navigate('/stats', { state: { result: username } });
        }
      } else {
        // Catch Flask JSON error responses
        const errData = await res.json();
        const message = errData?.error || errData?.description || "Unknown signup error";
        alert("Signup failed: " + message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Signup failed due to network error or unexpected issue.");
    }
  };

  //LOGIN HANDLER
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',  // Send cookies with request
      });
  
      if (res.ok) {
        const data = await res.json();
  
        const csrfToken = res.headers.get("X-Csrf-Token");
        localStorage.setItem("csrfToken", csrfToken);
  
        if (data.success) {
          // Use the favourite username if provided, otherwise fallback to blank
          const favouriteUsername = data.favouriteUsername || "";
  
          localStorage.setItem("favouriteUsername", favouriteUsername)

          console.log("Login successful, navigating with favourite username:", favouriteUsername);
  
          navigate('/stats', { state: { result: favouriteUsername } }); 
        }
      } else {
        const errData = await res.json();
        const message = errData?.error || errData?.description || "Unknown login error";
        alert("Login failed: " + message);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Login failed due to network error or unexpected issue.");
    }
  };  

  return (
      <div>
        {/* Background Video */}
        <video autoPlay muted loop playsInline id="login-background-video">
          <source
            src="https://www.dropbox.com/scl/fi/fpk0ri5a17yfiqh187sxn/login-background-footage.mp4?dl=1"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
  
        {showCodePopup && (
        <div className="popup">
          <div className="popup-content">
            <p className="login-text">Your verification code:</p>
            <h3>{generatedCode}</h3>
            <button className="btn btn-secondary" onClick={() => setShowCodePopup(false)}>Close</button>
          </div>
        </div>
        )}

        {/* Main Content */}
        <section className="main-content" id="login-main-content">
          <section className="section-flex" id="login-section">
            <div className="container" id="login-container">
              
              {/* Login Container */}

              <div className={`auth-elements ${mode === "login" ? 'fade-in' : 'fade-out'}`}> {/* If isSignup = True, trigger fade-out in css */}
                <p className="title login-text">Login</p>
                <form onSubmit={handleLogin} class="login-form">
                  <div className="mb-3">
                    <label htmlFor="login-email-input" className="form-label login-text">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="login-email-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="login-password-input" className="form-label login-text">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="login-password-input"
                      placeholder="Password@123"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-container-right" id="forgot-password-container">
                    <a className="login-text" id="forgot-password-text" onClick={handleForgotPasswordToggle}>
                      <p>Forgot Password?</p>
                    </a>
                  </div>
                  <div id="login-button-container">
                    <button type="submit" className="btn btn-primary auth-login-button">
                      Login
                    </button>
                  </div>
                </form>
  
                <p className="login-text" id="sign-up-text-2">Or Login Using</p>
  
                {/* Social Login Logos */}
                <div id="logos">
                  <a className="login-logo" href="https://www.facebook.com/">
                    <svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="50px" height="50px">
                        <path fill="#8bb7f0" d="M40 2A38 38 0 1 0 40 78A38 38 0 1 0 40 2Z"/>
                        <path fill="#fff" d="M77.784 44.013c.006-.054.016-.106.021-.159C77.8 43.907 77.79 43.96 77.784 44.013zM2.194 43.84c.007.073.021.144.029.217C2.215 43.985 2.201 43.912 2.194 43.84zM44.907 50.471h9.835l1.544-9.989H44.907v-5.46c0-4.149 1.356-7.83 5.239-7.83h6.238v-8.719C55.287 18.325 52.97 18 48.59 18c-9.146 0-14.507 4.831-14.507 15.835v6.647h-9.402v9.989h9.402V77.4c1.858.279 3.744.47 5.68.47 1.749 0 3.458-.159 5.144-.388V50.471z"/>
                        <g>
                            <path fill="#4e7ab5" d="M40,3c20.402,0,37,16.598,37,37S60.402,77,40,77S3,60.402,3,40S19.598,3,40,3 M40,2 C19.013,2,2,19.013,2,40s17.013,38,38,38s38-17.013,38-38S60.987,2,40,2L40,2z"/>
                        </g>
                    </svg>
                  </a>
                
                  <a className="login-logo" href="https://x.com/i/flow/login">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64px" height="64px">
                        <linearGradient id="HOaxCdew_So_FZGl4pPQ6a" x1="32" x2="32" y1="9" y2="55" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stop-color="#1a6dff"/>
                          <stop offset="1" stop-color="#c822ff"/>
                        </linearGradient>
                        <path fill="url(#HOaxCdew_So_FZGl4pPQ6a)" d="M49,55H15c-3.309,0-6-2.691-6-6V15c0-3.309,2.691-6,6-6h34c3.309,0,6,2.691,6,6v34	C55,52.309,52.309,55,49,55z M15,11c-2.206,0-4,1.794-4,4v34c0,2.206,1.794,4,4,4h34c2.206,0,4-1.794,4-4V15c0-2.206-1.794-4-4-4H15	z"/>
                        <linearGradient id="HOaxCdew_So_FZGl4pPQ6b" x1="32" x2="32" y1="13" y2="51" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stop-color="#6dc7ff"/>
                          <stop offset="1" stop-color="#e6abff"/>
                        </linearGradient>
                        <path fill="url(#HOaxCdew_So_FZGl4pPQ6b)" d="M26.978,22l14.108,20h-3.063L23.914,22H26.978z M51,15v34c0,1.1-0.9,2-2,2H15	c-1.1,0-2-0.9-2-2V15c0-1.1,0.9-2,2-2h34C50.1,13,51,13.9,51,15z M44.914,44L34.789,29.613L43,20h-2.5l-6.841,8.009L28.022,20	h-7.937l9.222,13.103L20,44h2.5l7.937-9.292L36.978,44H44.914z"/>
                    </svg>
                  </a>

                  <a className="login-logo" href="https://accounts.google.com/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px" aria-label="Google logo" role="img">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  </a>
                </div>
  
                <p className="login-text" id="sign-up-text-3">Don't have an account yet?</p>
                <a className="auth-link" onClick={handleLoginSignupChange}>
                  <p>Sign Up</p>
                </a>
              </div>

              {/* Signup Container */}

              <div className={`auth-elements ${mode === "signup" ? 'fade-in' : 'fade-out'}`}> {/* If isSignup = True, trigger fade-out in css */}
                <p className="title login-text">Signup</p>
                <form onSubmit={handleSignup} class="login-form">
                  <div className="mb-3">
                    <label htmlFor="signup-email-input" className="form-label login-text">
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      className="form-control"
                      id="signup-email-input"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                  <label htmlFor="signup-username-input" className="form-label login-text">
                    Username
                  </label>
                  <input
                    type="text"              
                    name="username"
                    className="form-control"
                    id="signup-username-input"
                    placeholder="Username123"
                    value={username}        
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>

                  <div className="mb-3">
                    <label htmlFor="signup-password-input" className="form-label login-text">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="signup-password-input"
                      placeholder="Password@123"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div id="signup-button-container">
                    <button type="submit" className="btn btn-primary auth-login-button" id="signup-button">
                      Sign Up
                    </button>
                  </div>
                </form>
  
                <p className="login-text" id="sign-up-text-2">Or Sign Up Using</p>
  
                {/* Social Login Logos */}
                <div id="logos">
                  <a className="login-logo" href="https://www.facebook.com/">
                    <svg svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="50px" height="50px">
                        <path fill="#8bb7f0" d="M40 2A38 38 0 1 0 40 78A38 38 0 1 0 40 2Z"/>
                        <path fill="#fff" d="M77.784 44.013c.006-.054.016-.106.021-.159C77.8 43.907 77.79 43.96 77.784 44.013zM2.194 43.84c.007.073.021.144.029.217C2.215 43.985 2.201 43.912 2.194 43.84zM44.907 50.471h9.835l1.544-9.989H44.907v-5.46c0-4.149 1.356-7.83 5.239-7.83h6.238v-8.719C55.287 18.325 52.97 18 48.59 18c-9.146 0-14.507 4.831-14.507 15.835v6.647h-9.402v9.989h9.402V77.4c1.858.279 3.744.47 5.68.47 1.749 0 3.458-.159 5.144-.388V50.471z"/>
                        <g>
                            <path fill="#4e7ab5" d="M40,3c20.402,0,37,16.598,37,37S60.402,77,40,77S3,60.402,3,40S19.598,3,40,3 M40,2 C19.013,2,2,19.013,2,40s17.013,38,38,38s38-17.013,38-38S60.987,2,40,2L40,2z"/>
                        </g>
                    </svg>
                  </a>
  
                  <a className="login-logo" href="https://x.com/i/flow/login">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64px" height="64px">
                        <linearGradient id="HOaxCdew_So_FZGl4pPQ6a" x1="32" x2="32" y1="9" y2="55" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stop-color="#1a6dff"/>
                          <stop offset="1" stop-color="#c822ff"/>
                        </linearGradient>
                        <path fill="url(#HOaxCdew_So_FZGl4pPQ6a)" d="M49,55H15c-3.309,0-6-2.691-6-6V15c0-3.309,2.691-6,6-6h34c3.309,0,6,2.691,6,6v34	C55,52.309,52.309,55,49,55z M15,11c-2.206,0-4,1.794-4,4v34c0,2.206,1.794,4,4,4h34c2.206,0,4-1.794,4-4V15c0-2.206-1.794-4-4-4H15	z"/>
                        <linearGradient id="HOaxCdew_So_FZGl4pPQ6b" x1="32" x2="32" y1="13" y2="51" gradientUnits="userSpaceOnUse">
                          <stop offset="0" stop-color="#6dc7ff"/>
                          <stop offset="1" stop-color="#e6abff"/>
                        </linearGradient>
                        <path fill="url(#HOaxCdew_So_FZGl4pPQ6b)" d="M26.978,22l14.108,20h-3.063L23.914,22H26.978z M51,15v34c0,1.1-0.9,2-2,2H15	c-1.1,0-2-0.9-2-2V15c0-1.1,0.9-2,2-2h34C50.1,13,51,13.9,51,15z M44.914,44L34.789,29.613L43,20h-2.5l-6.841,8.009L28.022,20	h-7.937l9.222,13.103L20,44h2.5l7.937-9.292L36.978,44H44.914z"/>
                    </svg>
                  </a>
  
                  <a className="login-logo" href="https://accounts.google.com/">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px" aria-label="Google logo" role="img">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  </a>
                </div>
  
                <a className="auth-link" id="go-back-link" onClick={handleLoginSignupChange}>
                  <p>Go Back</p>
                </a>
              </div>

              {/* FORGOT PASSWORD CONTAINER */}
              <div className={`auth-elements ${mode === "forgot" ? 'fade-in' : 'fade-out'}`}>
                <p className="title login-text">Forgot Password</p>
                <form onSubmit={handleForgotPassword} className="login-form">
                  <div className="mb-3">
                    <label htmlFor="forgot-email-input" className="form-label login-text">
                      Email
                    </label>
                    <input
                      type="email"
                      name="forgotEmail"
                      className="form-control"
                      id="forgot-email-input"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="forgot-user-input" className="form-label login-text">
                      Username
                    </label>
                    <input
                      type="text"
                      name="forgotUsername"
                      className="form-control"
                      id="forgot-user-input"
                      placeholder="Username123"
                      value={forgotUsername}
                      onChange={e => setForgotUsername(e.target.value)}
                    />
                  </div>
                  <div id="forgot-button-container">
                    <button type="submit" className="btn btn-primary auth-login-button" id="forgot-button">
                      Submit
                    </button>
                  </div>
                </form>
                <a className="auth-link" id="forgot-password-1-content" onClick={handleLoginToggle}>
                  <p>Go Back</p>
                </a>
              </div>

              {/* CHANGE PASSWORD CONTAINER */}
              <div className={`auth-elements ${mode === "change" ? 'fade-in' : 'fade-out'}`}>
                <p className="title login-text">Change Password</p>
                <form onSubmit={handleChangePassword} className="login-form"> 
                  <div className="mb-3">
                    <label htmlFor="code-input" className="form-label login-text">
                      Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      className="form-control"
                      id="code-input"
                      placeholder="name@example.com"
                      value={codeInput}
                      onChange={e => setCodeInput(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="change-password-input" className="form-label login-text">
                      New Password
                    </label>
                    <input
                      type="text"
                      name="newPassword"
                      className="form-control"
                      id="change-password-input"
                      placeholder="Password@123"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div id="forgot-button-container">
                    <button type="submit" className="btn btn-primary auth-login-button" id="forgot-button">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </section>
        </section>
      </div>
    );
  }
  