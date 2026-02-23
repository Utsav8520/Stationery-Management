import { Link } from "react-router-dom";
import { Store, Facebook, Twitter, Instagram, Mail, Phone, MapPin, CreditCard } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                <Store className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">Ambey Enterprises</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            From classrooms to playgrounds—your trusted source for stationery and sports essentials.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="text-gray-400 hover:text-white transition-colors">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
                                    🔐 Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/products?category=Stationery" className="text-gray-400 hover:text-white transition-colors">
                                    Stationery
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=Sports" className="text-gray-400 hover:text-white transition-colors">
                                    Sports
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=Office Supplies" className="text-gray-400 hover:text-white transition-colors">
                                    Office Supplies
                                </Link>
                            </li>
                            <li>
                                <Link to="/products?category=School Supplies" className="text-gray-400 hover:text-white transition-colors">
                                    School Supplies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-gray-400">
                                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <span>Ambey Enterprises, Itahari, Nepal</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Phone className="w-5 h-5 flex-shrink-0" />
                                <span>+977 1234567890</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <Mail className="w-5 h-5 flex-shrink-0" />
                                <span>info@ambeyenterprises.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-700 pt-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2">We Accept</h4>
                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 px-3 py-2 rounded flex items-center gap-1">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-sm">Khalti</span>
                                </div>
                                <div className="bg-white/10 px-3 py-2 rounded flex items-center gap-1">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-sm">Cash</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} Ambey Enterprises. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
