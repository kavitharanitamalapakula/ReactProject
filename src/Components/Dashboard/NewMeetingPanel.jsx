import React, { useState, useRef, useEffect } from 'react';
import { Link, Plus, Calendar } from 'lucide-react';
import '../../Styles/newmeetingpanel.css';
import { FaVideo } from 'react-icons/fa';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Base_Url = "http://localhost:5000/api/meetings";

function NewMeetingPanel({ onMeetingAdd }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', datetime: null });
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false); // State for success popup
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

  const handleSubmit = async () => {
    if (validateForm()) {
      const meetingData = { ...formData, datetime: formData.datetime.toISOString() };

      try {
        const response = await fetch(Base_Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(meetingData),
        });

        if (!response.ok) {
          throw new Error('Failed to save the meeting');
        }

        // Notify parent component that a new meeting has been added
        onMeetingAdd(meetingData);

        // Clear the form and close the modal
        setFormData({ title: '', description: '', datetime: null });
        setShowModal(false);

        // Show confirmation popup for 3 seconds
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds

      } catch (error) {
        // Handle error here
        console.error('Error saving meeting:', error.message);
      }
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

      {/* Success Popup Toast */}
      {showConfirmation && (
        <Toast onClose={() => setShowConfirmation(false)} show={showConfirmation} delay={3000} autohide>
          <Toast.Body>Your meeting has been scheduled!</Toast.Body>
        </Toast>
      )}
    </div>
  );
}

export default NewMeetingPanel;
