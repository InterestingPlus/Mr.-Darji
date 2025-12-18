import {
  Phone,
  MessageCircle,
  MapPin,
  BadgeCheck,
  Star,
  Clock,
  Instagram,
  Facebook,
} from "lucide-react";

import "./PublicProfile.scss";
import ChatBot from "../components/ChatBot";
import ServiceCard from "../components/ServiceCard";
import { useEffect } from "react";
import BASE_URL from "../config";
import axios from "axios";

import { useParams } from "react-router-dom";
import { useState } from "react";

const mockShopData = {
  name: "Mehra Tailors & Boutique",
  isVerified: true,
  rating: 4.8,
  reviewCount: 156,
  city: "Mumbai",
  area: "Andheri West",
  tagline: "Perfect Stitching for Every Occasion",
  experience: 12,
  about:
    "Specialists in Custom Suits, Sherwanis, and Bridal Wear with over 12 years of craftsmanship.",
  phone: "+919876543210",
  whatsapp: "919876543210",
  address: "Shop 4, MG Road, near Metro Station, Mumbai",
  social: { instagram: "#", facebook: "#" },
  gallery: [
    "https://images.unsplash.com/photo-1594932224828-b4b059bdbf0f",
    "https://images.unsplash.com/photo-1598460390540-3620e495638c",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
  ],
};

const services = [
  {
    id: 1,
    name: "3-Piece Suit",
    price: 4500,
    days: 7,
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1594932224828-b4b059bdbf0f",
  },
  {
    id: 2,
    name: "Designer Blouse",
    price: 850,
    days: 3,
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb",
  },
];

const ShopProfile = () => {
  const { slug } = useParams();
  const [shopData, setShopData] = useState({});

  useEffect(() => {
    async function fetchShopData() {
      try {
        const response = await axios.get(`${BASE_URL}/api/profile/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(response.data);
        const apiData = response.data;
        setShopData(apiData || {});
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    }

    fetchShopData();
  }, []);

  return (
    <div className="profile-container">
      {/* Header / Cover */}
      <header className="profile-header">
        <div className="cover-image">
          <img
            src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d"
            alt="Cover"
          />
        </div>
        <div className="header-content">
          <div className="logo-box">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Logo"
            />
          </div>
          <div className="shop-info">
            <div className="title-row">
              <h1>{shopData?.name}</h1>
              {/* {shopData?.isVerified && <BadgeCheck className="verified-icon" />} */}
              <BadgeCheck className="verified-icon" />
            </div>
            <p className="meta-info">
              <Star className="star-icon" />
              {shopData?.rating} ({shopData?.reviewCount} Reviews) •{" "}
              {shopData?.contact?.address?.line1},{" "}
              {shopData?.contact?.address?.city}
            </p>
          </div>
        </div>
      </header>

      {/* Action Buttons */}
      <div className="action-buttons">
        <a href={`tel:${shopData?.phone}`} className="btn btn-call">
          <Phone size={18} /> Call
        </a>
        <a
          href={`https://wa.me/${shopData?.whatsapp}`}
          className="btn btn-whatsapp"
        >
          <MessageCircle size={18} /> WhatsApp
        </a>
        <button className="btn btn-outline">
          <MapPin size={18} /> Directions
        </button>
      </div>

      <main className="profile-main">
        <div className="left-column">
          <section className="card about-section">
            <h2>About Us</h2>
            <p>{shopData?.about?.description}</p>

            {shopData?.about?.experienceYears ? (
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-value">
                    {shopData?.about?.experienceYears}+ Years
                  </span>
                  <span className="stat-label">Experience</span>
                </div>
              </div>
            ) : null}
          </section>

          <section className="services-section">
            <h2 className="section-title">
              Our Services <span>{services?.length}</span>
            </h2>
            <div className="services-grid">
              {services?.map((s) => (
                <ServiceCard
                  key={s.id}
                  service={s}
                  whatsapp={shopData?.whatsapp}
                />
              ))}
            </div>
          </section>

          <section className="gallery-section">
            <h2>Work Gallery</h2>
            <div className="gallery-grid">
              {shopData?.gallery?.map((img, i) => (
                <img key={i} src={img} alt="Work" />
              ))}
            </div>
          </section>
        </div>

        <aside className="right-column">
          <div className="card contact-card">
            <h3>Contact Info</h3>
            <p>
              <MapPin size={20} /> {shopData?.address}
            </p>
            <div className="social-links">
              <a href="#">
                <Instagram />
              </a>
              <a href="#">
                <Facebook />
              </a>
            </div>
          </div>
        </aside>
      </main>

      <ChatBot shopName={shopData.name} />
    </div>
  );
};

export default ShopProfile;
