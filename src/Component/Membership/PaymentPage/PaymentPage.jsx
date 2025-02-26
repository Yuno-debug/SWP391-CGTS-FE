import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentPage.css';
import PaymentModal from '../Modal/PaymentModal';
import BasicPackageModal from './BasicPackageModal';

const API_URL = 'http://localhost:5200//api/MembershipPackage'; // Replace with your actual API URL

const PaymentPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showBasicModal, setShowBasicModal] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(API_URL);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handlePremiumClick = () => {
    setShowModal(true);
  };

  const handleBasicClick = () => {
    setShowBasicModal(true);
  };

  return (
    <div className="payment-page">
      <h1>Choose Your Package</h1>
      <div className="package-options">
        {packages.map((pkg) => (
          <div
            key={pkg.packageName}
            className={`package ${pkg.packageName.toLowerCase()}`}
            onClick={pkg.packageName.toLowerCase() === 'premium' ? handlePremiumClick : handleBasicClick}
          >
            <h2>{pkg.packageName} Package</h2>
            <p>${pkg.price}/month</p>
            <button>Select {pkg.packageName}</button>
          </div>
        ))}
      </div>
      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
      {showBasicModal && <BasicPackageModal onClose={() => setShowBasicModal(false)} />}
    </div>
  );
};

export default PaymentPage;