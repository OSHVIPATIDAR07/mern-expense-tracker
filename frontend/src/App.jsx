import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Profile from "./pages/ProfilePage";
import Login from './components/Login';
import Signup from './components/Signup';

const API_BASE = "http://localhost:4000/api";

// Helper function to fetch saved local transactions
const getTransactionFromStorage = () => {
  const saved = localStorage.getItem('transactions');
  return saved ? JSON.parse(saved) : [];
};

// Protected Route Component Wrapper [03:01:21]
const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem('token');
  const sessionToken = sessionStorage.getItem('token');
  const hasToken = localToken || sessionToken;

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Auto Scroll To Top Component on Route Change [03:02:36]
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  return null;
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to clear authentication storage [01:28:12]
  const clearAuth = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    } catch (err) {
      console.error("Clear auth error:", err);
    }
    setUser(null);
    setToken(null);
  };

  // Helper function to persist session across reloads [02:29:40]
  const persistAuth = (userData, tokenFromAPI, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    if (tokenFromAPI) {
      storage.setItem('token', tokenFromAPI);
      setToken(tokenFromAPI);
    }
    if (userData) {
      storage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const handleLogin = (userData, tokenFromAPI, remember = false) => {
    persistAuth(userData, tokenFromAPI, remember);
  };

  const handleSignup = (userData, tokenFromAPI, remember = false) => {
    persistAuth(userData, tokenFromAPI, remember);
  };

  const handleLogout = () => {
    clearAuth();
  };

  // Update user state across storage [03:03:59]
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    const localToken = localStorage.getItem('token');
    const sessionToken = sessionStorage.getItem('token');

    if (localToken) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else if (sessionToken) {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Bootstrap authentication state on mount [03:05:11]
  useEffect(() => {
    const loadUserAndToken = async () => {
      try {
        const localUserRaw = localStorage.getItem('user');
        const sessionUserRaw = sessionStorage.getItem('user');
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');

        const storedUser = localUserRaw 
          ? JSON.parse(localUserRaw) 
          : sessionUserRaw ? JSON.parse(sessionUserRaw) : null;
        
        const storeToken = localToken || sessionToken || null;

        if (storedUser) {
          setUser(storedUser);
          setToken(storeToken);
          setIsLoading(false);
          return;
        }

        if (storeToken) {
          const response = await axios.get(`${API_BASE}/user/me`, {
            headers: {
              Authorization: `Bearer ${storeToken}`
            }
          });
          const profile = response.data?.data || response.data;
          persistAuth(profile, storeToken, !!localToken);
        }
      } catch (fetchError) {
        console.warn("Could not fetch profile with stored token:", fetchError);
        clearAuth();
      } finally {
        setIsLoading(false);
      }

      try {
        setTransactions(getTransactionFromStorage());
      } catch (textError) {
        console.error("Error loading transactions:", textError);
      }
    };

    loadUserAndToken();
  }, []);

  // Save transactions to LocalStorage when modified [03:09:45]
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (err) {
      console.error("Error saving transactions:", err);
    }
  }, [transactions]);

  const addTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const editTransaction = (id, updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id || tx._id === id ? updatedTx : tx))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((tx) => tx.id !== id && tx._id !== id)
    );
  };

  const refreshTransactions = async () => {
    // Re-fetch logic triggered when a transaction is added/edited/deleted
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Unprotected Auth Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

        {/* Protected Dashboard App Routes [03:11:03] */}
        <Route
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={
              <DashboardPage
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />
          <Route
            path="/income"
            element={
              <Income
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />
          <Route
            path="/expense"
            element={
              <Expense
                transactions={transactions}
                addTransaction={addTransaction}
                editTransaction={editTransaction}
                deleteTransaction={deleteTransaction}
                refreshTransactions={refreshTransactions}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onUpdateProfile={updateUserData}
                onLogout={handleLogout}
              />
            }
          />
        </Route>

        {/* Catch-all Wildcard Route [04:17:46] */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App;