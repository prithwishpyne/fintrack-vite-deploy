import React, { useState, useEffect } from "react";
import styles from "./Transactions.module.css";
import TransactionModal from "./TransactionModal";
import { Button, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosConfig";

const Transactions = ({
  onTransactionUpdate,
  setTotalIncome,
  setTotalExpenses,
  setMonthlyData,
  setExpensesByCategory,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

    setMonthlyData(monthlyData);

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

    setExpensesByCategory(expensesByCategory);
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await axiosInstance.get("/transactions/");
      setTransactions(data);
      calculateTransactions(data);
      onTransactionUpdate(data);
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
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              m: 0,
            }}
          >
            <Typography className={styles.addTransactionText}>
              Add New Transaction
            </Typography>
          </Button>
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
                <DeleteIcon
                  fontSize="small"
                  sx={{ color: "var(--text-color)", cursor: "pointer" }}
                  onClick={() => handleDelete(transaction.id)}
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
