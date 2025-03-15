import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import NavBar from "../navbar/NavBar";
import { ThemeProvider } from "../../context/ThemeContext";

function Home() {
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
  }, [updated]);

  return (
    <ThemeProvider>
      <NavBar userName={userName} setUpdated={setUpdated} />
      <Dashboard userName={userName} />
    </ThemeProvider>
  );
}

export default Home;
