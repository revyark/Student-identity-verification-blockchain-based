import React, { useState, useEffect } from "react";
import "./InstituteProfile.css"; // Import CSS file

const InstituteProfile = () => {
  const [institute, setInstitute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const instituteData = JSON.parse(localStorage.getItem('institute'));
        if (!instituteData || !instituteData._instituteId) {
          alert('Institute ID not found. Please log in again.');
          return;
        }
        const instituteId = instituteData._instituteId;
        const response = await fetch(`http://localhost:8000/api/institute/${instituteId}/profile`);
        if (response.ok) {
          const data = await response.json();
          // Map backend data to formData with required fields
          const mappedData = {
            name: data.name || '',
            code: instituteId, // InstituteCode is the InstituteId
            address: data.location || '',
            email: data.email || '',
            phone: data.contact || '',
            verified: true // Status is always verified
          };
          setInstitute(mappedData);
          setFormData(mappedData);
        } else {
          alert('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save changes
  const handleSave = async () => {
    try {
      const instituteData = JSON.parse(localStorage.getItem('institute'));
      if (!instituteData || !instituteData._instituteId) {
        alert('Institute ID not found. Cannot save profile.');
        return;
      }
      const instituteId = instituteData._instituteId;
      // Map formData to backend expected format
      const updateData = {
        name: formData.name,
        email: formData.email,
        location: formData.address,
        contact: formData.phone,
      };
      const response = await fetch(`http://localhost:8000/api/institute/${instituteId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        // Map back to institute format
        const mappedUpdated = {
          name: updatedProfile.name || '',
          code: instituteId,
          address: updatedProfile.location || '',
          email: updatedProfile.email || '',
          phone: updatedProfile.contact || '',
          website: formData.website || '',
          verified: true
        };
        setInstitute(mappedUpdated);
        setFormData(mappedUpdated);
        setIsEditing(false);
        alert('Profile updated successfully');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div className="institute-profile"><p>Loading profile...</p></div>;
  }

  if (!institute) {
    return <div className="institute-profile"><p>Failed to load profile.</p></div>;
  }

  return (
    <div className="institute-profile">
      <div className="profile-card">
        <h2 className="profile-title">
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name || ''}
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
