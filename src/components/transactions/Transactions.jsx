import { useState, useEffect } from "react";
import styles from "./Transactions.module.css";
import TransactionModal from "./TransactionModal";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosConfig";
import { IconButton } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
const Transactions = ({
  setTotalIncome,
  setTotalExpenses,
  // setMonthlyData,
  // setExpensesByCategory,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const calculateTransactions = (transactions) => {
    const totalIncome = transactions
      .filter((t) => t.transaction_type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalIncome(totalIncome);

    const totalExpenses = transactions
      .filter((t) => t.transaction_type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    setTotalExpenses(totalExpenses);
    // Calculate monthly data
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });
      const existingMonth = acc.find((m) => m.month === month);

      if (existingMonth) {
        if (t.transaction_type === "income") existingMonth.income += t.amount;
        else existingMonth.expenses += t.amount;
      } else {
        acc.push({
          month,
          income: t.transaction_type === "income" ? t.amount : 0,
          expenses: t.transaction_type === "expense" ? t.amount : 0,
        });
      }
      return acc;
    }, []);



    // setMonthlyData(monthlyData);

    // Calculate expenses by category
    const expensesByCategory = transactions
      .filter((t) => t.transaction_type === "expense")
      .reduce((acc, t) => {
        const existingCategory = acc.find(
          (c) => c.category === t.transaction_category
        );
        if (existingCategory) {
          existingCategory.amount += t.amount;
        } else {
          acc.push({ category: t.transaction_category, amount: t.amount });
        }
        return acc;
      }, []);

    // setExpensesByCategory(expensesByCategory);
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosInstance.get("/transactions/");
      setTransactions(data);
      calculateTransactions(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      await axiosInstance.post("/transactions/", formData);
      await fetchTransactions();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error:", err);
    } finally {
    }
  };

  const handleDeleteClick = (transactionId) => {
    setSelectedTransaction(transactionId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      await handleDelete(selectedTransaction);
      setShowDeleteDialog(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <div className={styles.container}>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <div className={styles.transactionList}>
        <div className={styles.transactionTopContainer}>
          <h2 className={styles.recentTransactionsText}>Recent Transactions</h2>
          <IconButton
            onClick={() => setIsModalOpen(true)}
            variant="contained"
            // startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              m: 0,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#007bff",
              },
              gap: "0.5rem",
            }}
          >
            <AddIcon />
            <Typography
              className={styles.addTransactionText}
              sx={{ fontSize: "0.875rem" }}
            >
              Add New Transaction
            </Typography>
          </IconButton>
        </div>
        <div className={styles.transactionHeader}>
          <div className={styles.headerDate}>Date</div>
          <div className={styles.headerDescription}>Description</div>
          <div className={styles.headerType}>Type</div>
          <div className={styles.headerCategory}>Category</div>
          <div className={styles.headerAmount}>Amount</div>
          <div className={styles.headerActions}>Actions</div>
        </div>
        {transactions.slice(-5).map((transaction) => (
          <div
            key={transaction.id}
            className={`${styles.transaction} ${
              styles[transaction.transaction_type]
            }`}
          >
            <div className={styles.transactionDate}>
              {new Date(transaction.date).toLocaleDateString()}
            </div>
            <div className={styles.transactionDescription}>
              {transaction.description}
            </div>
            <div className={styles.transactionType}>
              {transaction.transaction_type.charAt(0).toUpperCase() +
                transaction.transaction_type.slice(1)}
            </div>
            <div className={styles.transactionCategory}>
              {transaction.transaction_category}
            </div>
            <div className={styles.transactionAmount}>
              {transaction.amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className={styles.transactionActions}>
              <Tooltip title="Remove transaction">
                <IconButton
                  onClick={() => handleDeleteClick(transaction.id)}
                  aria-label="delete"
                >
                  <DeleteIcon
                    sx={{ color: "var(--text-color)", cursor: "pointer" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
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
            padding: "8px",
            gap: "3px",
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
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ padding: "16px 24px" }}>
          <DialogContentText sx={{ color: "var(--text-color)" }}>
            Are you sure you want to delete this transaction?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setShowDeleteDialog(false)}
            sx={{
              textTransform: "none",
              backgroundColor: "#d2d2d2",
              color: "#4a4a4a",
              border: "none",
              m: 0,
              mr: 1,
              "&:hover": {
                backgroundColor: "#c2c2c2",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              m: 0,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transactions;
