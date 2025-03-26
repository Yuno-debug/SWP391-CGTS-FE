import React, { useState, useEffect } from "react";
import "./MembershipPage.css";
import Navbar from "../../HomePage/NavBar/NavBar";
import Footer from "../../HomePage/Footer/Footer";
import PaymentModal from "../PaymentPage/PaymentModal";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

// Hàm để lấy màu không trùng lặp
const getUniqueGradient = (usedColors) => {
  const colors = [
    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Xanh đậm (Basic)
    "linear-gradient(135deg, #4b134f 0%, #8a2be2 100%)", // Tím đậm (Standard)
    "linear-gradient(135deg, #c33764 0%, #1d2671 100%)", // Hồng đậm - Xanh (Premium)
  ];

  const availableColors = colors.filter((color) => !usedColors.includes(color));

  if (availableColors.length === 0) {
    usedColors.length = 0;
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
  usedColors.push(newColor);
  return newColor;
};

const MembershipPage = ({ isLoggedIn }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/MembershipPackage`)
      .then((response) => response.json())
      .then((data) => {
        if (data.$values) {
          const usedColors = [];
          setPackages(data.$values.map((pkg) => ({ ...pkg, bgColor: getUniqueGradient(usedColors) })));
        } else {
          setPackages([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi tải gói membership:", error);
        setLoading(false);
      });
  }, []);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="membership-page-wrapper">
        <div className="membership-page-container">
          <div className="membership-page-content">
            <h1 className="membership-page-title">Membership Plans</h1>
            {loading ? (
              <p>⏳ Đang tải gói membership...</p>
            ) : (
              <div className="membership-page-plans">
                {packages.length > 0 ? (
                  packages
                    .filter((pkg) => pkg.status === "Active")
                    .map((pkg, index) => {
                      const duration = pkg.durationMonths || 1;
                      const durationText = `${duration} month${duration > 1 ? "s" : ""}`;
                      return (
                        <div
                          key={pkg.packageId}
                          className={`membership-plan-card ${
                            pkg.packageName.toLowerCase() === "premium" ? "membership-premium-card" : ""
                          }`}
                          style={{ background: pkg.bgColor }}
                          onClick={() => handlePackageClick(pkg)}
                          role="button"
                          tabIndex={0}
                        >
                          {pkg.packageName.toLowerCase() === "vvip" && (
                            <span className="membership-most-popular-badge">Most Popular</span>
                          )}
                          <h2 className="membership-plan-title">{pkg.packageName}</h2>
                          <ul className="membership-plan-features">
                            {pkg.description.split(";").map((feature, idx) => (
                              <li key={idx}>✔ {feature.trim()}</li>
                            ))}
                          </ul>
                          <p className="membership-plan-price">
                            {pkg.price.toLocaleString("en-US")} đ / {durationText}
                          </p>
                        </div>
                      );
                    })
                ) : (
                  <p>🚫 Không có gói membership khả dụng.</p>
                )}
                {/* Add a Child Card */}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && selectedPackage && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            packageInfo={selectedPackage}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default MembershipPage;