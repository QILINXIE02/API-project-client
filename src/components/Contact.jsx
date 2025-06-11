import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ userName: '', userComment: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for your message, ${formData.userName}!`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Contact Us!</legend>
        <label htmlFor="yourName">Your Name</label>
        <input
          id="yourName"
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <label htmlFor="yourComments">Comments</label>
        <textarea
          id="yourComments"
          name="userComment"
          value={formData.userComment}
          onChange={handleChange}
        />
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Contact;
