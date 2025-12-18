import React, { useState, useEffect } from "react";
import {
  Download,
  Share2,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import "./Invoice.scss";
import { useParams } from "react-router-dom";

const Invoice = () => {
  const { order_id } = useParams();

  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock API Call - Replace with your fetch(`/api/public/bill/${billId}`)
  useEffect(() => {
    setTimeout(() => {
      setBillData({
        billId: "BILL-2025-000123",
        billDate: "2025-09-12",
        dueDate: "2025-09-20",
        shop: {
          name: "Ramesh Tailors",
          address: "Main Bazaar, Rajula, Gujarat",
          phone: "+91 98765 43210",
          email: "ramesh@tailors.com",
          gstNumber: "24ABCDE1234F1Z5",
          logoUrl: "https://via.placeholder.com/150x150?text=Logo",
        },
        customer: {
          name: "Suresh Patel",
          phone: "+91 91234 56789",
          address: "Near Bus Stand, Rajula",
        },
        items: [
          { name: "Shirt Stitching", quantity: 2, unitPrice: 450, total: 900 },
          { name: "Pant Stitching", quantity: 1, unitPrice: 700, total: 700 },
        ],
        summary: {
          subTotal: 1600,
          discount: 100,
          tax: 90,
          grandTotal: 1590,
        },
        payment: {
          method: "UPI",
          status: "UNPAID", // or "UNPAID"
          paidOn: "2025-09-12",
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="loader">Loading Invoice...</div>;
  if (!billData) return <div className="error">Bill Not Found</div>;

  return (
    <div className="invoice-wrapper">
      {/* 🛠️ Action Bar (Hidden during Print) */}
      <div className="action-bar no-print">
        <button onClick={handlePrint} className="btn-download">
          <Download size={18} /> Download PDF
        </button>
        <button className="btn-share">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="invoice-card" id="invoice-content">
        {/* 🔹 Header Section */}
        <header className="invoice-header">
          <div className="shop-brand">
            <img src={billData.shop.logoUrl} alt="logo" className="logo" />
            <div className="shop-details">
              <h1>{billData.shop.name}</h1>
              <p>
                <MapPin size={12} /> {billData.shop.address}
              </p>
              <p>
                <Phone size={12} /> {billData.shop.phone} | <Mail size={12} />{" "}
                {billData.shop.email}
              </p>
              {billData.shop.gstNumber && (
                <p className="gst">GST: {billData.shop.gstNumber}</p>
              )}
            </div>
          </div>
          <div className="invoice-label">
            <h2>INVOICE</h2>
            <div
              className={`status-badge ${billData.payment.status.toLowerCase()}`}
            >
              {billData.payment.status === "PAID" ? (
                <CheckCircle size={14} />
              ) : (
                <Clock size={14} />
              )}
              {billData.payment.status}
            </div>
          </div>
        </header>

        {/* 🔹 Bill Meta Info */}
        <section className="bill-meta">
          <div className="meta-group">
            <label>Bill ID</label>
            <p className="val">{billData.billId}</p>
            <label>Bill Date</label>
            <p className="val">{billData.billDate}</p>
          </div>
          <div className="meta-group text-right">
            <label>Payment Method</label>
            <p className="val">{billData.payment.method}</p>
            <label>Due Date</label>
            <p className="val">{billData.dueDate}</p>
          </div>
        </section>

        {/* 🔹 Customer Details */}
        <section className="customer-box">
          <h3>Bill To:</h3>
          <p className="cust-name">{billData.customer.name}</p>
          <p>{billData.customer.phone}</p>
          <p>{billData.customer.address}</p>
        </section>

        {/* 🔹 Items Table */}
        <div className="table-responsive">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {billData.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice}</td>
                  <td className="text-right">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Summary Section */}
        <section className="invoice-footer">
          <div className="notes">
            <p className="note-title">Notes:</p>
            <p>
              Thank you for your business! Please keep this copy for your
              records.
            </p>
          </div>
          <div className="summary-table">
            <div className="summary-row">
              <span>Sub Total</span>
              <span>₹{billData.summary.subTotal}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="text-red">- ₹{billData.summary.discount}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>+ ₹{billData.summary.tax}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span>₹{billData.summary.grandTotal}</span>
            </div>
          </div>
        </section>

        <footer className="footer-bottom">
          <p>
            This is a computer generated bill and does not require a physical
            signature.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Invoice;
