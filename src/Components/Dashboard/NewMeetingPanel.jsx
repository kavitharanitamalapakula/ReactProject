import React, { useState, useRef, useEffect } from 'react';
import { Link, Plus, Calendar } from 'lucide-react';
import '../../Styles/newmeetingpanel.css'; // Import the CSS file
import { FaVideo } from 'react-icons/fa';
import { Modal, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

function NewMeetingPanel({ onMeetingAdd }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', datetime: null });
  const [errors, setErrors] = useState({});
  const panelRef = useRef(null);
  const toggleOptions = () => setShowOptions(!showOptions);
  const openModal = () => {
    setShowOptions(false);
    setShowModal(true);
  };
  // Close popup if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date();
    const selectedDate = formData.datetime;

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!selectedDate) newErrors.datetime = 'Date & time is required';
    else if (selectedDate < now) newErrors.datetime = 'Cannot select a past date/time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onMeetingAdd({ ...formData, datetime: formData.datetime.toISOString() }); // Pass ISO string
      setFormData({ title: '', description: '', datetime: null });
      setShowModal(false);
    }
  };

  return (
    <div className="new-meeting-panel">
      <h3 className="title">Video Calls and meetings for everyone</h3>
      <p className="description">
        Connect, collaborate and celebrate from anywhere with MeepUpNow
      </p>

      <button onClick={toggleOptions} className="new-meeting-button">
        <FaVideo className="icon me-3" />
        <span>New Meeting</span>
      </button>

      {showOptions && (
        <div ref={panelRef} className="popup-panel">
          <button className="popup-option">
            <Link size={18} className="icon" />
            Create a meeting for later
          </button>
          <button className="popup-option">
            <Plus size={18} className="icon" />
            Start an instant meeting
          </button>
          <button className="popup-option" onClick={openModal}>
            <Calendar size={18} className="icon" />
            Schedule in Google Calendar
          </button>
        </div>
      )}

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Date & Time</Form.Label>
              <DatePicker
                selected={formData.datetime}
                onChange={(date) => handleChange('datetime', date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className={`form-control ${errors.datetime ? 'is-invalid' : ''}`}
                placeholderText="Select date and time"
              />
              {errors.datetime && (
                <div className="invalid-feedback d-block">{errors.datetime}</div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default NewMeetingPanel;
