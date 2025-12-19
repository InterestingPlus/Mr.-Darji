import {
  Scissors,
  CheckCircle,
  Smartphone,
  Layout,
  BarChart3,
  Bell,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  AlertCircle,
  Clock,
  TrendingDown,
  MessageSquareOff,
  ExternalLink,
  Receipt,
  Search,
  Share2,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import "./LandingPage.scss";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// Logo
import logo from "../assets/Mr-Darji-.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        {/* Basic SEO */}
        <title>Tailor Management App | Smart Tailoring Business Software</title>
        <meta
          name="description"
          content="Manage customers, measurements, orders, staff, bills and reports with a modern tailor management app. Built for tailors, boutiques and fashion designers."
        />
        <meta
          name="keywords"
          content="tailor app, tailor management software, boutique management, stitching app, tailor billing app"
        />
        <meta name="author" content="Tailor App" />

        {/* Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph (WhatsApp, Facebook) */}
        <meta property="og:title" content="Tailor Management App" />
        <meta
          property="og:description"
          content="Run your tailor shop like a modern business. Orders, measurements, staff & reports in one app."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mr-darji.netlify.app" />
        <meta property="og:image" content="/seo/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tailor Management App" />
        <meta
          name="twitter:description"
          content="A complete management solution for tailors and boutiques."
        />
        <meta name="twitter:image" content="/seo/og-image.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://mr-darji.netlify.app" />
      </Helmet>

      <main className="landing-wrapper">
        {/* 1. HERO SECTION */}
        <section className="hero">
          <div className="max-width">
            <div className="hero-content">
              <div className="brand-logo">
                <div className="icon-box">
                  {/* <Scissors className="icon-amber" size={32} /> */}

                  <img src={logo} alt="Mr. Darji" style={{ width: 40 }} />
                </div>
                <span className="brand-name">Mr. Darji</span>
              </div>

              <h1 className="main-heading">
                Run Your Tailor Shop Like a{" "}
                <span className="text-highlight">Modern Business</span>
              </h1>
              <p className="sub-text">
                Manage customers, measurements, orders, staff, payments, and
                reports — all in one simple app.
              </p>

              <div className="value-bullets">
                <div className="bullet">
                  <CheckCircle size={18} /> No more paper slips
                </div>
                <div className="bullet">
                  <CheckCircle size={18} /> Automatic order tracking & Billing
                </div>
                <div className="bullet">
                  <CheckCircle size={18} /> Smart performance reports
                </div>
              </div>

              <div className="cta-group">
                <button className="btn-primary">
                  Download App <Smartphone size={18} />
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/shops")}
                >
                  View Live Profiles
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="mobile-mockup">
                <div className="screen-content">
                  <div className="skeleton-header" />
                  <div className="skeleton-card" />
                  <div className="skeleton-card" />
                </div>
              </div>
              <div className="glow-effect" />
            </div>
          </div>
        </section>
        {/* 2. TRUST STRIP */}
        <section className="trust-strip">
          <div className="container">
            {/* <span>
            <ShieldCheck size={18} /> Designed for Indian Tailors
          </span> */}
            <span>
              <Globe size={18} /> Secure & Cloud-Based
            </span>
            {/* <span>
            <Zap size={18} /> Works Online & Offline
          </span> */}
            <span>
              <BarChart3 size={18} /> Future-Ready Analytics
            </span>
          </div>
        </section>
        {/* 3. PROBLEM SECTION - Refined */}
        <section className="problem-section">
          <div className="container">
            <div className="section-header">
              <span className="label-red">THE REALITY</span>
              <h2>Old Methods are Costing You Money</h2>
              <p>
                Traditional bookkeeping is slow, prone to errors, and keeps you
                away from growing your boutique.
              </p>
            </div>

            <div className="problem-grid">
              <div className="problem-card">
                <div className="p-icon">
                  <AlertCircle />
                </div>
                <div className="p-content">
                  <h4>Lost Measurements</h4>
                  <p>
                    Paper slips get lost or damaged. Digital storage ensures you
                    never lose a customer's fit.
                  </p>
                </div>
              </div>

              <div className="problem-card">
                <div className="p-icon">
                  <Clock />
                </div>
                <div className="p-content">
                  <h4>Delivery Delays</h4>
                  <p>
                    Missing dates ruins trust. Get automated alerts for cutting,
                    stitching, and trial dates.
                  </p>
                </div>
              </div>

              <div className="problem-card">
                <div className="p-icon">
                  <TrendingDown />
                </div>
                <div className="p-content">
                  <h4>Hidden Income</h4>
                  <p>
                    No idea of monthly profits? Track every penny from advance
                    payments to final bills.
                  </p>
                </div>
              </div>

              <div className="problem-card">
                <div className="p-icon">
                  <MessageSquareOff />
                </div>
                <div className="p-content">
                  <h4>Communication Gaps</h4>
                  <p>
                    No more manual calls. Notify customers instantly when their
                    dress is ready for trial.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 4. SOLUTION GRID */}
        <section className="solution-section">
          <div className="container text-center">
            <span className="label-amber">THE SOLUTION</span>
            <h3>One App. Complete Control.</h3>

            <div className="grid-features">
              <div className="feature-card">
                <Users className="f-icon" />
                <h4>Customer CRM</h4>
                <p>Store measurements and history forever.</p>
              </div>
              <div className="feature-card">
                <Layout className="f-icon" />
                <h4>Order Tracking</h4>
                <p>Cutting to Stitching to Ready status.</p>
              </div>
              <div className="feature-card">
                <Bell className="f-icon" />
                <h4>Smart Alerts</h4>
                <p>Automated Pickup notifications.</p>
              </div>
              <div className="feature-card">
                <BarChart3 className="f-icon" />
                <h4>Business Analytics</h4>
                <p>Analyze sales and staff performance.</p>
              </div>
            </div>
          </div>
        </section>
        {/* 7. PUBLIC PROFILE */}
        <section className="shop-profile-section">
          <div className="container flex-layout">
            {/* TEXT CONTENT SIDE */}
            <div className="content-side">
              <div className="badge-wrapper">
                <Globe size={16} />
                <span>Digital Presence</span>
              </div>
              <h2>
                Get Your Shop a{" "}
                <span className="highlight">Digital Identity</span>
              </h2>
              <p className="description">
                Don't just stay local. Mr. Darji gives your boutique a
                professional web presence that helps you win trust and attract
                new customers automatically.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="f-icon-small">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h4>Shareable Shop Link</h4>
                    <p>
                      Send your professional portfolio link via WhatsApp or
                      Instagram.
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="f-icon-small">
                    <Search size={20} />
                  </div>
                  <div>
                    <h4>Google Searchable Profile</h4>
                    <p>
                      Verified shops appear in local search results when
                      customers look for tailors.
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="f-icon-small">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h4>Online Bill Access</h4>
                    <p>
                      Customers can view their measurements and download
                      receipts 24/7 online.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE PREVIEW CARD SIDE */}
            <div className="preview-side">
              <div className="browser-mockup">
                <div className="browser-header">
                  <div className="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="address-bar">mrdarji.com/royal-boutique</div>
                </div>

                <div className="profile-card-mockup">
                  <div className="shop-banner"></div>
                  <div className="shop-details">
                    <div className="shop-logo">RB</div>
                    <div className="title-row">
                      <h3>Royal Boutique</h3>
                      <div className="verified-badge">
                        <ShieldCheck size={14} /> Verified
                      </div>
                    </div>
                    <p className="location">MG Road, Ahmedabad</p>

                    <div className="stats-row">
                      <div className="stat">
                        <strong>450+</strong>
                        <span>Orders</span>
                      </div>
                      <div className="stat">
                        <strong>4.9/5</strong>
                        <span>Rating</span>
                      </div>
                    </div>

                    <div className="action-buttons">
                      <div className="btn-dummy-primary">View Portfolio</div>
                      <div className="btn-dummy-outline">Check My Bill</div>
                    </div>
                  </div>

                  <div className="floating-tag">
                    <ExternalLink size={14} /> Live Now
                  </div>
                </div>
              </div>
              <div className="decorative-glow"></div>
            </div>
          </div>
        </section>
        {/* 10. FINAL CTA SECTION */}
        <section className="final-cta">
          <div className="container">
            <div className="cta-card">
              <div className="cta-content">
                <span className="pre-title">Ready to Transform?</span>
                <h2>Start Managing Your Tailor Shop the Smart Way</h2>
                <p>
                  Join hundreds of modern boutiques using Mr. Darji to scale
                  their business and delight customers.
                </p>

                <div className="cta-buttons">
                  <button className="btn-primary-large">
                    Download the App <Smartphone size={20} />
                  </button>
                  <button className="btn-secondary-large">
                    View Sample Shop Profile <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              {/* Decorative background element for the card */}
              <div className="cta-decoration">
                <Scissors size={200} className="bg-icon" />
              </div>
            </div>
          </div>
        </section>
        {/* 11. FOOTER SECTION */}
        <footer className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Brand Info */}
              <div className="footer-col brand-info">
                <div className="footer-logo">
                  <img src={logo} alt="Mr. Darji" style={{ width: 40 }} />

                  <span>Mr. Darji</span>
                </div>
                <p className="footer-desc">
                  The all-in-one management suite designed specifically for
                  Indian tailors and boutique owners. Precision, efficiency, and
                  growth in one app.
                </p>
                <div className="social-links">
                  <a href="#">
                    <Instagram size={20} />
                  </a>
                  <a href="#">
                    <Twitter size={20} />
                  </a>
                  <a href="#">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              {/* Product Links */}
              <div className="footer-col">
                <h4>Product</h4>
                <ul>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#how-it-works">How it Works</a>
                  </li>
                  <li>
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li>
                    <a href="#profiles">Shop Profiles</a>
                  </li>
                </ul>
              </div>

              {/* Legal Links */}
              <div className="footer-col">
                <h4>Legal</h4>
                <ul>
                  <li>
                    <a href="#privacy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#terms">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#security">Data Security</a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="footer-col">
                <h4>Contact</h4>
                <div className="contact-item">
                  <Mail size={16} />
                  <a href="mailto:hello@mrdarji.com">mr.darjitech@gmail.com</a>
                </div>
                <p className="support-text">Response within 24 hours.</p>
              </div>
            </div>

            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Mr. Darji. Built for the modern
                tailor.
              </p>
              <div className="footer-meta">
                <span>Made with Precision in India</span>
              </div>
              <div className="footer-meta">
                <span>
                  Developed by{" "}
                  <a
                    href="https://jatinporiya.epizy.com"
                    style={{ color: "#FBBF24" }}
                  >
                    Jatin Poriya
                  </a>
                </span>
              </div>
            </div>
          </div>
        </footer>{" "}
      </main>
    </>
  );
};

export default LandingPage;
