import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Mail, Github as GitHub, Linkedin, Facebook, Send, Loader2, CheckCircle, XCircle, AlertTriangle, MessageSquare, Zap, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const Contact = () => {
  const { language } = useLanguage();
  const t = (key) => getTranslation(language, key);
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
          error = language === 'vi' ? 'Tên là bắt buộc.' : 'Name is required.';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = language === 'vi' ? 'Email là bắt buộc.' : 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = language === 'vi' ? 'Địa chỉ email không hợp lệ.' : 'Email address is invalid.';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = language === 'vi' ? 'Tin nhắn là bắt buộc.' : 'Message is required.';
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

    const error = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await emailjs.send(
        'service_5qnpd9d',
        'template_4ug7e4p',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: 'Le Trong Nghia',
        },
        'PUYa4E7W2HNs8nH4x'
      );
      
      setSubmitSuccess(true);
      setFormData(initialFormData);
      setFormErrors({});
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitError(language === 'vi' ? 'Gửi email thất bại. Vui lòng thử lại.' : 'Failed to send email. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Reset success/error messages after some time
  useEffect(() => {
    if (submitSuccess || submitError) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, submitError]);

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-black to-cyber-darker opacity-90"></div>
      <div className="absolute inset-0 bg-mesh-gradient opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-cyber-pink mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="font-mono text-sm uppercase tracking-wider">Connect</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-orbitron font-bold gradient-cyber-text mb-6">
            {t('contact.title')}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('contact.description')}
          </p>
          
          <motion.div 
            className="mt-6 h-1 w-20 bg-cyber-gradient mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="cyber-card rounded-2xl p-8">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-cyber-blue" />
                Get In Touch
              </h3>
              
              <p className="text-gray-300 mb-8 leading-relaxed">
                {language === 'vi' 
                  ? 'Tôi luôn sẵn sàng thảo luận về các dự án mới, cơ hội sáng tạo hoặc hợp tác. Hãy liên hệ với tôi!'
                  : "I'm always open to discussing new projects, creative opportunities, or collaborations. Let's connect!"
                }
              </p>

              {/* Contact Details */}
              <div className="space-y-6 mb-8">
                <motion.div 
                  className="flex items-center gap-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 cyber-card rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-cyber-blue" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                    <p className="text-cyber-blue font-mono">letrongnghia.dev@gmail.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 cyber-card rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-cyber-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-cyber-purple font-mono">Ho Chi Minh City, Vietnam</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 cyber-card rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-cyber-pink" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Response Time</p>
                    <p className="text-cyber-pink font-mono">24 Hours</p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: GitHub, href: "https://github.com/YouAreMyHome", color: "cyber-blue" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/youaremyhome", color: "cyber-purple" },
                  { icon: Facebook, href: "https://facebook.com/youaremyhome", color: "cyber-pink" }
                ].map(({ icon: Icon, href, color }, index) => (
                  <motion.a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-4 cyber-card rounded-full text-${color} hover:shadow-cyber transition-all duration-300 group`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="cyber-card rounded-2xl p-8">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-6 flex items-center gap-3">
                <Send className="w-6 h-6 text-cyber-purple" />
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 cyber-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-blue transition-all ${
                      formErrors.name ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Your name"
                    whileFocus={{ scale: 1.02 }}
                  />
                  {formErrors.name && (
                    <motion.p 
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {formErrors.name}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 cyber-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-purple transition-all ${
                      formErrors.email ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="your.email@example.com"
                    whileFocus={{ scale: 1.02 }}
                  />
                  {formErrors.email && (
                    <motion.p 
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {formErrors.email}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-mono text-gray-300 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 cyber-card rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-pink transition-all resize-none ${
                      formErrors.message ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Tell me about your project..."
                    whileFocus={{ scale: 1.02 }}
                  />
                  {formErrors.message && (
                    <motion.p 
                      className="text-red-400 text-sm mt-1 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {formErrors.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-cyber-gradient hover:shadow-cyber-lg'
                  } text-white`}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="font-mono">Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="font-mono">{t('contact.form.submit')}</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Success/Error Messages */}
              {submitSuccess && (
                <motion.div 
                  className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-400 font-mono text-sm">
                    {language === 'vi' ? 'Tin nhắn đã được gửi thành công!' : 'Message sent successfully!'}
                  </p>
                </motion.div>
              )}

              {submitError && (
                <motion.div 
                  className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 font-mono text-sm">{submitError}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
