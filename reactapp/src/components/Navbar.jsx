// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import "./Navbar.css";

// function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { currentUser, logout } = useAuth();

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const getDashboardPath = () => {
//     if (!currentUser) return "/";
//     if (currentUser.role === "DEVELOPER") return "/developer-dashboard";
//     if (currentUser.role === "TESTER") return "/tester-dashboard";
//     return "/view";
//   };

//   const getRoleDisplayName = () => {
//     if (!currentUser) return "";
//     if (currentUser.role === "DEVELOPER") return "Developer";
//     if (currentUser.role === "TESTER") return "Tester";
//     return "User";
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         <Link to={getDashboardPath()} className="navbar-logo">
//           <span className="logo-icon">🐞</span>
//           Bug Analyzer
//         </Link>
        
//         <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
//           {currentUser ? (
//             <>
//               <Link 
//                 to={getDashboardPath()} 
//                 className={location.pathname === getDashboardPath() ? "nav-link active" : "nav-link"}
//               >
//                 Dashboard
//               </Link>
//               <Link 
//                 to="/view" 
//                 className={location.pathname === "/view" ? "nav-link active" : "nav-link"}
//               >
//                 View Bugs
//               </Link>
//               <Link 
//                 to="/add" 
//                 className={location.pathname === "/add" ? "nav-link active" : "nav-link"}
//               >
//                 Add Bug
//               </Link>
//               <Link 
//                 to="/profile" 
//                 className={location.pathname === "/profile" ? "nav-link active" : "nav-link"}
//               >
//                 Profile
//               </Link>
//               <div className="user-info">
//                 <span className="user-role">{getRoleDisplayName()}</span>
//                 <button className="nav-link logout-btn" onClick={handleLogout}>
//                   Logout ({currentUser.email})
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <Link 
//                 to="/login" 
//                 className={location.pathname === "/login" ? "nav-link active" : "nav-link"}
//               >
//                 Login
//               </Link>
//               <Link 
//                 to="/register" 
//                 className={location.pathname === "/register" ? "nav-link active" : "nav-link"}
//               >
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
        
//         <button className="menu-toggle" onClick={toggleMenu}>
//           <span></span>
//           <span></span>
//           <span></span>
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    if (currentUser.role === "DEVELOPER") return "/developer-dashboard";
    if (currentUser.role === "TESTER") return "/tester-dashboard";
    return "/";
  };

  const getRoleDisplayName = () => {
    if (!currentUser) return "";
    if (currentUser.role === "DEVELOPER") return "Developer";
    if (currentUser.role === "TESTER") return "Tester";
    return "User";
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to={getDashboardPath()} className="navbar-logo">
          <span className="logo-icon">🐞</span>
          Bug Analyzer
        </Link>
        
        <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          {currentUser ? (
            <>
              <Link 
                to={getDashboardPath()} 
                className={isActiveLink(getDashboardPath()) || 
                          (getDashboardPath() === "/" && location.pathname === "/") ? "nav-link active" : "nav-link"}
              >
                Dashboard
              </Link>
              <Link 
                to="/view" 
                className={isActiveLink("/view") ? "nav-link active" : "nav-link"}
              >
                View Bugs
              </Link>
              <Link 
                to="/add" 
                className={isActiveLink("/add") ? "nav-link active" : "nav-link"}
              >
                Add Bug
              </Link>
              
              {/* Profile Dropdown */}
              <div className="profile-dropdown" ref={dropdownRef}>
                <button className="profile-icon-btn" onClick={toggleProfileDropdown}>
                  <span className="profile-icon">👤</span>
                  <span className="user-email">{currentUser.email}</span>
                  <span className={`dropdown-arrow ${isProfileDropdownOpen ? "open" : ""}`}>▼</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <span className="user-name">{currentUser.email}</span>
                      <span className={`user-role role-${getRoleDisplayName().toLowerCase()}`}>
                        {getRoleDisplayName()}
                      </span>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">👤</span>
                      Profile
                    </Link>
                    
                    <Link 
                      to="/notifications" 
                      className="dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <span className="dropdown-icon">🔔</span>
                      Notifications
                      <span className="notification-count">3</span>
                    </Link>
                    
                    <hr className="dropdown-divider" />
                    
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <span className="dropdown-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={isActiveLink("/login") ? "nav-link active" : "nav-link"}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={isActiveLink("/register") ? "nav-link active" : "nav-link"}
              >
                Register
              </Link>
            </>
          )}
        </div>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;