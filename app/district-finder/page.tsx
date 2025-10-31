"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface State {
  state_code: string;
  state_name: string;
}

interface District {
  district_code: string;
  district_name: string;
}

export default function DistrictFinder() {
  const router = useRouter();
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Fetch states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/states');
      const data = await response.json();
      if (data.success) {
        setStates(data.data);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      alert('Failed to load states. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (stateCode: string) => {
    setLoadingDistricts(true);
    try {
      const response = await fetch(`/api/districts/${stateCode}`);
      const data = await response.json();
      if (data.success) {
        setDistricts(data.data);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      alert('Failed to load districts. Please try again.');
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const state = states.find(s => s.state_code === stateCode);
    
    setSelectedStateCode(stateCode);
    setSelectedState(state?.state_name || "");
    setSelectedDistrict("");
    setSelectedDistrictCode("");
    setDistricts([]);
    
    if (stateCode) {
      fetchDistricts(stateCode);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtCode = e.target.value;
    const district = districts.find(d => d.district_code === districtCode);
    
    setSelectedDistrictCode(districtCode);
    setSelectedDistrict(district?.district_name || "");
  };

  const handleViewData = () => {
    if (selectedStateCode && selectedDistrictCode) {
      router.push(`/dashboard?districtCode=${encodeURIComponent(selectedDistrictCode)}&districtName=${encodeURIComponent(selectedDistrict)}&stateName=${encodeURIComponent(selectedState)}`);
    } else {
      alert("कृपया राज्य और जिला चुनें | Please select both State and District");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading states...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50">
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
              <p className="text-blue-100 text-sm">District Finder</p>
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

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Choose Your Area Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
          {/* Orange Header */}
          <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white text-center py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg className="w-11 h-11 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Area</h2>
              <p className="text-lg text-orange-100">अपना इलाका चुनें</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-10 space-y-8">
            {/* State Selection */}
            <div>
              <label className="block text-blue-700 font-bold mb-3 text-lg">
                Please Select State <span className="text-sm font-semibold">(कृपया राज्य चुनें)</span>
              </label>
              <select 
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-lg cursor-pointer hover:border-blue-400 transition-all shadow-sm"
                value={selectedStateCode}
                onChange={handleStateChange}
              >
                <option value="">Select State / राज्य चुनें</option>
                {states.map((state) => (
                  <option key={state.state_code} value={state.state_code}>
                    {state.state_name}
                  </option>
                ))}
              </select>
            </div>

            {/* District Selection */}
            <div>
              <label className="block text-blue-700 font-bold mb-3 text-lg">
                Please Select District <span className="text-sm font-semibold">(कृपया जिला चुनें)</span>
              </label>
              <select 
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-lg cursor-pointer hover:border-blue-400 transition-all shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={selectedDistrictCode}
                onChange={handleDistrictChange}
                disabled={!selectedStateCode || loadingDistricts}
              >
                <option value="">
                  {loadingDistricts ? "Loading districts..." : "Select District / जिला चुनें"}
                </option>
                {districts.map((district) => (
                  <option key={district.district_code} value={district.district_code}>
                    {district.district_name}
                  </option>
                ))}
              </select>
              {loadingDistricts && (
                <div className="mt-2 flex items-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Loading districts...</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            <div className="text-orange-600 text-sm font-semibold px-2">
              {!selectedStateCode 
                ? "Please select a state first | पहले राज्य चुनें फिर जिला चुनें"
                : !selectedDistrictCode
                ? "Now select a district | अब जिला चुनें"
                : ""}
            </div>

            {/* View Data Button */}
            <button 
              onClick={handleViewData}
              disabled={!selectedStateCode || !selectedDistrictCode}
              className="w-full bg-linear-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              View Data | डेटा देखें
            </button>

            {/* Info Box */}
            <div className="bg-linear-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-center shadow-sm">
              <p className="text-blue-900 text-sm font-bold mb-2">
                Select your state and district to access MGNREGA reports and data
              </p>
              <p className="text-blue-700 text-xs">
                अपने राज्य और जिले का चयन करें और MGNREGA रिपोर्ट और डेटा तक पहुंच प्राप्त करें
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border-l-4 border-blue-500">
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Quick Access</h3>
            <p className="text-sm text-blue-700 mb-3 font-semibold">त्वरित पहुँच</p>
            <p className="text-sm text-gray-600">
              Get instant access to employment records and project details
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer border-l-4 border-orange-500">
            <h3 className="font-bold text-gray-900 mb-2 text-xl">Transparent Data</h3>
            <p className="text-sm text-blue-700 mb-3 font-semibold">पारदर्शी डेटा</p>
            <p className="text-sm text-gray-600">
              View authentic and up-to-date information for your region
            </p>
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
