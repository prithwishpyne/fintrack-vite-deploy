import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import styles from "./TransactionModal.module.css";

const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};

const CATEGORIES = {
  [TRANSACTION_TYPES.INCOME]: [
    "Salary",
    "Bonus",
    "Rental",
    "Freelance",
    "Investment",
    "Other",
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    "Rent",
    "Food",
    "Utilities",
    "Transport",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Other",
  ],
};

const TransactionModal = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = React.useState(TRANSACTION_TYPES.EXPENSE);
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    onSubmit({
      transaction_type: type,
      transaction_category: category,
      amount: parseInt(amount, 10),
      description,
      date,
    });
    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  if (!isOpen) return null;

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
          width: 400,
          bgcolor: "var(--card-bg)",
          boxShadow: 10,
          p: 5,
          borderRadius: 2,
          color: "var(--text-color)",
          border: "1px solid var(--border-color)",
        }}
        className={styles.modalContent}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Typography sx={{ fontSize: "22px", fontWeight: "600" }}>
            Add Transaction
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
        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <TextField
            select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--border-color)",
                },
              },
              "& .MuiSelect-select": {
                color: "var(--text-color)",
              },
            }}
          >
            <MenuItem value={TRANSACTION_TYPES.EXPENSE}>Expense</MenuItem>
            <MenuItem value={TRANSACTION_TYPES.INCOME}>Income</MenuItem>
          </TextField>

          <TextField
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{
              style: {
                color: "var(--text-color)",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--border-color)",
                },
              },
            }}
            // inputProps={{ min: 0, step: 1 }}
          />

          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            margin="normal"
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--border-color)",
                },
              },
              "& .MuiSelect-select": {
                color: "var(--text-color)",
              },
            }}
          >
            <MenuItem value="">Select a category</MenuItem>
            {CATEGORIES[type].map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
            inputProps={{
              style: {
                color: "var(--text-color)",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--border-color)",
                },
              },
            }}
          />

          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            required
            inputProps={{
              style: {
                color: "var(--text-color)",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--border-color)",
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, textTransform: "none" }}
          >
            Add Transaction
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TransactionModal;
