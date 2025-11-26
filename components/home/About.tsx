import Image from 'next/image';
import { Check } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                    <div className="relative mb-12 lg:mb-0">
                        <div className="aspect-w-3 aspect-h-4 rounded-none overflow-hidden relative h-[600px]">
                            <Image
                                src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=2000&auto=format&fit=crop"
                                alt="About Chaayal"
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-secondary -z-10"></div>
                        <div className="absolute -top-6 -left-6 w-48 h-48 border-2 border-primary -z-10"></div>
                    </div>

                    <div>
                        <h3 className="text-primary-dark text-sm font-bold uppercase tracking-widest mb-2">Our Story</h3>
                        <h2 className="text-4xl font-bold text-deep-black mb-6">Crafting Elegance Since 2024</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            At Chaayal, we believe that true luxury lies in the details. Our journey began with a simple vision: to create a brand that embodies sophistication, quality, and timeless beauty. Every piece in our collection is carefully curated to ensure it meets our exacting standards.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We are dedicated to providing our customers with an unparalleled shopping experience. From the moment you visit our site to the unboxing of your purchase, we strive to make every interaction memorable.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-light/20 mt-1">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <p className="ml-4 text-base text-gray-700">Premium Quality Materials</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-light/20 mt-1">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <p className="ml-4 text-base text-gray-700">Ethically Sourced Products</p>
                            </div>
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-primary-light/20 mt-1">
                                    <Check className="h-4 w-4 text-primary" />
                                </div>
                                <p className="ml-4 text-base text-gray-700">Exceptional Customer Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
