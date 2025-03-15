import { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import Transactions from "../transactions/Transactions";
import AssetModal from "./AssetModal";
import LiabilityModal from "./LiabilityModal";

import { Button, Typography, Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AccountBalance, CreditCard } from "@mui/icons-material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import axiosInstance from "../../utils/axiosConfig";

const Dashboard = ({ userName }) => {
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);

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
              <img
                src="/net-worth.png"
                alt="NetWorth Image"
                style={{ height: "50px", width: "50px" }}
              ></img>
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
            <TrendingUpIcon
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
            <TrendingDownIcon
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
            <div style={{ width: "100%", height: 300 }}>
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
                  Chart not available.
                </Typography>
              </div>
            </div>
          </div>
          <div className={styles.chart}>
            <Typography
              variant="h6"
              sx={{ color: "var(--text-color)", mb: 2, fontWeight: "600" }}
            >
              Expenses by Category
            </Typography>
            <div style={{ width: "100%", height: 300 }}>
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
                  Chart not available.
                </Typography>
              </div>
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
