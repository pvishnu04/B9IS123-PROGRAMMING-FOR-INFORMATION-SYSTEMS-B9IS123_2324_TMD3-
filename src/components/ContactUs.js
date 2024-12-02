import React from 'react';

function ContactUs() {
  return (
    <div>
      <h2>Contact Us</h2>
      <p>Email: support@onlinepharmacy.com</p>
      <p>Phone: +1-800-123-4567</p>
      <form>
        <textarea placeholder="Your message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContactUs;
