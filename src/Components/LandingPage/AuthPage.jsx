import React, { useState, useEffect } from 'react';
import transparent from '../../assets/Transparent.png';
import "../../Styles/authpage.css"
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/api"
const AuthPage = () => {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState("");
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    useEffect(() => {
        setFadeIn(true);
    }, []);

    const toggleForm = () => {
        setFadeIn(false);
        setError("");
        setTimeout(() => {
            setIsLogin(!isLogin);
            setFadeIn(true);
        }, 300);
    };
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
        });

    };
    const validationForm = () => {
        setError("");
        if (!formData.email || !formData.password) {
            setError("Email and Password are required");
            return false;
        };
        const emailPattren = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[$%&#@]).{8,16}$/
        if (!emailPattren.test(formData.email)) {
            setError("Invalid Email");
            return false;
        }
        if (!isLogin) {
            if (!formData.username) {
                setError("UserName is required");
                return false;
            }
            if (!passwordPattern.test(formData.password)) {
                setError("Password must be at least 6 characters");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return false;
            }

        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validationForm()) {
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(isLogin ? {
                    email: formData.email,
                    password: formData.password
                } : {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                })
            };

            const endpoint = isLogin ? `${URL}/signin` : `${URL}/signup`;
            const response = await fetch(endpoint, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Request failed");
            }

            if (isLogin) {
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            } else {
                toggleForm();
                setError("Signup successful! Please login");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-logo-section">
                <img
                    src={transparent}
                    alt="LinkUp Logo"
                    className={`auth-logo ${fadeIn ? 'fade-in' : ''}`}
                />
            </div>
            <div className={`auth-form-section ${fadeIn ? 'fade-in' : ''}`}>
                <div className={`auth-form-container ${fadeIn ? 'fade-in' : ''}`}>
                    <h2 className="auth-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>

                    {
                        error && (
                            <div style={{ color: error.includes("successful") ? "green" : "red", textAlign: "center" }}>
                                {error}
                            </div>
                        )
                    }
                    {/* <p className="guest-message" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                        Continue as Guest
                    </p> */}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">Full Name <span style={{ color: "red" }}>*</span></label>
                                <input
                                    id='username'
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter full name"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="form-group" >
                            <label className="form-label" htmlFor="email">Email address <span style={{ color: "red" }}>*</span></label>
                            <input
                                id='email'
                                type="email"
                                className="form-input"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password <span style={{ color: "red" }}>*</span></label>
                            <input
                                id='password'
                                type="password"
                                className="form-input"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm Password <span style={{ color: "red" }}>*</span></label>
                                <input
                                    id='confirmPassword'
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {isLogin && (
                            <div className="demo" style={{ marginBottom: "5px", textAlign: "center", padding: "8px", borderRadius: "5px", color: "black" }}>
                                <h6 style={{ marginBottom: "5px", color: "red" }}>Demo Credentials</h6>
                                <p style={{ margin: 0, color: "green" }}>Email: <b>demo@gmail.com</b></p>
                                <p style={{ margin: 0, color: "green" }}>Password: <b>Demo@123</b></p>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`auth-button ${isHovering ? 'button-hover' : ''}`}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing...." : isLogin ? 'Sign In' : 'Sign Up'}
                        </button>

                        {/* <button
                            type="button"
                            className="auth-guest-button"
                            style={{ marginTop: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
                        >
                            Continue as Guest
                        </button> */}
                    </form>

                    <p className="auth-toggle-text">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                            className="auth-toggle-link"
                            onClick={toggleForm}
                            disabled={isLoading}
                        >
                            {isLogin ? 'Sign Up here' : 'Sign In here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
export default AuthPage;