import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const handleSubmit = async () => {
        const response = await axios({
            url: 'http://10.11.9.95:3000/api/user/login',
            method: 'POST',
            data: {
                email: formData.email,
                password: formData.password,
            }
        });
        console.log(response);
        setFormData({
            email: "",
            password: ''
        })

        localStorage.setItem('admincitytoken', response.data.msg);
        navigate("/");

    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 light:bg-gray-900 font-sans">
            {/* Header */}
            <header className="bg-white/80 light:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200 light:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3 text-gray-800 light:text-white">
                            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                            <h1 className="text-xl font-bold">CivicConnect Admin</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-xl space-y-8">
                    <div className="bg-white light:bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 light:text-white">Welcome to CivicConnect!</h2>
                            <p className="mt-2 text-sm text-gray-600 light:text-gray-400">Let's set up your account.</p>
                        </div>

                        <div id="onboarding-steps">                            <div className="space-y-6">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 light:text-gray-300" htmlFor="email">Email Address</label>
                                <div className="mt-1">
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 light:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 light:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white light:bg-gray-900 text-gray-900 light:text-white"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 light:text-gray-300" htmlFor="password">Password</label>
                                <div className="mt-1">
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 light:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 light:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white light:bg-gray-900 text-gray-900 light:text-white"
                                        id="password"
                                        name="password"
                                        placeholder="Create a password"
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                                    onClick={() => handleSubmit()}
                                    type="button"
                                >
                                    Submit
                                </button>
                            </div>
                            <div className='flex flex-row gap-2 items-center justify-center'>
                                <span>Already Signed up ? </span>
                                <Link to={'/admin-login'}>
                                    <p className='text font-bold '>  Login</p>
                                </Link>

                            </div>
                        </div>



                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}