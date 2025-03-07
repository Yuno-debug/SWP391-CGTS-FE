import React, { useState, useEffect } from "react";
import "./adminPanel.css";

const AdminPanel = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newPackage, setNewPackage] = useState({
    packageName: "",
    description: "",
    price: "",
    durationMonths: "",
    features: "",
    maxChildrenAllowed: "",
  });

  useEffect(() => {
    fetchMembershipPackages();
  }, []);

  // Fetch all membership packages
  const fetchMembershipPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/MembershipPackage");

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setPackages(data);
      } else if (typeof data === "object") {
        setPackages([data]);
      } else {
        throw new Error("Unexpected API response format.");
      }
    } catch (error) {
      console.error("Error fetching membership packages:", error);
      setError(error.message);
    }
    setLoading(false);
  };

  // Handle input changes for the new package
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPackage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new package creation
  const handleCreatePackage = async () => {
  const packageData = {
    packageName: newPackage.packageName,
    description: newPackage.description,
    price: Number(newPackage.price),
    durationMonths: Number(newPackage.durationMonths),
    features: newPackage.features ? newPackage.features.split(",").map(f => f.trim()) : [], // Ensure it's an array
    maxChildrenAllowed: Number(newPackage.maxChildrenAllowed),
  };

  console.log("📦 Sending Package Data:", JSON.stringify(packageData, null, 2)); // Debugging log

  try {
    const response = await fetch("/api/MembershipPackage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(packageData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error Response:", errorData); // Log error response
      throw new Error("Failed to create package");
    }

    setNewPackage({
      packageName: "",
      description: "",
      price: "",
      durationMonths: "",
      features: "",
      maxChildrenAllowed: "",
    });

    fetchMembershipPackages(); // Refresh list
  } catch (error) {
    console.error("Error creating package:", error);
    setError(error.message);
  }
};




  return (
    <div className="admin-panel">
      <h2>Admin Panel - Membership Packages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <h3>Create New Package</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <label>
              Package Name:
              <input type="text" name="packageName" value={newPackage.packageName} onChange={handleInputChange} required />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={newPackage.description} onChange={handleInputChange} />
            </label>
            <label>
              Price:
              <input type="number" name="price" value={newPackage.price} onChange={handleInputChange} required />
            </label>
            <label>
              Duration (Months):
              <input type="number" name="durationMonths" value={newPackage.durationMonths} onChange={handleInputChange} required />
            </label>
            <label>
              Features (comma separated):
              <input type="text" name="features" value={newPackage.features} onChange={handleInputChange} />
            </label>
            <label>
              Max Children Allowed:
              <input type="number" name="maxChildrenAllowed" value={newPackage.maxChildrenAllowed} onChange={handleInputChange} />
            </label>
            <button type="button" onClick={handleCreatePackage}>
              Create Package
            </button>
          </form>

          <h3>Existing Packages</h3>
          <ul>
            {packages.map((pkg) => (
              <li key={pkg.packageId}>
                <strong>{pkg.packageName}</strong> - ${pkg.price} for {pkg.durationMonths} months
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
