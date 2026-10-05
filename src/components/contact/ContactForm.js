"use client";
import { useState } from "react";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
export default function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    if (!ACCESS_KEY) {
      const fields = new FormData(form);
      const body = `Name: ${fields.get("name")}\nEmail: ${fields.get("email")}\n\n${fields.get("message")}`;
      window.location.href = `mailto:samadprogrammer@gmail.com?subject=${encodeURIComponent(fields.get("subject"))}&body=${encodeURIComponent(body)}`;
      setMessage("Your email app will open with your message. Send it there to complete your enquiry.");
      return;
    }
    setStatus("sending"); setMessage("");
    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: new FormData(form) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Your message could not be sent. Please try again.");
      setStatus("success"); setMessage("Message sent. Thanks for reaching out!"); form.reset();
    } catch (error) {
      setStatus("error"); setMessage(error.message || "Something went wrong. Please try again.");
    }
  }
  return <div className="contact-form-panel"><form className="contact-form" onSubmit={handleSubmit}>
    {ACCESS_KEY && <input type="hidden" name="access_key" value={ACCESS_KEY} />}
    <input type="hidden" name="from_name" value="Abdus Samad Portfolio" />
    <div className="contact-field"><label htmlFor="contact-name">NAME</label><input id="contact-name" name="name" autoComplete="name" placeholder="Your name" required /></div>
    <div className="contact-field"><label htmlFor="contact-email">EMAIL</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></div>
    <div className="contact-field full"><label htmlFor="contact-subject">SUBJECT</label><select id="contact-subject" name="subject" defaultValue="" required><option value="" disabled>What do you have in mind?</option><option>Job opportunity</option><option>Project collaboration</option><option>Consultation</option><option>Other</option></select></div>
    <div className="contact-field full"><label htmlFor="contact-message">MESSAGE</label><textarea id="contact-message" name="message" placeholder="Tell me about your project..." rows={4} required /></div>
    <button className="contact-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : ACCESS_KEY ? "Send message ↗" : "Open email draft ↗"}</button>
    {!ACCESS_KEY && <p className="form-status">Opens your email app to send to <a href="mailto:samadprogrammer@gmail.com">samadprogrammer@gmail.com</a>.</p>}
    <p role="status" aria-live="polite" className={`form-status ${status === "error" ? "error" : ""}`}>{message}</p>
  </form></div>;
}

