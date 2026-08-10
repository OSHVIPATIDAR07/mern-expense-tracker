import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, TrendingDown, User, HelpCircle } from 'lucide-react'

export default function Sidebar({ user, isCollapsed, setIsCollapsed }) {
  const location = useLocation()
  const userName = user?.name || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/income', label: 'Income', icon: TrendingUp },
    { path: '/expense', label: 'Expense', icon: TrendingDown },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col justify-between hidden md:flex ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div>
        {/* User Mini Profile Section */}
        <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
            {userInitial}
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {/* Menu Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive 
                    ? 'bg-teal-50 text-teal-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-teal-600' : 'text-gray-500'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer Support Link */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <a
          href="https://hexagondigitalservices.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-3 px-3 py-3 rounded-xl font-medium text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <HelpCircle className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {!isCollapsed && <span>Support</span>}
        </a>
      </div>
    </aside>
  )
}