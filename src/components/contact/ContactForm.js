"use client";

import { useState } from "react";

const ACCESS_KEY = "c086f078-f1c0-4d10-8531-0d26c4539f1d";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [buttonHtml, setButtonHtml] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    if (!formData.has("access_key")) {
      formData.append("access_key", ACCESS_KEY);
    }

    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setButtonHtml(
          '<span>Message Sent!</span><span class="material-symbols-outlined">check_circle</span>'
        );
        form.reset();
        setTimeout(() => {
          setStatus("idle");
          setButtonHtml(null);
        }, 5000);
      } else {
        console.error("Web3Forms Error:", data);
        alert(`Error: ${data.message}`);
        setStatus("idle");
        setButtonHtml(null);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
      setButtonHtml(null);
    }
  };

  return (
    <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 border border-gray-200 dark:border-gray-800">
      <form id="contact-form" className="space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="access_key" value={ACCESS_KEY} />
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              person
            </span>
            <input
              type="text"
              id="contact-name"
              name="name"
              placeholder="Your Name"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              alternate_email
            </span>
            <input
              type="email"
              id="contact-email"
              name="email"
              placeholder="you@company.com"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-subject"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Subject
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              description
            </span>
            <select
              id="contact-subject"
              name="subject"
              required
              className="w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 appearance-none cursor-pointer"
              defaultValue=""
            >
              <option value="">Select a subject</option>
              <option value="job-opportunity">Job Opportunity</option>
              <option value="collaboration">Collaboration</option>
              <option value="consultation">Consultation</option>
              <option value="other">Other</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="contact-message"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows="6"
            placeholder="Tell me about your project..."
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className={`w-full text-white py-3 px-6 rounded-xl font-medium transition shadow-lg flex items-center justify-center gap-2 ${
            status === "success"
              ? "bg-green-500 hover:bg-green-600"
              : "bg-primary hover:bg-primary-hover shadow-primary/30"
          }`}
        >
          {status === "sending" ? (
            "Sending..."
          ) : buttonHtml ? (
            <span dangerouslySetInnerHTML={{ __html: buttonHtml }} />
          ) : (
            <>
              <span>Launch Message</span>
              <span className="material-symbols-outlined">send</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
