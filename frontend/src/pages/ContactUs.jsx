import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      detail: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      detail: "support@example.com",
      link: "mailto:jayeshsarode2003@gmail.com",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Address",
      detail: "123 Business Street, Suite 100, City, State 12345",
      link: "https://maps.google.com",
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50">
        <div className=" text-black py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and
              we'll respond as soon as possible.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {submitSuccess && (
            <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">
                  Message Sent Successfully!
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  Thank you for contacting us. We'll get back to you within 24
                  hours.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.name
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.email
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                        errors.subject
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none ${
                        errors.message
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-linear-to-r from-green-600 to-green-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <a
                      key={index}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-green-50 transition-colors duration-200 group"
                    >
                      <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-200">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {info.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {info.detail}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-700 font-medium">
                        {schedule.day}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-br from-green-200 to-green-300 rounded-2xl shadow-xl p-6 text-gray-500">
                <div className="text-center">
                  <div className="inline-block p-3 bg-white/20 rounded-full mb-3">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    Quick Response Time
                  </h3>
                  <p className="text-gray-400 text-sm">
                    We typically respond within 24 hours during business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "What is your response time?",
                  answer:
                    "We typically respond to all inquiries within 24 hours during business days.",
                },
                {
                  question: "Do you offer customer support?",
                  answer:
                    "Yes! Our customer support team is available Monday-Friday, 9 AM - 6 PM.",
                },
                {
                  question: "Can I schedule a call?",
                  answer:
                    "Absolutely! Mention your preferred time in the message and we'll arrange a call.",
                },
                {
                  question: "Do you have a physical store?",
                  answer:
                    "Yes, visit us at 123 Business Street, Suite 100. We recommend calling ahead.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="font-bold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
