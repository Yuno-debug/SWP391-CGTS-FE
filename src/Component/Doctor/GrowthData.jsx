import React, { useEffect, useState } from "react";
import axios from "axios";

const GrowthRecords = () => {
    const [growthRecords, setGrowthRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1️⃣ Lấy danh sách requestId đã được bác sĩ phản hồi
    const fetchRespondedRequestIds = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authorization token found. Please log in again.");

            const response = await axios.get("http://localhost:5200/api/ConsultationResponse/get-all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
                return new Set(response.data.data.$values.map((resp) => resp.requestId));
            } else {
                throw new Error("Unexpected consultation response format.");
            }
        } catch (error) {
            console.error("Error fetching consultation responses:", error);
            return new Set();
        }
    };

    // 2️⃣ Lấy danh sách childId từ ConsultationRequest dựa trên requestId đã phản hồi
    const fetchChildIdsByRequest = async (respondedRequestIds) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authorization token found. Please log in again.");

            const response = await axios.get("http://localhost:5200/api/ConsultationRequest/get-all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.success && Array.isArray(response.data?.data?.$values)) {
                const childIds = new Set(
                    response.data.data.$values
                        .filter((req) => respondedRequestIds.has(req.requestId)) // Chỉ lấy request đã phản hồi
                        .map((req) => req.childId) // Lấy childId tương ứng
                        .filter((id) => id != null) // Lọc bỏ null
                );
                return childIds;
            } else {
                throw new Error("Unexpected consultation request format.");
            }
        } catch (error) {
            console.error("Error fetching consultation requests:", error);
            return new Set();
        }
    };

    // 3️⃣ Lọc GrowthRecords dựa trên childId
    const fetchGrowthRecords = async (respondedChildIds) => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authorization token found. Please log in again.");

            const response = await axios.get("http://localhost:5200/api/growth-records", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.$values && Array.isArray(response.data.$values)) {
                const filteredRecords = response.data.$values.filter((record) =>
                    respondedChildIds.has(record.childId) // Chỉ lấy Growth Records có childId đã phản hồi
                );
                setGrowthRecords(filteredRecords);
            } else {
                throw new Error("Unexpected growth records format.");
            }
        } catch (error) {
            console.error("Error fetching growth records:", error);
            setError(`Failed to load growth records: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 4️⃣ Gọi API khi component được mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const respondedRequestIds = await fetchRespondedRequestIds(); // Lấy requestId đã phản hồi
                const respondedChildIds = await fetchChildIdsByRequest(respondedRequestIds); // Lấy childId tương ứng
                await fetchGrowthRecords(respondedChildIds); // Chỉ lấy Growth Records đã phản hồi
            } catch (error) {
                console.error("Error during initial fetch:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Growth Records with Doctor's Response</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {growthRecords.length > 0 ? (
                    growthRecords.map((record) => (
                        <li key={record.recordId}>
                            <strong>Month:</strong> {record.month}, <strong>Weight:</strong> {record.weight} kg,{" "}
                            <strong>Height:</strong> {record.height} cm
                        </li>
                    ))
                ) : (
                    <p>No growth records found.</p>
                )}
            </ul>
        </div>
    );
};

export default GrowthRecords;
