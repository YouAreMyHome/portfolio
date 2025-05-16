import React, { useState } from 'react';
import { Mail, Github as GitHub, Linkedin, Facebook, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Contact Me</h2>
          <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get In Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Mail size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <a href="mailto:nghia@example.com" className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    ltn66441@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <GitHub size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</p>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    github.com/YouAreMyHome
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Linkedin size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">LinkedIn</p>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    linkedin.com/in/youaremyhome
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <Facebook size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Facebook</p>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-lg text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                    facebook.com/consauchetduoi
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send Me a Message</h3>
            
            {submitSuccess ? (
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md mb-6">
                <p className="text-green-800 dark:text-green-200">Thank you for your message! I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
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
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
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
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;