import React from "react";
import "./Register.css";
import {
    FaRegUserCircle,
    FaFacebook,
    FaGithub
} from "react-icons/fa";

import {
    MdOutlineEmail,
    MdLockOutline
} from "react-icons/md";

import { FcGoogle } from "react-icons/fc";


function Register() {
    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Register form submitted");
    };

    return (
        <div className="register-page">

            {/* Background Video */}
            <video
                className="background-video"
                autoPlay
                muted
                loop
                playsInline
            >
                <source
                    src="/summer-mountain-paradise.3840x2160.mp4"
                    type="video/mp4"
                />

                Your browser does not support the video tag.
            </video>


            {/* Register Card */}
            <div className="register-card">

                {/* Heading */}
                <h2>Create Account</h2>

                <p>Sign up to get started</p>


                {/* Social Login Icons */}
                <div className="icons">

                    <FcGoogle
                        className="icon1"
                        title="Google"
                    />

                    <FaFacebook
                        className="fb"
                        title="Facebook"
                    />

                    <FaGithub
                        className="icon2"
                        title="GitHub"
                    />

                </div>


                {/* Register Form */}
                <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="icon">

                        <FaRegUserCircle />

                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* Email */}
                    <div className="icon">

                        <MdOutlineEmail />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* Password */}
                    <div className="icon">

                        <MdLockOutline />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    {/* Remember Me */}
                    <div className="remember">

                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                        />

                        <label htmlFor="remember">
                            Remember me
                        </label>

                    </div>


                    {/* Register Button */}
                    <button type="submit">
                        Register
                    </button>

                </form>


                {/* Login Link */}
                <div className="login-text">

                    Already have an account?

                    <a href="/login">
                        {" "}Login
                    </a>

                </div>

            </div>

        </div>
    );
}

export default Register;

