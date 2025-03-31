import backgroundImage from "../assets/backgr.png";
import React, { useState, useEffect } from "react";
import "./MembershipPage.css";
import Navbar from "../../HomePage/NavBar/NavBar";
import Footer from "../../HomePage/Footer/Footer";
import PaymentModal from "../PaymentPage/PaymentModal";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

// Hàm để lấy màu gradient không trùng lặp
const getUniqueGradient = (usedColors) => {
  const colors = [
    "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Xanh đậm (Basic)
    "linear-gradient(135deg, #4b134f 0%, #8a2be2 100%)", // Tím đậm (Standard)
    "linear-gradient(135deg, #c33764 0%, #1d2671 100%)", // Hồng đậm - Xanh (Premium)
  ];

  const availableColors = colors.filter((color) => !usedColors.includes(color));

  if (availableColors.length === 0) {
    usedColors.length = 0; // Reset used colors if all are used
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

  // Fetch membership packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${API_URL}/api/MembershipPackage`);
        if (!response.ok) {
          throw new Error("Failed to fetch membership packages");
        }
        const data = await response.json();
        if (data.$values) {
          const usedColors = [];
          setPackages(
            data.$values.map((pkg) => ({
              ...pkg,
              bgColor: getUniqueGradient(usedColors),
            }))
          );
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error("❌ Error fetching membership packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle package selection and open payment modal
  const handlePackageClick = (pkg) => {
    if (pkg.status !== "Active") return; // Prevent clicking on inactive packages
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  // Close payment modal
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div
        className="membership-page-wrapper"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="membership-page-container">
          <div className="membership-page-content">
            <h1 className="membership-page-title">Membership Plans</h1>
            {loading ? (
              <p className="loading-text">⏳ Loading membership plans...</p>
            ) : packages.length === 0 ? (
              <p className="no-plans-text">🚫 No membership plans available at the moment.</p>
            ) : (
              <div className="membership-page-plans">
                {packages
                  .filter((pkg) => pkg.status === "Active")
                  .map((pkg) => {
                    const duration = pkg.durationMonths || 1;
                    const durationText = `${duration} month${duration > 1 ? "s" : ""}`;
                    return (
                      <div
                        key={pkg.packageId}
                        className={`membership-plan-card ${
                          pkg.packageName.toLowerCase() === "premium"
                            ? "membership-premium-card"
                            : ""
                        }`}
                        style={{ background: pkg.bgColor }}
                        onClick={() => handlePackageClick(pkg)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handlePackageClick(pkg);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${pkg.packageName} membership plan`}
                      >
                        {pkg.packageName.toLowerCase() === "vip" && (
                          <span className="membership-most-popular-badge">
                            Most Popular
                          </span>
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
                  })}
              </div>
            )}
          </div>
        </div>

        {isModalOpen && selectedPackage && (
          <PaymentModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            packageInfo={selectedPackage}
          />
        )}
      </div>
     
    </>
  );
};

export default MembershipPage;