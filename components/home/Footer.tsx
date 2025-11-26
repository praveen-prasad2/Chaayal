import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-deep-black text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div>
                        <Link href="/" className="text-3xl font-bold tracking-tighter text-white mb-6 block">
                            CHAAYAL
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Elevating your lifestyle with timeless luxury and sophisticated design. Experience the art of fine living.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Home</Link>
                            </li>
                            <li>
                                <Link href="#products" className="text-gray-400 hover:text-primary transition-colors duration-300">Collection</Link>
                            </li>
                            <li>
                                <Link href="#about" className="text-gray-400 hover:text-primary transition-colors duration-300">Our Story</Link>
                            </li>
                            <li>
                                <Link href="#contact" className="text-gray-400 hover:text-primary transition-colors duration-300">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Customer Care</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Shipping & Returns</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">FAQ</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Terms & Conditions</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
                        <p className="text-gray-400 mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent border border-gray-700 text-white px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white px-4 py-3 font-medium uppercase tracking-widest hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                Subscribe <ArrowRight className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Chaayal. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="text-gray-500 text-sm">Designed with elegance</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
