import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import PaymentModal from "../PaymentPage/PaymentModal";
import "./MembershipPage.css";
import MainLayout4Mem from "./MainLayout4Mem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

const getRandomGradient = () => {
  const colors = [
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
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
          setPackages(data.$values.map((pkg) => ({ ...pkg, bgColor: getRandomGradient() })));
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
              <p>⏳ Đang tải gói membership...</p>
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
                      <FontAwesomeIcon icon={faCrown} size="3x" className="plan-icon" />
                      <h2 className="plan-title">{pkg.packageName.toUpperCase()}</h2>
                      <p className="plan-price">{pkg.price} VND</p>
                      <p className="plan-description">{pkg.description}</p>
                    </div>
                  ))
                ) : (
                  <p>🚫 Không có gói membership khả dụng.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} packageInfo={selectedPackage} />
      </div>
    </MainLayout4Mem>
  );
};

export default MembershipPage;
