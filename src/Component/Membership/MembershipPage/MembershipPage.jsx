import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faGem, faCrown } from '@fortawesome/free-solid-svg-icons';
import PaymentModal from '../Modal/PaymentModal';
import BasicPaymentModal from '../Modal/BasicPaymentModal';
import './MembershipPage.css';
import MainLayout4Mem from './MainLayout4Mem';

const MembershipPage = ({ prices }) => {
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);

  const handlePackageClick = (packageType) => {
    if (packageType === 'premium') {
      setIsPremiumModalOpen(true);
    } else if (packageType === 'basic') {
      setIsBasicModalOpen(true);
    } else if (packageType === 'free') {
      // Handle free package selection
      alert('You have selected the FREE package!');
    }
  };

  return (
    <MainLayout4Mem hideBody={true}>
      <div className="membership-page">
        <div className="membership-container">
          <div className="membership-content">
            <h1 className="membership-title">Membership Plans</h1>
            <div className="membership-plans">
              <div 
                className="plan-card-free" 
                onClick={() => handlePackageClick('free')}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={faStar} size="3x" className="plan-icon" />
                <h2 className="plan-title">FREE</h2>
                <p className="plan-price">{prices.free}</p>
                <p className="plan-description">Some basic access</p>
              </div>

              <div 
                className="plan-card-basic" 
                onClick={() => handlePackageClick('basic')}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={faGem} size="3x" className="plan-icon" />
                <h2 className="plan-title">BASIC PACKAGE</h2>
                <p className="plan-price">{prices.basic}</p>
                <p className="plan-description">Some basic access</p>
              </div>

              <div 
                className="plan-card-premium" 
                onClick={() => handlePackageClick('premium')}
                role="button"
                tabIndex={0}
              >
                <FontAwesomeIcon icon={faCrown} size="3x" className="plan-icon" />
                <h2 className="plan-title">PREMIUM PACKAGE</h2>
                <p className="plan-price">{prices.premium}</p>
                <p className="plan-description">Full access to all features</p>
              </div>
            </div>
          </div>
        </div>

        <PaymentModal 
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          packageType="premium"
          price={prices.premium}
        />

        <BasicPaymentModal
          isOpen={isBasicModalOpen}
          onClose={() => setIsBasicModalOpen(false)}
        />
      </div>
    </MainLayout4Mem>
  );
};

export default MembershipPage;
