import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { Mail, Github as GitHub, Linkedin, Facebook, Send, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const Contact = () => {
  const initialFormData = {
    name: '',
    email: '',
    message: ''
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email address is invalid.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required.';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Validate on change
    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    // Validate all fields before submitting
    let currentErrors = {};
    let formIsValid = true;
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        currentErrors[key] = error;
        formIsValid = false;
      }
    });
    setFormErrors(currentErrors);

    if (!formIsValid) {
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userID = import.meta.env.VITE_EMAILJS_USER_ID;

    if (!serviceID || !templateID || !userID) {
        console.error("EmailJS environment variables are not set!");
        setSubmitError("Configuration error. Could not send message.");
        setIsSubmitting(false);
        return;
    }

    emailjs.send(serviceID, templateID, formData, userID)
      .then((result) => {
        console.log('EmailJS Success:', result.text);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData(initialFormData); // Reset form
        setFormErrors({}); // Clear errors
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }, (error) => {
        console.error('EmailJS Error:', error.text);
        setIsSubmitting(false);
        setSubmitError(`Failed to send message. ${error.text || 'Please try again later.'}`);
        setTimeout(() => {
          setSubmitError(null);
        }, 7000);
      });
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Contact Me</h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Get In Touch</h3>
            <div className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Mail size={20} className="sm:hidden text-blue-600 dark:text-blue-400" />
                  <Mail size={24} className="hidden sm:block text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <a href="mailto:ltn66441@gmail.com" className="text-sm sm:text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                    ltn66441@gmail.com
                  </a>
                </div>
              </div>
              {/* GitHub */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <GitHub size={20} className="sm:hidden text-blue-600 dark:text-blue-400" />
                  <GitHub size={24} className="hidden sm:block text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</p>
                  <a href="https://github.com/YouAreMyHome" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                    github.com/YouAreMyHome
                  </a>
                </div>
              </div>
              {/* LinkedIn */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Linkedin size={20} className="sm:hidden text-blue-600 dark:text-blue-400" />
                  <Linkedin size={24} className="hidden sm:block text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</p>
                  <a href="https://linkedin.com/in/youaremyhome" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                    linkedin.com/in/youaremyhome
                  </a>
                </div>
              </div>
              {/* Facebook */}
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Facebook size={20} className="sm:hidden text-blue-600 dark:text-blue-400" />
                  <Facebook size={24} className="hidden sm:block text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Facebook</p>
                  <a href="https://facebook.com/consauchetduoi" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 break-all">
                    facebook.com/consauchetduoi
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-md">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">Send Me a Message</h3>
            
            {submitSuccess && (
              <div className="fade-in flex items-start bg-green-100 dark:bg-green-800 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-green-700 dark:text-green-200">
                <CheckCircle size={18} className="sm:hidden mr-2 mt-0.5 flex-shrink-0" />
                <CheckCircle size={20} className="hidden sm:block mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm sm:text-base">Thank you for your message! I'll get back to you soon.</p>
              </div>
            )}

            {submitError && (
              <div className="fade-in flex items-start bg-red-100 dark:bg-red-800 p-3 sm:p-4 rounded-md mb-4 sm:mb-6 text-red-700 dark:text-red-200">
                <XCircle size={18} className="sm:hidden mr-2 mt-0.5 flex-shrink-0" />
                <XCircle size={20} className="hidden sm:block mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm sm:text-base">{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate> {/* noValidate để tắt validation mặc định của browser, ưu tiên JS validation */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-md focus:outline-none dark:bg-gray-800 dark:text-white ${formErrors.name ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'}`}
                />
                {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-md focus:outline-none dark:bg-gray-800 dark:text-white ${formErrors.email ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'}`}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell me how I can help you..."
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-md focus:outline-none dark:bg-gray-800 dark:text-white resize-vertical ${formErrors.message ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'}`}
                ></textarea>
                {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="sm:hidden mr-2 animate-spin" />
                    <Loader2 size={18} className="hidden sm:block mr-2 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} className="sm:hidden mr-2" />
                    <Send size={18} className="hidden sm:block mr-2" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;