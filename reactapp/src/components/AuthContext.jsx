// import React, { createContext, useContext, useState, useEffect } from 'react';

// const API_BASE_URL = "https://8080-decfdcefcbbdabaefbaffffbedebcbbdfdfdbabeba.premiumproject.examly.io";

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       const userData = JSON.parse(localStorage.getItem('userData'));
//       if (userData) {
//         setCurrentUser(userData);
//       }
//     }
//     setLoading(false);
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Extract user data from response (assuming backend returns user info)
//         const userData = {
//           id: data.user?.id || data.id,
//           email: data.user?.email || email,
//           firstName: data.user?.firstName || data.firstName,
//           lastName: data.user?.lastName || data.lastName,
//           createdAt: data.user?.createdAt || new Date().toISOString()
//         };
        
//         setCurrentUser(userData);
//         setToken(data.token);
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userData', JSON.stringify(userData));
//         return { success: true };
//       } else {
//         return { success: false, error: data.error || 'Login failed' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Network error' };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Extract user data from response
//         const user = {
//           id: data.user?.id || data.id,
//           email: userData.email,
//           firstName: userData.firstName,
//           lastName: userData.lastName,
//           createdAt: data.user?.createdAt || new Date().toISOString()
//         };
        
//         setCurrentUser(user);
//         setToken(data.token);
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('userData', JSON.stringify(user));
//         return { success: true };
//       } else {
//         return { success: false, error: data.error || 'Registration failed' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Network error' };
//     }
//   };

//   const logout = () => {
//     setCurrentUser(null);
//     setToken(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('userData');
//   };

//   const updateProfile = async (updatedData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/profile`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(updatedData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Update user data in state and localStorage
//         const updatedUser = { ...currentUser, ...updatedData };
//         setCurrentUser(updatedUser);
//         localStorage.setItem('userData', JSON.stringify(updatedUser));
//         return { success: true };
//       } else {
//         return { success: false, error: data.error || 'Profile update failed' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Network error' };
//     }
//   };

//   const changePassword = async (currentPassword, newPassword) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         return { success: true };
//       } else {
//         return { success: false, error: data.error || 'Password change failed' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Network error' };
//     }
//   };

//   const value = {
//     currentUser,
//     token,
//     login,
//     register,
//     logout,
//     updateProfile,
//     changePassword
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = "https://8080-decfdcefcbbdabaefbaffffbedebcbbdfdfdbabeba.premiumproject.examly.io";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setCurrentUser(userData);
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          id: data.user?.id || data.id,
          email: data.user?.email || email,
          firstName: data.user?.firstName || data.firstName,
          lastName: data.user?.lastName || data.lastName,
          role: data.user?.role || role,
          createdAt: data.user?.createdAt || new Date().toISOString()
        };
        
        setCurrentUser(userData);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const user = {
          id: data.user?.id || data.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          createdAt: data.user?.createdAt || new Date().toISOString()
        };
        
        setCurrentUser(user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...currentUser, ...updatedData };
        setCurrentUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Profile update failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    currentUser,
    token,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};