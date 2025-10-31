"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DistrictData {
  district_code: string;
  district_name: string;
  state_name: string;
  fin_year: string;
  month: string;
  families_worked: number;
  total_person_days: number;
  on_time_payment_percent: number;
  total_expenditure: number;
  completed_works: number;
  ongoing_works: number;
  hundred_day_completion_rate: number;
  households_completed_100_days: number;
  percent_women: number;
  percent_sc: number;
  percent_st: number;
}

interface CompareData {
  district1: DistrictData;
  district2: DistrictData;
}

export default function ComparePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  
  const [states, setStates] = useState<Array<{state_code: string; state_name: string}>>([]);
  const [districts1, setDistricts1] = useState<Array<{district_code: string; district_name: string}>>([]);
  const [districts2, setDistricts2] = useState<Array<{district_code: string; district_name: string}>>([]);
  
  const [selectedState1, setSelectedState1] = useState("");
  const [selectedDistrict1, setSelectedDistrict1] = useState("");
  const [selectedState2, setSelectedState2] = useState("");
  const [selectedDistrict2, setSelectedDistrict2] = useState("");

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
    }
  };

  const fetchDistricts = async (stateCode: string, forDistrict: 1 | 2) => {
    try {
      const response = await fetch(`/api/districts/${stateCode}`);
      const data = await response.json();
      if (data.success) {
        if (forDistrict === 1) {
          setDistricts1(data.data);
        } else {
          setDistricts2(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleCompare = async () => {
    if (!selectedDistrict1 || !selectedDistrict2) {
      alert("कृपया दोनों जिले चुनें | Please select both districts");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/compare?d1=${selectedDistrict1}&d2=${selectedDistrict2}`);
      const data = await response.json();
      
      if (data.success) {
        setCompareData(data.data);
      } else {
        setError(data.error || 'Failed to compare districts');
      }
    } catch (err) {
      console.error('Error comparing districts:', err);
      setError('Failed to load comparison data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format numbers
  const formatNumber = (num: number) => {
    const n = Number(num);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    if (n >= 1000) return n.toLocaleString('en-IN');
    return n.toString();
  };

  // Prepare comparison data for charts
  const getComparisonChartData = () => {
    if (!compareData) return [];
    
    const d1 = compareData.district1;
    const d2 = compareData.district2;
    
    return [
      {
        metric: 'Families Worked',
        [d1.district_name]: Number(d1.families_worked) || 0,
        [d2.district_name]: Number(d2.families_worked) || 0,
      },
      {
        metric: 'Person Days',
        [d1.district_name]: Number(d1.total_person_days) || 0,
        [d2.district_name]: Number(d2.total_person_days) || 0,
      },
      {
        metric: 'Completed Works',
        [d1.district_name]: Number(d1.completed_works) || 0,
        [d2.district_name]: Number(d2.completed_works) || 0,
      },
      {
        metric: 'Ongoing Works',
        [d1.district_name]: Number(d1.ongoing_works) || 0,
        [d2.district_name]: Number(d2.ongoing_works) || 0,
      },
    ];
  };

  // Prepare radar chart data for inclusivity
  const getInclusivityRadarData = () => {
    if (!compareData) return [];
    
    const d1 = compareData.district1;
    const d2 = compareData.district2;
    
    return [
      {
        metric: 'Women %',
        [d1.district_name]: Number(d1.percent_women) || 0,
        [d2.district_name]: Number(d2.percent_women) || 0,
      },
      {
        metric: 'SC %',
        [d1.district_name]: Number(d1.percent_sc) || 0,
        [d2.district_name]: Number(d2.percent_sc) || 0,
      },
      {
        metric: 'ST %',
        [d1.district_name]: Number(d1.percent_st) || 0,
        [d2.district_name]: Number(d2.percent_st) || 0,
      },
      {
        metric: 'On-Time Pay %',
        [d1.district_name]: Number(d1.on_time_payment_percent) || 0,
        [d2.district_name]: Number(d2.on_time_payment_percent) || 0,
      },
      {
        metric: '100-Day Rate %',
        [d1.district_name]: Number(d1.hundred_day_completion_rate) || 0,
        [d2.district_name]: Number(d2.hundred_day_completion_rate) || 0,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Compare Districts</h1>
              <p className="text-blue-100 text-sm">जिलों की तुलना करें</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Selection Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Select Two Districts to Compare | तुलना के लिए दो जिले चुनें
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* District 1 Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-blue-700 border-b-2 border-blue-300 pb-2">
                First District | पहला जिला
              </h3>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State | राज्य</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 font-medium"
                  value={selectedState1}
                  onChange={(e) => {
                    setSelectedState1(e.target.value);
                    setSelectedDistrict1("");
                    if (e.target.value) fetchDistricts(e.target.value, 1);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={`state1-${state.state_code}`} value={state.state_code}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">District | जिला</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-white text-gray-900 font-medium disabled:text-gray-500"
                  value={selectedDistrict1}
                  onChange={(e) => setSelectedDistrict1(e.target.value)}
                  disabled={!selectedState1}
                >
                  <option value="">Select District</option>
                  {districts1.map((district) => (
                    <option key={`district1-${district.district_code}`} value={district.district_code}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* VS Separator */}
            <div className="hidden md:flex items-center justify-center">
              <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-black">VS</span>
              </div>
            </div>

            {/* District 2 Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-orange-700 border-b-2 border-orange-300 pb-2">
                Second District | दूसरा जिला
              </h3>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State | राज्य</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900 font-medium"
                  value={selectedState2}
                  onChange={(e) => {
                    setSelectedState2(e.target.value);
                    setSelectedDistrict2("");
                    if (e.target.value) fetchDistricts(e.target.value, 2);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={`state2-${state.state_code}`} value={state.state_code}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">District | जिला</label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 bg-white text-gray-900 font-medium disabled:text-gray-500"
                  value={selectedDistrict2}
                  onChange={(e) => setSelectedDistrict2(e.target.value)}
                  disabled={!selectedState2}
                >
                  <option value="">Select District</option>
                  {districts2.map((district) => (
                    <option key={`district2-${district.district_code}`} value={district.district_code}>
                      {district.district_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Compare Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handleCompare}
              disabled={!selectedDistrict1 || !selectedDistrict2 || loading}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Comparing... | तुलना हो रही है..." : "Compare Districts | जिलों की तुलना करें"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center">
            <p className="text-red-700 font-bold text-lg">{error}</p>
          </div>
        )}

        {/* Comparison Results */}
        {compareData && (
          <>
            {/* District Headers */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{compareData.district1.district_name}</h3>
                <p className="text-blue-100">{compareData.district1.state_name}</p>
                <p className="text-sm text-blue-200 mt-2">Data: {compareData.district1.month} {compareData.district1.fin_year}</p>
              </div>
              <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold mb-2">{compareData.district2.district_name}</h3>
                <p className="text-orange-100">{compareData.district2.state_name}</p>
                <p className="text-sm text-orange-200 mt-2">Data: {compareData.district2.month} {compareData.district2.fin_year}</p>
              </div>
            </div>

            {/* Key Metrics Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Key Performance Indicators | मुख्य प्रदर्शन संकेतक
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Families Worked */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Families Worked | परिवार</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-700">{Number(compareData.district1.families_worked).toLocaleString('en-IN')}</p>
                    <p className="text-lg font-bold text-orange-700">{Number(compareData.district2.families_worked).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Person Days */}
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Person Days | व्यक्ति-दिवस</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-700">{Number(compareData.district1.total_person_days).toLocaleString('en-IN')}</p>
                    <p className="text-lg font-bold text-orange-700">{Number(compareData.district2.total_person_days).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Expenditure */}
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold mb-2">Expenditure | खर्च</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-700">{formatNumber(Number(compareData.district1.total_expenditure))}</p>
                    <p className="text-lg font-bold text-orange-700">{formatNumber(Number(compareData.district2.total_expenditure))}</p>
                  </div>
                </div>

                {/* On-Time Payment */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-semibold mb-2">On-Time Payment | समय पर</p>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-blue-700">{Number(compareData.district1.on_time_payment_percent).toFixed(1)}%</p>
                    <p className="text-lg font-bold text-orange-700">{Number(compareData.district2.on_time_payment_percent).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Performance Comparison | प्रदर्शन तुलना
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getComparisonChartData()} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="metric" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fill: '#374151', fontWeight: 'bold', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: '#374151', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 'bold'
                    }}
                    formatter={(value: number) => value.toLocaleString('en-IN')}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                  <Bar dataKey={compareData.district1.district_name} fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey={compareData.district2.district_name} fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Inclusivity Radar Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Inclusivity & Efficiency Metrics | समावेशिता और दक्षता
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={getInclusivityRadarData()}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#374151', fontWeight: 'bold', fontSize: 12 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
                  <Radar 
                    name={compareData.district1.district_name} 
                    dataKey={compareData.district1.district_name} 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Radar 
                    name={compareData.district2.district_name} 
                    dataKey={compareData.district2.district_name} 
                    stroke="#f97316" 
                    fill="#f97316" 
                    fillOpacity={0.5}
                    strokeWidth={2}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 'bold'
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Works Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">{compareData.district1.district_name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed Works</span>
                    <span className="font-bold text-green-600">{Number(compareData.district1.completed_works).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ongoing Works</span>
                    <span className="font-bold text-yellow-600">{Number(compareData.district1.ongoing_works).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">100-Day Completion</span>
                    <span className="font-bold text-blue-600">{Number(compareData.district1.hundred_day_completion_rate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-800 mb-4">{compareData.district2.district_name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed Works</span>
                    <span className="font-bold text-green-600">{Number(compareData.district2.completed_works).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ongoing Works</span>
                    <span className="font-bold text-yellow-600">{Number(compareData.district2.ongoing_works).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">100-Day Completion</span>
                    <span className="font-bold text-blue-600">{Number(compareData.district2.hundred_day_completion_rate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-linear-to-r from-blue-900 to-blue-800 text-white py-8 mt-16 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.72c0 4.33-2.99 8.38-8 9.5-5.01-1.12-8-5.17-8-9.5V7.78l8-3.6z"/>
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
