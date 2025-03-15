import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Transactions from "../transactions/Transactions";
import AssetModal from "./AssetModal";
import LiabilityModal from "./LiabilityModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button, Typography, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  AttachMoney,
  MoneyOff,
  AccountBalance,
  CreditCard,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axiosConfig";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF6B6B",
];

const Dashboard = ({ userName }) => {
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState(0);

  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  const fetchAssetsLiabilities = async () => {
    try {
      const { data } = await axiosInstance.get("/assets-liabilities/");

      const totalAssets = data
        .filter((item) => item.type === "Asset")
        .reduce((sum, item) => sum + item.amount, 0);

      const totalLiabilities = data
        .filter((item) => item.type === "Liability")
        .reduce((sum, item) => sum + item.amount, 0);

      setAssets(totalAssets);
      setLiabilities(totalLiabilities);
      setNetWorth(totalAssets - totalLiabilities);
    } catch (error) {
      console.error("Error fetching assets and liabilities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetsLiabilities();
  }, []);

  const handleAssetSubmit = async () => {
    await fetchAssetsLiabilities();
    setShowAssetModal(false);
  };

  const handleLiabilitySubmit = async () => {
    await fetchAssetsLiabilities();
    setShowLiabilityModal(false);
  };

  return (
    <div className={styles.dashboard}>
      {userName && (
        <div className={styles.welcome}>
          <Typography
            sx={{
              color: "var(--text-color)",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Welcome, {userName}
          </Typography>
          <div className={styles.topContainer}>
            <div className={styles.netWorth}>
              Net Worth:{" "}
              {netWorth.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className={styles.topButtonContainer}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowAssetModal(true)}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#28a745",
                  color: "#fff",
                }}
              >
                Add Assets
              </Button>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowLiabilityModal(true)}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  m: 0,
                }}
              >
                Add Liabilities
              </Button>

              <AssetModal
                isOpen={showAssetModal}
                onClose={() => setShowAssetModal(false)}
                onSubmit={handleAssetSubmit}
              />
              <LiabilityModal
                isOpen={showLiabilityModal}
                onClose={() => setShowLiabilityModal(false)}
                onSubmit={handleLiabilitySubmit}
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Total Income</h3>
            <AttachMoney
              sx={{ color: "var(--text-color)", fontSize: "2rem" }}
            />
          </div>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="80%"
              height={40}
              sx={{ mx: "auto" }}
            />
          ) : (
            <p className={styles.amount}>
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Total Expenses</h3>
            <MoneyOff sx={{ color: "var(--text-color)", fontSize: "2rem" }} />
          </div>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="80%"
              height={40}
              sx={{ mx: "auto" }}
            />
          ) : (
            <p className={styles.amount}>
              {totalExpenses.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Total Assets</h3>
            <AccountBalance
              sx={{ color: "var(--text-color)", fontSize: "2rem" }}
            />
          </div>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="80%"
              height={40}
              sx={{ mx: "auto" }}
            />
          ) : (
            <p className={styles.amount}>
              {assets.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
        <div className={styles.card}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Total Liabilities</h3>
            <CreditCard sx={{ color: "var(--text-color)", fontSize: "2rem" }} />
          </div>
          {isLoading ? (
            <Skeleton
              variant="text"
              width="80%"
              height={40}
              sx={{ mx: "auto" }}
            />
          ) : (
            <p className={styles.amount}>
              {liabilities.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>

      <div className={styles.charts}>
        <div className={styles.chartContainer}>
          <div className={styles.chart}>
            <Typography
              variant="h6"
              sx={{ color: "var(--text-color)", mb: 2, fontWeight: "600" }}
            >
              Income vs Expenses
            </Typography>
            <div
              style={{
                width: "100%",
                height: 300,
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ borderRadius: 2 }}
                />
              ) : monthlyData.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#f44336"
                      strokeWidth={2}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                  }}
                >
                  <Typography sx={{ color: "var(--text-color)" }}>
                    No transaction data available to display
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <div className={styles.chart}>
            <Typography
              variant="h6"
              sx={{ color: "var(--text-color)", mb: 2, fontWeight: "600" }}
            >
              Expenses by Category
            </Typography>
            <div
              style={{
                width: "100%",
                height: 300,
              }}
            >
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  sx={{ borderRadius: 2 }}
                />
              ) : expensesByCategory.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="amount"
                      nameKey="category"
                      // cx="50%"
                      // cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      label
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                  }}
                >
                  <Typography sx={{ color: "var(--text-color)" }}>
                    No transaction data available to display
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Transactions
        setTotalIncome={setTotalIncome}
        setTotalExpenses={setTotalExpenses}
        setMonthlyData={setMonthlyData}
        setExpensesByCategory={setExpensesByCategory}
      />
    </div>
  );
};

export default Dashboard;
