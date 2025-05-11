import React, { useState, useEffect } from 'react';
import transparent from '../../assets/Transparent.png';
import "../../Styles/authpage.css";
import { useNavigate } from 'react-router-dom';

const URL = "http://localhost:5000/api";

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({
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
        setFormErrors({ username: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
            setIsLogin(!isLogin);
            setFadeIn(true);
        }, 300);
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'username') {
            if (!value.trim()) {
                error = 'Full Name is required';
            }
        }

        if (name === 'email') {
            const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!emailPattern.test(value)) {
                error = 'Invalid email format';
            }
        }

        if (name === 'password') {
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[$%&#@]).{8,16}$/;
            if (!value.trim()) {
                error = 'Password is required';
            } else if (!passwordPattern.test(value)) {
                error = 'Password must be 8-16 chars, with uppercase, number & special char';
            }
        }

        if (name === 'confirmPassword') {
            if (!value.trim()) {
                error = 'Confirm password is required';
            } else if (value !== formData.password) {
                error = 'Passwords do not match';
            }
        }

        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        validateField(id, value);
    };

    const validationForm = () => {
        setError("");

        const fieldsToValidate = isLogin ? ['email', 'password'] : ['username', 'email', 'password', 'confirmPassword'];
        let valid = true;

        fieldsToValidate.forEach(field => {
            validateField(field, formData[field]);
            if (formErrors[field]) {
                valid = false;
            }
        });

        for (let field of fieldsToValidate) {
            if (!formData[field]) {
                valid = false;
                break;
            }
        }

        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validationForm()) {
            setError("Please fix the errors above before submitting");
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
                setError("Signup successful! Please SignIn");
            }

        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    };


    return (
        <div className="auth-container">
            <div className="auth-subContainer">

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

                        {error && (
                            <div style={{ color: error.includes("successful") ? "green" : "red", textAlign: "center" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="username">Full Name<sup style={{ color: "red" }}>*</sup> </label>
                                    <input
                                        id='username'
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter full name"
                                        value={formData.username}
                                        onChange={handleChange}
                                        onBlur={(e) => validateField('username', e.target.value)}
                                    />
                                    {formErrors.username && <p className="error-text">{formErrors.username}</p>}
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email address<sup style={{ color: "red" }}>*</sup></label>
                                <input
                                    id='email'
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={(e) => validateField('email', e.target.value)}
                                />
                                {formErrors.email && <p className="error-text">{formErrors.email}</p>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password<sup style={{ color: "red" }}>*</sup></label>
                                <input
                                    id='password'
                                    type="password"
                                    className="form-input"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={(e) => validateField('password', e.target.value)}
                                />
                                {formErrors.password && <p className="error-text">{formErrors.password}</p>}
                            </div>

                            {!isLogin && (
                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirmPassword">Confirm Password<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        id='confirmPassword'
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={(e) => validateField('confirmPassword', e.target.value)}
                                    />
                                    {formErrors.confirmPassword && <p className="error-text">{formErrors.confirmPassword}</p>}
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
                                {isLoading ? "Processing..." : isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
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
        </div>

    );
}

export default AuthPage;
