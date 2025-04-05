import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return loggedIn ? (
    <div>
      <div className="p-2 bg-gray-100 text-right">
        <button onClick={handleLogout} className="text-sm text-blue-600">Logout</button>
      </div>
      <AppRoutes />
    </div>
  ) : (
    <LoginPage onLogin={() => setLoggedIn(true)} />
  );
}
