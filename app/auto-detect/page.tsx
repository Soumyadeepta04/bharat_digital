"use client";

import { useRouter } from "next/navigation";

export default function AutoDetect() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MGNREGA Report</h1>
              <p className="text-blue-100 text-sm">Auto Detection</p>
            </div>
          </div>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back (पीछे जाएं)
          </button>
        </div>
      </header>

      {/* Orange gradient line */}
      <div className="h-1.5 bg-linear-to-r from-orange-500 to-orange-600 shadow-md"></div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Title */}
          <h2 className="text-4xl font-bold text-blue-900 mb-3 animate-fade-in">
            Finding your state and district...
          </h2>
          <p className="text-2xl text-blue-600 mb-16 font-semibold">
            आपका राज्य और जिला ढूंढा जा रहा है...
          </p>

          {/* Search Icon with Animation */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Multiple pulsing shadow effects */}
              <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
              <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '500ms' }}></div>
              
              {/* Main circle */}
              <div className="relative w-40 h-40 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <svg className="w-20 h-20 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl border-2 border-orange-300 p-8 shadow-xl mb-10">
            <p className="text-blue-700 text-lg mb-3 font-bold">
              Please wait while we detect your location...
            </p>
            <p className="text-blue-600 text-base font-semibold">
              कृपया प्रतीक्षा करें जब हम आपका स्थान निर्धारित करते हैं...
            </p>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center gap-3">
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
            <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-linear-to-r from-blue-900 to-blue-800 text-white py-8 mt-auto shadow-2xl">
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
