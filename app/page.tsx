"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <div>
              <div className="text-orange-600 font-bold text-lg">भारत सरकार</div>
              <div className="text-blue-700 text-sm font-semibold">Government of India</div>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all cursor-pointer transform hover:scale-105">
            MGNREGA
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -z-10"></div>
          <h1 className="text-5xl font-bold text-blue-900 mb-4 animate-fade-in">स्वागत है | Welcome</h1>
          <h2 className="text-2xl text-orange-600 font-bold mb-2">
            Mahatma Gandhi National Rural Employment Guarantee Act
          </h2>
          <p className="text-lg text-blue-600 font-semibold">महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम</p>
        </div>

        {/* Two Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* District Finder Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
            <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">District Finder</h3>
                  <p className="text-sm text-orange-100">जिला खोजें</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-center text-gray-700 mb-2 font-medium">
                Find your district to access local MGNREGA reports and services
              </p>
              <p className="text-center text-blue-600 text-sm mb-8">
                स्थानीय रिपोर्ट और सेवाओं तक पहुंच पाने के लिए अपना जिला खोजें
              </p>
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
              </div>
              <Link href="/auto-detect">
                <button className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transition-all mb-3 cursor-pointer transform hover:scale-105">
                  Automatically Detect | स्वचालित रूप से पता लगाएं
                </button>
              </Link>
              <Link href="/district-finder">
                <button className="w-full border-2 border-orange-500 text-orange-600 py-3.5 rounded-xl font-bold hover:bg-orange-50 transition-all cursor-pointer transform hover:scale-105">
                  Select Manually | मैन्युअल रूप से चुनें
                </button>
              </Link>
            </div>
          </div>

          {/* About Portal Card */}
          <div className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
            <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-xl">About Portal</h3>
                  <p className="text-sm text-blue-100">पोर्टल के बारे में</p>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-linear-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl">📢</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Our Voice, Our Rights</h4>
                  <p className="text-sm text-gray-600">हमारी आवाज, हमारे अधिकार</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl">📊</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Access Reports</h4>
                  <p className="text-sm text-gray-600">रिपोर्ट तक पहुंचें</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-linear-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 hover:shadow-md transition-all cursor-pointer">
                <span className="text-3xl">📈</span>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Track Implementation</h4>
                  <p className="text-sm text-gray-600">कार्यान्वयन को ट्रैक करें</p>
                </div>
              </div>
              <div className="mt-6 p-5 bg-linear-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl shadow-sm">
                <p className="text-sm text-center text-gray-800 font-semibold">
                  A transparent system for rural employment guarantee
                </p>
                <p className="text-xs text-center text-gray-600 mt-2">
                  ग्रामीण रोजगार गारंटी के लिए एक पारदर्शी प्रणाली
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 cursor-pointer border-t-4 border-orange-500">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/>
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">2.5M+</div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Reports</h3>
            <p className="text-sm text-gray-600">रिपोर्ट</p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 cursor-pointer border-t-4 border-blue-500">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">8.5Cr+</div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Workers</h3>
            <p className="text-sm text-gray-600">श्रमिक</p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 cursor-pointer border-t-4 border-orange-500">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">45K+</div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Projects</h3>
            <p className="text-sm text-gray-600">परियोजनाएं</p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center transform hover:-translate-y-2 cursor-pointer border-t-4 border-blue-500">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">750+</div>
            <h3 className="font-bold text-gray-900 mb-1 text-lg">Districts</h3>
            <p className="text-sm text-gray-600">जिले</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-linear-to-r from-blue-900 to-blue-800 text-white py-8 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">© भारत सरकार | Government of India</p>
              <p className="text-sm text-blue-200">Ministry of Rural Development</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
