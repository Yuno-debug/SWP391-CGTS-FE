import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import PaymentModal from "../PaymentPage/PaymentModal";
import "./MembershipPage.css";
import MainLayout4Mem from "./MainLayout4Mem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

// Hàm để lấy màu không trùng lặp
const getUniqueGradient = (usedColors) => {
  const colors = [
    "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)", // Đỏ - Vàng
    "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)", // Cam - Hồng đậm
    "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)", // Hồng - Xanh dương
    "linear-gradient(135deg, #24c6dc 0%, #514a9d 100%)", // Xanh biển - Tím
    "linear-gradient(135deg, #ff0084 0%, #33001b 100%)", // Hồng neon - Đỏ đậm
    "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)", // Hồng đậm - Đỏ cam
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

const MembershipPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

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
    <MainLayout4Mem hideBody={true}>
      <div className="membership-page">
        <div className="membership-container">
          <div className="membership-content">
            <h1 className="membership-title">Membership Plans</h1>
            {loading ? (
              <p className="loading-text">⏳ Loading membership packages...</p>
            ) : (
              <div className="membership-plans">
                {packages.length > 0 ? (
                  packages.filter((pkg) => pkg.status === "Active").map((pkg) => (
                    <div
                      key={pkg.packageId}
                      className="plan-card"
                      style={{ background: pkg.bgColor }}
                      onClick={() => handlePackageClick(pkg)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="plan-card-header">
                        <FontAwesomeIcon icon={faCrown} className="plan-icon" />
                        <h2 className="plan-title">{pkg.packageName.toUpperCase()}</h2>
                      </div>
                      <div className="plan-card-body">
                        <p className="plan-price">{pkg.price.toLocaleString("en-US")} VND</p>
                        <p className="plan-description">{pkg.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-packages-text">🚫 No membership packages available.</p>
                )}
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
    </MainLayout4Mem>
  );
};

export default MembershipPage;