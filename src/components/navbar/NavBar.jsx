import React, { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setShowLogoutDialog(false);
  };

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
          onClick={() => setShowLogoutDialog(true)}
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
      <Dialog
        open={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        BackdropProps={{
          style: {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.4)",
          },
        }}
        PaperProps={{
          style: {
            backgroundColor: "var(--card-bg)",
            color: "var(--text-color)",
            border: "1px solid var(--border-color)",
            width: "400px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--text-color)",
            fontWeight: "600",
            fontSize: "22px",
            padding: "16px 24px",
          }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{ padding: "16px 24px" }}>
          <DialogContentText sx={{ color: "var(--text-color)" }}>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            variant="outlined"
            onClick={() => setShowLogoutDialog(false)}
            sx={{
              textTransform: "none",
              backgroundColor: "#d2d2d2",
              color: "#4a4a4a",
              border: "none",
              m: 0,
              mr: 1,
              "&:hover": {
                backgroundColor: "#c2c2c2",
                // opacity: 0.8,
              },
            }}
          >
            Stay Logged In
          </Button>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              m: 0,
              "&:hover": {
                backgroundColor: "#0056b3",
              },
            }}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default NavBar;
