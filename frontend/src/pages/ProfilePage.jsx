import React, { useState } from 'react'
import { User, Lock, Mail, Save, X, LogOut, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function ProfilePage({ user, onLogout }) {
  const [editMode, setEditMode] = useState(false)
  const [tempUser, setTempUser] = useState({ 
    name: user?.name || '', 
    email: user?.email || '' 
  })
  
  const [passwords, setPasswords] = useState({ 
    currentPassword: '', 
    newPassword: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [passMessage, setPassMessage] = useState({ text: '', type: '' })

  // Update Profile Info (Name & Email)
  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      await axios.put(
        'http://localhost:4000/api/user/profile', 
        tempUser, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setEditMode(false)
      setMessage({ text: 'Profile updated successfully!', type: 'success' })
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to update profile', 
        type: 'error' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Update User Password
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPassLoading(true)
    setPassMessage({ text: '', type: '' })

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassMessage({ text: 'New passwords do not match!', type: 'error' })
      setPassLoading(false)
      return
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      await axios.put(
        'http://localhost:4000/api/user/password', 
        {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPassMessage({ text: 'Password changed successfully!', type: 'success' })
    } catch (err) {
      setPassMessage({ 
        text: err.response?.data?.message || 'Failed to change password', 
        type: 'error' 
      })
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile information and security preferences.</p>
      </div>

      {/* Global Status Message */}
      {message.text && (
        <div className={`p-4 rounded-xl text-sm flex items-center space-x-2 border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Personal Info Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl text-white flex items-center justify-center font-bold text-xl shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          {!editMode && (
            <button
              onClick={() => {
                setTempUser({ name: user?.name || '', email: user?.email || '' })
                setEditMode(true)
              }}
              className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleProfileSave} className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={tempUser.name}
                  onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={tempUser.email}
                  onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm">
            <div>
              <p className="text-xs text-gray-400 font-medium">Full Name</p>
              <p className="font-semibold text-gray-800 mt-1">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Email Address</p>
              <p className="font-semibold text-gray-800 mt-1">{user?.email || 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Security & Password</h3>
            <p className="text-xs text-gray-500">Update your account password</p>
          </div>
        </div>

        {passMessage.text && (
          <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 border ${
            passMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {passMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{passMessage.text}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passLoading}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition shadow-md disabled:opacity-50"
          >
            {passLoading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Logout Action */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="font-bold text-gray-800 text-sm">Sign Out</p>
          <p className="text-xs text-gray-500">Log out of your account on this device</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )
}