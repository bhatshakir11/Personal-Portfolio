import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-github ${className}`}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`lucide lucide-linkedin ${className}`}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "c963a40a-e70c-43da-a19c-9a7a73764bf6",
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Portfolio Message from ${formData.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000); // reset status after 5s
      } else {
        alert("Something went wrong. Please check your form configuration or access key.");
        setStatus('idle');
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to send message. Please check your internet connection.");
      setStatus('idle');
    }
  };

  const contactInfo = [
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "b.shakir8491@gmail.com",
      link: "mailto:b.shakir8491@gmail.com"
    },
    {
      icon: <Phone size={20} />,
      label: "Phone",
      value: "+91 8491068558",
      link: "tel:+918491068558"
    },
    {
      icon: <LinkedinIcon size={20} />,
      label: "LinkedIn",
      value: "linkedin.com/in/shakir-bhat",
      link: "https://linkedin.com/in/shakir-bhat-a106562bb"
    },
    {
      icon: <GithubIcon size={20} />,
      label: "GitHub",
      value: "github.com/bhatshakir11",
      link: "https://github.com/bhatshakir11"
    }
  ];

  return (
    <section id="contact" className="contact-section reveal">
      <div className="container">
        <div className="section-title-wrapper">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Feel free to reach out for collaboration, project discussions, or inquiries.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details Column */}
          <div className="contact-info-col">
            <h3 className="contact-subtitle">Let's connect</h3>
            <p className="contact-description">
              Have an exciting opportunity or project you want to discuss? Contact me through any of the channels below or fill out the message form, and I will get back to you as soon as possible.
            </p>

            <div className="contact-info-list">
              {contactInfo.map((info, index) => (
                <a 
                  key={index} 
                  href={info.link} 
                  target={info.link.startsWith('http') ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="contact-info-item glass-card clickable"
                >
                  <div className="contact-icon-box">{info.icon}</div>
                  <div className="contact-details">
                    <span className="contact-label">{info.label}</span>
                    <span className="contact-value">{info.value}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="contact-form-col">
            <form onSubmit={handleSubmit} className="contact-form glass-card">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="form-input"
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="form-input"
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Your Message..."
                  className="form-input form-textarea"
                  disabled={status === 'sending'}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message</span> <Send size={16} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="toast-success">
                  <CheckCircle size={18} />
                  <span>Thank you! Your message was sent successfully.</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
