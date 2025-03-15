import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./NavBar.module.css";
import ProfileModal from "../profile/ProfileModal";
import { supabase } from "../../supabaseClient";
import { useOutletContext } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import PixIcon from "@mui/icons-material/Pix";

const NavBar = ({ userName, setUpdated }) => {
  const { setIsAuthenticated } = useOutletContext();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNameUpdate = (newName) => {
    localStorage.setItem("userName", newName);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <PixIcon sx={{ fontSize: "24px", color: "var(--text-color)" }} />
        <Typography
          sx={{
            fontSize: "24px",
            color: "var(--text-color)",
            fontWeight: "600",
            ml: 1,
          }}
        >
          FinanceTrack
        </Typography>
      </div>
      <div className={styles.navbarActions}>
        <Button
          onClick={toggleTheme}
          className={styles.themeToggle}
          sx={{
            borderRadius: "50%",
          }}
        >
          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </Button>
        <Button
          onClick={() => setShowProfileModal(true)}
          sx={{
            fontSize: "16px",
            textTransform: "none",
            color: "#fff",
            fontWeight: "500",
          }}
          startIcon={<AccountCircleIcon />}
        >
          <Typography className={styles.profileText}>Profile</Typography>
        </Button>
        <Button
          onClick={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }}
          sx={{
            fontSize: "16px",
            textTransform: "none",
            color: "#fff",
            fontWeight: "500",
          }}
          startIcon={<LogoutIcon />}
        >
          <Typography className={styles.logoutText}>Logout</Typography>
        </Button>
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userName={userName}
        onNameChange={handleNameUpdate}
        setUpdated={setUpdated}
      />
    </nav>
  );
};

export default NavBar;
