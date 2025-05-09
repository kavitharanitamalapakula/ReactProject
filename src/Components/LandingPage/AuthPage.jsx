import React, { useState, useEffect } from 'react';
import transparent from '../../assets/Transparent.png';
import "../../Styles/authpage.css"
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    useEffect(() => {
        setFadeIn(true);
    }, []);

    const toggleForm = () => {
        setFadeIn(false);
        setTimeout(() => {
            setIsLogin(!isLogin);
            setFadeIn(true);
        }, 300);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isLogin ? 'Signing In...' : 'Signing Up...');
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
            <div className="auth-form-section">
                <div className={`auth-form-container ${fadeIn ? 'fade-in' : ''}`}>
                    <h2 className="auth-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>

                    {/* <p className="guest-message" style={{ marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>
                        Continue as Guest
                    </p> */}
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="username">Full Name</label>
                                <input
                                    id='username'
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter full name"
                                />
                            </div>
                        )}

                        <div className="form-group" >
                            <label className="form-label" htmlFor="email">Email address</label>
                            <input
                                id='email'
                                type="email"
                                className="form-input"
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                id='password'
                                type="password"
                                className="form-input"
                                placeholder="Enter password"
                            />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id='confirmPassword'
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirm password"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`auth-button ${isHovering ? 'button-hover' : ''}`}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
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
                        >
                            {isLogin ? 'Sign Up here' : 'Sign In here'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;