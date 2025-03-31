import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./ConsultationResponse.css";
import { AuthContext } from "../../Component/LoginPage/AuthContext";
import Navbar from "../HomePage/NavBar/NavBar";
import Footer from "../HomePage/Footer/Footer";

const ConsultationResponse = ({ isLoggedIn }) => {
  const { userId } = useContext(AuthContext);
  const [responses, setResponses] = useState([]);
  const [consultationResponses, setConsultationResponses] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [childNames, setChildNames] = useState({});
  const [doctorNames, setDoctorNames] = useState({});
  const [formData, setFormData] = useState({ childId: "", description: "", urgency: "Normal", category: "" });

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/Child/by-user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setChildren(response.data?.data?.$values || []);
      } catch (error) {
        console.error("❌ Error fetching children:", error);
      }
    };

    if (userId) {
      fetchChildren();
    }
  }, [userId]);

  useEffect(() => {
    const fetchConsultationRequests = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:5200/api/ConsultationRequest/get-all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const storedUserId = Number(localStorage.getItem("userId"));

        const userRequests = response.data.data.$values.filter(req =>
          req.userId === storedUserId || 
          (req.userId === null && req.childId && children.some(child => child.childId === req.childId))
        );

        setResponses(userRequests);
      } catch (err) {
        console.error("❌ Error fetching consultation requests:", err);
        setError("Failed to load consultation requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationRequests();
  }, [userId, children]);

  useEffect(() => {
    const fetchConsultationResponses = async () => {
      if (responses.length === 0) return; 

      try {
        const response = await axios.get("http://localhost:5200/api/ConsultationResponse/get-all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data?.success && response.data?.data?.$values) {
          setConsultationResponses(response.data.data.$values);
        } else {
          setError("Invalid ConsultationResponse API format.");
        }
      } catch (error) {
        console.error("❌ Error fetching consultation responses:", error);
        setError("Failed to load consultation responses.");
      }
    };

    fetchConsultationResponses();
  }, [responses]);

  const fetchChildName = async (childId) => {
  if (!childId || childNames[childId]) return; // Nếu đã có tên thì bỏ qua

  try {
    const response = await axios.get(`http://localhost:5200/api/Child/${childId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.data?.success) {
      setChildNames((prev) => ({ ...prev, [childId]: response.data.data.name }));
      console.log(`✅ Child ${childId}: ${response.data.data.name}`);
    } else {
      console.error(`❌ API không trả về tên cho Child ID: ${childId}`);
      setChildNames((prev) => ({ ...prev, [childId]: "Unknown" }));
    }
  } catch (error) {
    console.error("❌ Error fetching child name:", error);
    setChildNames((prev) => ({ ...prev, [childId]: "Unknown" }));
  }
};


  const fetchDoctorName = async (doctorId) => {
  if (!doctorId || doctorNames[doctorId]) return; // Nếu đã có tên thì bỏ qua

  try {
    const response = await axios.get(`http://localhost:5200/api/Doctor/${doctorId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.data?.name) {
      setDoctorNames((prev) => ({ ...prev, [doctorId]: response.data.name }));
      console.log(`✅ Doctor ${doctorId}: ${response.data.name}`);
    } else {
      console.error(`❌ API không trả về tên bác sĩ cho ID: ${doctorId}`);
      setDoctorNames((prev) => ({ ...prev, [doctorId]: "Unknown" }));
    }
  } catch (error) {
    console.error("❌ Error fetching doctor name:", error);
    setDoctorNames((prev) => ({ ...prev, [doctorId]: "Unknown" }));
  }
};
useEffect(() => {
  console.log("📢 Fetching child names...");
  
  const fetchAllChildNames = async () => {
    for (const req of responses) {
      if (req.childId && !childNames[req.childId]) {
        await fetchChildName(req.childId);
      }
    }
  };

  if (responses.length > 0) {
    fetchAllChildNames();
  }
}, [responses]);



  useEffect(() => {
    console.log("📢 Fetching doctor names...");
    const fetchAllDoctorNames = async () => {
      const uniqueDoctorIds = [...new Set(consultationResponses.map(r => r.doctorId))];

      for (const doctorId of uniqueDoctorIds) {
        if (!doctorNames[doctorId]) {
          await fetchDoctorName(doctorId);
        }
      }
    };

    if (consultationResponses.length > 0) {
      fetchAllDoctorNames();
    }
  }, [consultationResponses]);
  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="consultation-container">
        <h2 className="consultation-title">Consultation Responses</h2>
        <p className="consultation-subtitle">Here are the responses to your consultation requests.</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : consultationResponses.length === 0 ? (
          <div className="no-responses">No consultation responses found.</div>
        ) : (
          <table className="response-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Child Name</th>
                <th>Description</th>
                <th>Diagnosis</th>
                <th>Doctor Name</th>
                <th>Response</th>
                <th>Response Date</th>
              </tr>
            </thead>
            <tbody>
              {consultationResponses.map((response,index) => {
                const request = responses.find((req) => req.requestId === response.requestId);
                return (
                  <tr key={response.responseId}>
                    <td>{index + 1}</td>
                    <td>{request?.childId ? childNames[request.childId] || "Loading..." : "N/A"}</td>
                    <td>{request?.description || "N/A"}</td>
                    <td>{response.diagnosis || "No Diagnosis"}</td>
                    <td>{doctorNames[response.doctorId] || "Loading..."}</td>
                    <td dangerouslySetInnerHTML={{ __html: response.content }}></td>
                    <td>{new Date(response.responseDate).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ConsultationResponse;
