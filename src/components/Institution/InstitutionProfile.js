import React, { useState } from "react";
import "./InstituteProfile.css"; // Import CSS file

const InstituteProfile = () => {
  // Dummy Data (replace with API data later)
  const [institute, setInstitute] = useState({
    name: "Indian Institute of Technology, Delhi",
    code: "IITD123",
    address: "Hauz Khas, New Delhi - 110016",
    email: "contact@iitd.ac.in",
    phone: "+91-11-2659-7135",
    website: "https://home.iitd.ac.in/",
    verified: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(institute);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save changes
  const handleSave = () => {
    setInstitute(formData); // Update institute details
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="institute-profile">
      <div className="profile-card">
        <h2 className="profile-title">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.name
          )}
        </h2>

        <p>
          <strong>Institute Code:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.code
          )}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.address
          )}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.email
          )}
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            institute.phone
          )}
        </p>

        <p>
          <strong>Website:</strong>{" "}
          {isEditing ? (
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="editing-input"
            />
          ) : (
            <a
              href={institute.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {institute.website}
            </a>
          )}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={institute.verified ? "verified" : "not-verified"}>
            {institute.verified ? "Verified" : " Not Verified"}
          </span>
        </p>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="buttonPrimary-inst" onClick={handleSave}>
                Save
              </button>
              <button className="buttonPrimary-inst" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="buttonPrimary-inst" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstituteProfile;
