import Link from 'next/link';
import { Menu, Search, User } from 'lucide-react';
import Image from 'next/image';

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: "What's New", href: '#new' },
    { label: 'Mens', href: '#mens' },
    { label: 'Women', href: '#women' },
    { label: 'Drop 25.25', href: '#drop' },
    { label: 'Bridal 2025', href: '#bridal' },
    { label: 'Chaayal Bespoke', href: '#bespoke' },
    { label: 'Celebrity Closet', href: '#celebrity' },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-primary shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="hidden md:flex items-center gap-2 border rounded-2xl border-gray-300 px-4 py-2">
                        <Search className="h-4 w-4 text-white" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent text-sm text-white placeholder:text-white  focus:outline-none"
                        />
                    </div>

                    <div className="flex-1 flex md:flex-none justify-center text-center">
                        <Link href="/" className="leading-tight">
                          <Image src="/chaayal.png" alt="Chaayal" width={70} height={70} />
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hidden md:inline-flex items-center text-sm font-medium text-white hover:text-white transition">
                            <User className="h-4 w-4 mr-2" />
                            Sign In
                        </button>
                        <button className="md:hidden text-gray-900">
                            <Search className="h-5 w-5" />
                        </button>
                        <button className="text-gray-900 md:hidden">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            <nav className="border-b border-gray-200 bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-sm h-12">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`uppercase tracking-[0.2em] ${
                                    link.label === 'Home'
                                        ? 'text-white border-b-2 border-white'
                                        : 'text-white hover:text-white'
                                } text-[12px] font-medium h-full flex items-center`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
