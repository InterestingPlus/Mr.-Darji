import logo from "./logo.svg";
import "./App.css";

import LandingPage from "./main/LandingPage";
import ShopProfile from "./main/ShopProfile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Invoice from "./main/Invoice";
import NotFound from "./main/NotFound";

import Privacy from "./main/Privacy";
import Contact from "./main/Contact";
import About from "./main/About";

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

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
