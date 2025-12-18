import logo from "./logo.svg";
import "./App.css";

import LandingPage from "./main/LandingPage";
import ShopProfile from "./main/ShopProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Invoice from "./main/Invoice";

function App() {
  // Returning Router
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shops" element={<ShopProfile />} />
        <Route path="/shop/:slug" element={<ShopProfile />} />
        <Route path="/bill/:order_id" element={<ShopProfile />} />
        <Route path="/receipt/:order_id" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
