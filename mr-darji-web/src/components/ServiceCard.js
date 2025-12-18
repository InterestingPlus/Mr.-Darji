import React from "react";
import { Star, Clock, MessageCircle } from "lucide-react";

const ServiceCard = ({ service, whatsapp }) => {
  const waLink = `https://wa.me/${whatsapp}?text=Hi, I want to inquire about ${service.name}`;

  return (
    <div className="service-card-v2">
      <div className="img-wrap">
        <img src={service.img} alt={service.name} />
        <div className="price-tag">₹{service.price}</div>
      </div>
      <div className="card-body">
        <h3>{service.name}</h3>
        <div className="info-row">
          <span className="rating">
            <Star size={14} fill="#f1c40f" color="#f1c40f" /> {service.rating}
          </span>
          <span className="dot">•</span>
          <span className="time">
            <Clock size={14} /> {service.days} Days
          </span>
        </div>
        <a href={waLink} className="wa-btn">
          <MessageCircle size={16} /> Enquire
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
