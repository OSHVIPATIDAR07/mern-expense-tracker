import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, User, LogOut } from 'lucide-react';

import { navbarStyles } from '../assets/dummyStyles';
import logoImg from '../assets/logo.png';

const BASE_URL = "http://localhost:4000/api";

const Navbar = ({ user: propUser, onLogout }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Fetch user profile data from backend
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userData = response.data?.data || response.data;
      setUser(userData);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  useEffect(() => {
    if (!propUser) {
      fetchUserData();
    } else {
      setUser(propUser);
    }
  }, [propUser]);

  // Handle outside click to close dropdown menu [01:43:11]
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const name = user?.name || '';
  const email = user?.email || 'user@expensa.com';
  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        
        {/* Logo Container */}
        <div className={navbarStyles.logoContainer} onClick={() => navigate('/')}>
          <div className={navbarStyles.logoImage}>
            <img src={logoImg} alt="logo" />
          </div>
          <span className={navbarStyles.logoText}>Expense Tracker</span>
        </div>

        {/* User Profile / Dropdown Section */}
        {user && (
          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button className={navbarStyles.userButton} onClick={toggleMenu}>
              <div className="relative">
                <div className={navbarStyles.userAvatar}>
                  {initial}
                </div>
                <div className={navbarStyles.statusIndicator} />
              </div>

              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.username}>{name || 'User'}</p>
                <p className={navbarStyles.userEmail}>{email}</p>
              </div>

              <ChevronDown 
                className={`${navbarStyles.chevronIcon} ${menuOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className={navbarStyles.dropdownMenu}>
                <div className={navbarStyles.dropdownHeader}>
                  <div className="flex items-center gap-3">
                    <div className={navbarStyles.dropdownAvatar}>
                      {initial}
                    </div>
                    <div>
                      <div className={navbarStyles.dropdownName}>{name || 'User'}</div>
                      <div className={navbarStyles.dropdownEmail}>{email}</div>
                    </div>
                  </div>
                </div>

                <div className={navbarStyles.menuItemContainer}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                    className={navbarStyles.menuItem}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>

                  <div className={navbarStyles.mobileItemBorder}>
                    <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;