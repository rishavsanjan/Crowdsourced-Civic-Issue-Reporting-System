import { BarChartBig, LayoutDashboard, Map } from 'lucide-react'
import type React from 'react'
import type { SetStateAction } from 'react'
import { Link } from 'react-router-dom'

interface Props {
    activeTab: "dashboard" | "map" | "analytics"
    setActiveTab: React.Dispatch<SetStateAction<"dashboard" | "map" | "analytics">>
}

const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
    
    return (
        <aside className="w-64 bg-white light:bg-gray-800 flex-shrink-0 border-r border-gray-200 light:border-gray-700">
            <div className="flex flex-col h-full p-4">
                <div className="flex items-center gap-2 px-2 py-4">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                    </svg>
                    <h1 className="text-xl font-bold text-gray-900 light:text-white">FixMyCity</h1>
                </div>
                <nav className="mt-8 flex-1">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => {
                                    setActiveTab("analytics")
                                }}
                                className={`${activeTab === "analytics" && "bg-blue-50 text-blue-600 "} flex items-center gap-3 px-3 py-2 rounded  light:bg-blue-900/20 font-medium`} >

                                <BarChartBig />
                                <span className="font-medium">Analytics</span>
                            </button>

                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    setActiveTab("map")
                                }}
                                className={`${activeTab === "map" && "bg-blue-50 text-blue-600 "} flex items-center gap-3 px-3 py-2 rounded  light:bg-blue-900/20 font-medium`}>

                                <Map />
                                <span className="font-medium">Map</span>
                            </button>


                        </li>
                        <li>

                            <button
                                onClick={() => {
                                    setActiveTab("dashboard")
                                }}
                                className={`${activeTab === "dashboard" && "bg-blue-50 text-blue-600 "} flex items-center gap-3 px-3 py-2 rounded  light:bg-blue-900/20 font-medium`} >

                                <LayoutDashboard />
                                <span className="font-medium">Dashboard</span>
                            </button>
                        </li>


                    </ul>
                </nav>
                <div className="mt-auto">
                    <Link
                        onClick={() => {
                            localStorage.removeItem("admincitytoken")
                        }}
                        to={"/admin-login"}
                        className="flex items-center gap-3 px-3 py-2 rounded text-gray-700 light:text-gray-300 hover:bg-blue-50 light:hover:bg-blue-900/20 hover:text-blue-600" >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </Link>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar