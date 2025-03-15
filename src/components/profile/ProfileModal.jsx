import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { Close, Edit } from "@mui/icons-material";
import axiosInstance from "../../utils/axiosConfig";

const ProfileModal = ({
  isOpen,
  onClose,
  userName,
  onNameChange,
  setUpdated,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [storedName, setStoredName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("userName");
    if (nameFromStorage) {
      setEditedName(nameFromStorage);
      setStoredName(nameFromStorage);
    } else if (userName) {
      setEditedName(userName);
      setStoredName(userName);
    }
  }, [userName, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axiosInstance.put("/users/update-name", {
        name: editedName,
      });

      localStorage.setItem("userName", response.data.name);
      setStoredName(response.data.name);
      setIsEditing(false);
      setUpdated((prev) => !prev);

      if (onNameChange) {
        onNameChange(response.data.name);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update name. Please try again."
      );
      console.error("Error updating name:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      BackdropProps={{
        style: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0,0,0,0.4)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "var(--card-bg)",
          color: "var(--text-color)",
          boxShadow: 10,
          p: 3,
          borderRadius: 2,
          border: "1px solid var(--border-color)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "600",
              color: "var(--text-color)",
            }}
          >
            User Details
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              minHeight: 0,
              minWidth: 0,
              padding: 0,
              "&:hover": {
                background: "transparent",
              },
            }}
          >
            <Close />
          </Button>
        </Box>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 1, color: "var(--text-color)", fontWeight: "600" }}
          >
            Full Name -
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditing ? (
              <Box sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  size="small"
                  // sx={{ mb: 1 }}
                  inputProps={{
                    style: {
                      color: "var(--text-color)",
                    },
                  }}
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--border-color)",
                      },
                    },
                  }}
                />
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(storedName);
                      setError("");
                    }}
                    sx={{ textTransform: "none" }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSave}
                    disabled={!editedName.trim() || isLoading}
                    sx={{ textTransform: "none" }}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Typography variant="body1">{editedName}</Typography>
                <Button
                  onClick={() => setIsEditing(true)}
                  sx={{
                    minWidth: 0,
                    padding: 0.5,
                    "&:hover": {
                      background: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Edit fontSize="small" />
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProfileModal;
