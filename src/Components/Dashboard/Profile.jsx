import { Edit, Linkedin, Github, Mail, Phone, Calendar } from "lucide-react";
import '../../Styles/profileCard.css';

export default function ProfileLayout() {
  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <img
          src="https://via.placeholder.com/120"
          alt="Profile"
          className="profile-avatar"
        />
        <h2 className="profile-name">Guest</h2>
      </div>

      {/* Info Grid */}
      <div className="info-grid">
        {/* Personal Info */}
        <div className="card">
          <h3 className="card-title">Personal Info</h3>
          <div className="info-row">
            <span>👤 Name: Guest</span>
            <Edit className="edit-icon" />
          </div>
          <div className="info-row">
            <span>⚪ Gender: Male</span>
            <Edit className="edit-icon" />
          </div>
          <div className="info-row">
            <Calendar className="icon" /> Date of Birth: 2000-01-01
            <Edit className="edit-icon" />
          </div>
          <button className="reset-button">Reset Password</button>
        </div>

        {/* Contact Info */}
        <div className="card">
          <h3 className="card-title">Contact Info</h3>
          <div className="info-row">
            <Phone className="icon" /> Phone: 9876543210
            <Edit className="edit-icon" />
          </div>
          <div className="info-row">
            <Mail className="icon" /> <strong>Email:</strong> anonymous@gmail.com
          </div>
        </div>

        {/* Social Links */}
        <div className="card">
          <h3 className="card-title">Social Links</h3>
          <div className="info-row">
            <Linkedin className="icon" /> LinkedIn: <a href="https://www.linkedin.com">https://www.linkedin.com</a>
            <Edit className="edit-icon" />
          </div>
          <div className="info-row">
            <Github className="icon" /> GitHub: <a href="https://github.com">https://github.com</a>
            <Edit className="edit-icon" />
          </div>
        </div>

        {/* Account Created */}
        <div className="card">
          <h3 className="card-title">Account Created</h3>
          <p><strong>Created on:</strong> Thursday, February 27, 2025</p>
        </div>
      </div>
    </div>
  );
}
