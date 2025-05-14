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
    </div>
  );
}
