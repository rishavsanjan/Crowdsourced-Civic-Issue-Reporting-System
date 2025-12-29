import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        <aside className="w-64 bg-white light:bg-gray-800 flex-shrink-0 border-r border-gray-200 light:border-gray-700">
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center gap-2 px-2 py-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-900 light:text-white">CityFix</h1>
                </div>
                <nav className="mt-8 flex-1">
                    <ul className="space-y-2">
                        <li>
                            <Link to={'/dashboard'} className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                </svg>
                                <span className="font-medium">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={'/my-map-all'} className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                </svg>
                                <span className="font-medium">Map</span>
                            </Link>

                        </li>
                        <li>
                            <a className="flex items-center gap-3 px-3 py-2 rounded bg-blue-50 light:bg-blue-900/20 text-blue-600 font-medium" href="#">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                </svg>
                                <span className="font-medium">Reports</span>
                            </a>
                        </li>
                        <li>
                            <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                                <span className="font-medium">Users</span>
                            </a>
                        </li>
                        <li>
                            <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                                </svg>
                                <span className="font-medium">Settings</span>
                            </a>
                        </li>
                        <li>
                            <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
                                </svg>
                                <span className="font-medium">Help</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <a className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" href="#">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </a>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar