

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { MerchantDashboardPage } from "./pages/MerchantDashboardPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/merchant" element={<MerchantDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
