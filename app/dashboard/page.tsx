"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function DistrictDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const stateName = searchParams.get('state') || '[State Name]';
  const districtName = searchParams.get('district') || '[District Name]';

  // Mock data - Replace with actual API data
  const mockData = {
    Total_Households_Worked: "25000",
    Total_Exp: "50000000",
    percentage_payments_gererated_within_15_days: "85",
    Number_of_Completed_Works: "450",
    Number_of_Ongoing_Works: "150",
    Total_No_of_HHs_completed_100_Days: "5000",
    Women_Persondays: "800000",
    SC_persondays: "300000",
    ST_persondays: "200000",
  };

  // Calculate Total Person Days (assuming 50 days average per household)
  const totalHouseholdsWorked = parseFloat(mockData.Total_Households_Worked) || 0;
  const totalPersonDays = totalHouseholdsWorked * 50; // This should come from actual data

  // Hero KPIs
  const familiesWorked = parseFloat(mockData.Total_Households_Worked) || 0;
  const totalWorkDays = totalPersonDays;
  const onTimePaymentPercent = parseFloat(mockData.percentage_payments_gererated_within_15_days) || 0;
  const totalExpenditure = parseFloat(mockData.Total_Exp) || 0;

  // Work Status Data
  const completedWorks = parseFloat(mockData.Number_of_Completed_Works) || 0;
  const ongoingWorks = parseFloat(mockData.Number_of_Ongoing_Works) || 0;
  
  const workStatusData = [
    { name: 'पूरे हुए', value: completedWorks },
    { name: 'चल रहे हैं', value: ongoingWorks }
  ];

  const WORK_COLORS = ['#10b981', '#f59e0b'];

  // 100-Day Completion Rate
  const hhs100Days = parseFloat(mockData.Total_No_of_HHs_completed_100_Days) || 0;
  const completion100Percent = totalHouseholdsWorked > 0 ? (hhs100Days / totalHouseholdsWorked) * 100 : 0;

  // Inclusivity Data
  const womenDays = parseFloat(mockData.Women_Persondays) || 0;
  const scDays = parseFloat(mockData.SC_persondays) || 0;
  const stDays = parseFloat(mockData.ST_persondays) || 0;

  const percentWomen = totalPersonDays > 0 ? (womenDays / totalPersonDays) * 100 : 0;
  const percentSC = totalPersonDays > 0 ? (scDays / totalPersonDays) * 100 : 0;
  const percentST = totalPersonDays > 0 ? (stDays / totalPersonDays) * 100 : 0;

  const inclusivityData = [
    { category: 'महिलाएँ (Women)', percent: parseFloat(percentWomen.toFixed(1)), fill: '#ec4899' },
    { category: 'SC', percent: parseFloat(percentSC.toFixed(1)), fill: '#8b5cf6' },
    { category: 'ST', percent: parseFloat(percentST.toFixed(1)), fill: '#06b6d4' }
  ];

  // Historical Chart Data (Mock - Last 12 months)
  const historicalData = [
    { month: "Apr", district: 85000, stateAvg: 65000 },
    { month: "May", district: 92000, stateAvg: 70000 },
    { month: "Jun", district: 88000, stateAvg: 68000 },
    { month: "Jul", district: 95000, stateAvg: 72000 },
    { month: "Aug", district: 98000, stateAvg: 75000 },
    { month: "Sep", district: 105000, stateAvg: 78000 },
    { month: "Oct", district: 110000, stateAvg: 80000 },
    { month: "Nov", district: 115000, stateAvg: 82000 },
    { month: "Dec", district: 120000, stateAvg: 85000 },
    { month: "Jan", district: 125000, stateAvg: 88000 },
    { month: "Feb", district: 118000, stateAvg: 86000 },
    { month: "Mar", district: 122000, stateAvg: 87000 },
  ];

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return num.toLocaleString('en-IN');
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 3.6v8.72c0 4.33-2.99 8.38-8 9.5-5.01-1.12-8-5.17-8-9.5V7.78l8-3.6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MGNREGA Dashboard</h1>
              <p className="text-blue-100 text-sm">मनरेगा डैशबोर्ड</p>
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
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-3 rounded-lg shadow-sm">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span className="font-medium">{stateName}</span>
          <span>›</span>
          <span className="font-bold text-blue-700">{districtName}</span>
        </div>

        {/* District Title */}
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-blue-900 mb-1">
            {districtName} District Performance
          </h2>
          <p className="text-lg text-orange-600 font-semibold">{districtName} जिले का प्रदर्शन</p>
        </div>

        {/* Section 1: काम मिला? (Did We Get Work?) - 4 Hero Cards */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">काम मिला?</h3>
              <p className="text-gray-600 font-medium text-sm">Did We Get Work?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Families Who Got Work */}
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">परिवारों को काम</p>
                  <p className="text-xs text-gray-500 font-medium">Families Who Got Work</p>
                  <p className="text-3xl font-black text-gray-900">{familiesWorked.toLocaleString('en-IN')}</p>
                  <div className="pt-2 border-t border-gray-100 mt-3">
                    <p className="text-xs text-gray-500">परिवार | Families</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Total Days of Work */}
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">कुल दिन काम</p>
                  <p className="text-xs text-gray-500 font-medium">Total Days of Work Given</p>
                  <p className="text-3xl font-black text-gray-900">{totalWorkDays.toLocaleString('en-IN')}</p>
                  <div className="pt-2 border-t border-gray-100 mt-3">
                    <p className="text-xs text-gray-500">व्यक्ति-दिवस | Person-Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: On-Time Payments */}
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">समय पर भुगतान</p>
                  <p className="text-xs text-gray-500 font-medium">On-Time Payments</p>
                  <p className="text-3xl font-black text-gray-900">{onTimePaymentPercent.toFixed(1)}%</p>
                  <div className="pt-2 mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${onTimePaymentPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Total Money Spent */}
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">कुल खर्च</p>
                  <p className="text-xs text-gray-500 font-medium">Total Money Spent</p>
                  <p className="text-3xl font-black text-gray-900">{formatNumber(totalExpenditure)}</p>
                  <div className="pt-2 border-t border-gray-100 mt-3">
                    <p className="text-xs text-gray-500">रुपये | Rupees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: काम पूरा हुआ? (Is the Work Done?) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Status Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">काम का स्टेटस</h3>
                <p className="text-gray-600 font-medium text-sm">Work Status</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={workStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {workStatusData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={WORK_COLORS[index % WORK_COLORS.length]}
                        stroke="#fff"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #e5e7eb', 
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontWeight: 'bold'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-xs font-bold text-gray-700">पूरे हुए</p>
                </div>
                <p className="text-2xl font-black text-green-700">{completedWorks}</p>
                <p className="text-xs text-gray-500 mt-1">Completed Works</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <p className="text-xs font-bold text-gray-700">चल रहे हैं</p>
                </div>
                <p className="text-2xl font-black text-amber-700">{ongoingWorks}</p>
                <p className="text-xs text-gray-500 mt-1">Ongoing Works</p>
              </div>
            </div>
          </div>

          {/* 100-Day Completion Rate */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-linear-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">100-दिन पूरा</h3>
                <p className="text-gray-600 font-medium text-sm">100-Day Completion</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - completion100Percent / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900">{completion100Percent.toFixed(1)}%</span>
                  <span className="text-xs text-gray-500 font-medium mt-1">Completion</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xl font-black text-blue-700">{hhs100Days.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">पूरे किए<br/>Completed</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xl font-black text-gray-700">{totalHouseholdsWorked.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-600 font-medium mt-1">कुल परिवार<br/>Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: क्या यह सबके लिए है? (Is it Fair for Everyone?) */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">क्या यह सबके लिए है?</h3>
              <p className="text-gray-600 font-medium text-sm">Is it Fair for Everyone?</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={inclusivityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: '#374151', fontWeight: 'bold', fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold', fill: '#374151' } }}
                tick={{ fill: '#374151', fontWeight: 'bold' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontWeight: 'bold'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Participation']}
              />
              <Bar dataKey="percent" radius={[8, 8, 0, 0]} maxBarSize={100}>
                {inclusivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-700">महिलाएँ</p>
              </div>
              <p className="text-xl font-black text-pink-700">{percentWomen.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Women</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-700">SC</p>
              </div>
              <p className="text-xl font-black text-purple-700">{percentSC.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Scheduled Caste</p>
            </div>
            <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <p className="text-xs font-bold text-gray-700">ST</p>
              </div>
              <p className="text-xl font-black text-cyan-700">{percentST.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Scheduled Tribe</p>
            </div>
          </div>
        </div>

        {/* Historical Trend: District vs State Average */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">प्रदर्शन रुझान - 12 महीने</h3>
              <p className="text-gray-600 font-medium text-sm">Performance Trend - Last 12 Months</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicalData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#374151', fontWeight: 'bold', fontSize: 11 }}
              />
              <YAxis 
                tick={{ fill: '#374151', fontWeight: 'bold', fontSize: 10 }}
                width={60}
              />
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
              <Legend 
                wrapperStyle={{ paddingTop: '15px', fontWeight: 'bold' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="district" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name={`${districtName} District`}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="stateAvg" 
                stroke="#10b981" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name={`${stateName} State Avg`}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-5 h-1 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-bold text-gray-700">{districtName} District</p>
                <p className="text-xs text-gray-500">{districtName} जिला</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-5 h-1 bg-green-500 rounded-full border border-green-500" style={{ borderStyle: 'dashed' }}></div>
              <div>
                <p className="text-sm font-bold text-gray-700">{stateName} State Avg</p>
                <p className="text-xs text-gray-500">{stateName} राज्य औसत</p>
              </div>
            </div>
          </div>
        </div>

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
