import React, { useState, useEffect } from 'react';

const AdminPanel = ({ onPriceChange, prices }) => {
  const [newPrices, setNewPrices] = useState({
    free: '',
    basic: '',
    premium: ''
  });

  useEffect(() => {
    if (prices) {
      setNewPrices(prices);
    }
  }, [prices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrices((prevPrices) => ({
      ...prevPrices,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPriceChange('free', newPrices.free);
    onPriceChange('basic', newPrices.basic);
    onPriceChange('premium', newPrices.premium);
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Free Plan Price:
            <input
              type="text"
              name="free"
              value={newPrices.free}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Basic Plan Price:
            <input
              type="text"
              name="basic"
              value={newPrices.basic}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Premium Plan Price:
            <input
              type="text"
              name="premium"
              value={newPrices.premium}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Update Prices</button>
      </form>
    </div>
  );
};

export default AdminPanel;