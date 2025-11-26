import { MapPin, Phone, Mail, Send } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-24 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h3 className="text-primary-dark text-sm font-bold uppercase tracking-widest mb-2">Get in Touch</h3>
                    <h2 className="text-4xl md:text-5xl font-bold text-deep-black mb-6">Contact Us</h2>
                    <div className="w-24 h-1 bg-primary mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info & Map */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-deep-black mb-6">Visit Our Showroom</h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div className="ml-4">
                                        <p className="text-gray-900 font-medium">Chaayal Headquarters</p>
                                        <p className="text-gray-600">123 Luxury Avenue, Fashion District</p>
                                        <p className="text-gray-600">New York, NY 10001</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div className="ml-4">
                                        <p className="text-gray-900 font-medium">Phone</p>
                                        <p className="text-gray-600">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                                    <div className="ml-4">
                                        <p className="text-gray-900 font-medium">Email</p>
                                        <p className="text-gray-600">concierge@chaayal.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-64 w-full bg-gray-200 relative overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968482413!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1623334445555!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-deep-black mb-6">Send us a Message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-deep-black text-white text-sm uppercase tracking-widest font-medium hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                Send Message <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
