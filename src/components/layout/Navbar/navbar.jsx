import { useState } from "react";

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
);
const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);
// Hamburger / filter icon for mobile
const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
    </svg>
);

// Props:
//   onOpenSidebar — called when mobile filter button is tapped
export default function Navbar({ onOpenSidebar }) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <div className="font-sans">
            {/* Promo Banner */}
            <div className="bg-[#1A3A5C] text-white flex items-center justify-between px-4 py-2.5 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#E07B39] rounded flex items-center justify-center text-white font-bold text-xs">🐟</div>
                    <span className="font-medium">Download the App and Get FLAT 20% Off + Free Delivery on 1st Order</span>
                </div>
                <div className="flex items-center gap-6">
                    <button className="bg-white text-[#1A3A5C] font-semibold px-5 py-1.5 rounded-full text-sm hover:bg-gray-100 transition-colors">
                        Download
                    </button>
                    <button className="flex items-center gap-1.5 underline underline-offset-2 text-white hover:text-gray-200 transition-colors">
                        <LocationIcon />
                        <span>Select Your Location</span>
                        <ChevronDownIcon />
                    </button>
                </div>
            </div>

            {/* Main Navbar */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">

                    {/* Mobile: filter trigger */}
                    <button
                        onClick={onOpenSidebar}
                        className="md:hidden flex items-center gap-1.5 text-gray-600 hover:text-[#1A3A5C] transition-colors"
                    >
                        <FilterIcon />
                    </button>

                    {/* Logo */}
                    <a href="#" className="flex-shrink-0">
                        <span className="text-2xl font-black tracking-tight select-none">
                            <span className="text-[#1A3A5C]">dry</span>
                            <span className="text-[#E07B39]">fish</span>
                            <span className="text-[#1A3A5C]">.co</span>
                        </span>
                    </a>

                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Search for premium dry fish products"
                            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/30 focus:border-[#1A3A5C] transition-all"
                        />
                    </div>

                    {/* Nav Actions */}
                    <nav className="flex items-center gap-6">
                        <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#1A3A5C] transition-colors">
                            <ShoppingBagIcon />
                            <span className="text-xs font-medium">Shop</span>
                        </button>
                        <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#1A3A5C] transition-colors">
                            <div className="relative">
                                <span className="text-xl font-black leading-none">🐠</span>
                                <span className="absolute -top-1 -right-2 text-[10px] font-bold text-[#E07B39]">+</span>
                            </div>
                            <span className="text-xs font-medium">Fish Plus</span>
                        </button>
                        <button className="flex flex-col items-center gap-0.5 text-gray-700 hover:text-[#1A3A5C] transition-colors">
                            <UserIcon />
                            <span className="text-xs font-medium">Account</span>
                        </button>
                    </nav>
                </div>
            </header>
        </div>
    );
}