import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    candidate_id: "",
    candidate_name: "",
    email: "",
    skills: "",
    experience: ""
  });

  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");

  const FUNCTION_URL = "http://candidatefuncapp-bucnf6cugxccbrh9.southindia-01.azurewebsites.net";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitCandidate = async () => {
    try {
      const payload = {
        candidate_id: parseInt(formData.candidate_id),
        candidate_name: formData.candidate_name,
        email: formData.email,
        skills: formData.skills
          .split(",")
          .map(skill => skill.trim())
          .filter(skill => skill),
        experience: parseInt(formData.experience)
      };

      const response = await axios.post(
        `${FUNCTION_URL}/api/submit_candidate`,
        payload
      );

      setMessage(response.data.message);

      setFormData({
        candidate_id: "",
        candidate_name: "",
        email: "",
        skills: "",
        experience: ""
      });

    } catch (error) {
      setMessage(
        error.response?.data?.error || "Something went wrong"
      );
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        `${FUNCTION_URL}/api/get_summary`
      );

      setSummary(response.data);

    } catch (error) {
      setMessage("Failed to fetch summary");
    }
  };

  return (
    <div className="container">
      <h1>Candidate Application Tracker</h1>

      <div className="form-box">
        <input
          type="text"
          name="candidate_id"
          placeholder="Candidate ID"
          value={formData.candidate_id}
          onChange={handleChange}
        />

        <input
          type="text"
          name="candidate_name"
          placeholder="Candidate Name"
          value={formData.candidate_name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />

        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
        />

        <button onClick={submitCandidate}>
          Submit Candidate
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="summary-section">
        <button onClick={fetchSummary}>
          Fetch Summary
        </button>

        {summary && (
          <div className="summary-box">
            <h2>Application Summary</h2>
            <p><strong>Total Applications:</strong> {summary.total_applications}</p>
            <p><strong>Freshers:</strong> {summary.freshers_count}</p>
            <p><strong>Experienced:</strong> {summary.experienced_count}</p>

            <h3>Unique Skills</h3>
            <ul>
              {summary.unique_skills?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
