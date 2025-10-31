"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Link from "next/link";

interface LatestKpis {
  fin_year: string;
  month: string;
  state_code: string;
  state_name: string;
  district_code: string;
  district_name: string;
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
  created_at: string;
}

interface HistoricalDataPoint {
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
  created_at: string;
}

interface StateAverageDataPoint {
  fin_year: string;
  month: string;
  avg_families_worked: number;
  avg_total_person_days: number;
  avg_on_time_payment_percent: number;
  avg_total_expenditure: number;
  avg_completed_works: number;
  avg_ongoing_works: number;
  avg_hundred_day_completion_rate: number;
  avg_households_completed_100_days: number;
  avg_percent_women: number;
  avg_percent_sc: number;
  avg_percent_st: number;
  created_at: string;
}

interface DashboardData {
  latestKpis: LatestKpis;
  historicalData: HistoricalDataPoint[];
  stateAverageData: StateAverageDataPoint[];
  metadata: {
    financial_year: string;
    district_months_available: number;
    state_months_available: number;
    note: string;
  };
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const districtCode = searchParams.get('districtCode') || '';
  const districtNameParam = searchParams.get('districtName') || '[District Name]';
  const stateNameParam = searchParams.get('stateName') || '[State Name]';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Use data from API if available, otherwise use URL params
  const districtName = dashboardData?.latestKpis.district_name || districtNameParam;
  const stateName = dashboardData?.latestKpis.state_name || stateNameParam;

  useEffect(() => {
    if (districtCode) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtCode]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/dashboard/${districtCode}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { latestKpis, historicalData, stateAverageData } = dashboardData;

  // Hero KPIs - Convert all to numbers
  const familiesWorked = Number(latestKpis.families_worked) || 0;
  const totalWorkDays = Number(latestKpis.total_person_days) || 0;
  const onTimePaymentPercent = Number(latestKpis.on_time_payment_percent) || 0;
  const totalExpenditure = Number(latestKpis.total_expenditure) || 0;

  // Work Status Data
  const completedWorks = Number(latestKpis.completed_works) || 0;
  const ongoingWorks = Number(latestKpis.ongoing_works) || 0;
  
  const workStatusData = [
    { name: 'पूरे हुए', value: completedWorks },
    { name: 'चल रहे हैं', value: ongoingWorks }
  ];

  const WORK_COLORS = ['#10b981', '#f59e0b'];

  // 100-Day Completion Rate
  const hhs100Days = Number(latestKpis.households_completed_100_days) || 0;
  const completion100Percent = familiesWorked > 0 ? (hhs100Days / familiesWorked) * 100 : 0;

  const percentWomen = Number(latestKpis.percent_women) || 0;
  const percentSC = Number(latestKpis.percent_sc) || 0;
  const percentST = Number(latestKpis.percent_st) || 0;

  const inclusivityData = [
    { category: 'महिलाएँ (Women)', percent: Number(percentWomen.toFixed(1)), fill: '#ec4899' },
    { category: 'SC', percent: Number(percentSC.toFixed(1)), fill: '#8b5cf6' },
    { category: 'ST', percent: Number(percentST.toFixed(1)), fill: '#06b6d4' }
  ];

  // Transform historical data for chart
  const chartData = historicalData.slice(0, 12).reverse().map((districtPoint) => {
    const statePoint = stateAverageData.find(
      s => s.fin_year === districtPoint.fin_year && s.month === districtPoint.month
    );
    
    // Handle undefined month gracefully
    const monthAbbr = districtPoint.month ? districtPoint.month.substring(0, 3) : 'N/A';
    
    return {
      month: monthAbbr,
      district: Number(districtPoint.total_person_days) || 0,
      stateAvg: Number(statePoint?.avg_total_person_days) || 0
    };
  });

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
        
        {/* Data Freshness Indicator */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900">Last Updated | आखिरी अपडेट</p>
              <p className="text-sm text-gray-700">
                {latestKpis.fin_year} - {latestKpis.month} 
                {latestKpis.created_at && (
                  <span className="ml-2 text-gray-600">
                    ({new Date(latestKpis.created_at).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })})
                  </span>
                )}
              </p>
            </div>
          </div>
          <Link href="/help">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-medium flex items-center gap-2 cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Help | मदद
            </button>
          </Link>
        </div>
        
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
                  <div className="relative group/tooltip">
                    <svg className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-help transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                      Number of families that received employment. Higher = Better!
                      <br />
                      <span className="text-gray-300">काम पाने वाले परिवारों की संख्या। ज्यादा = अच्छा!</span>
                    </div>
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
                  <div className="relative group/tooltip">
                    <svg className="w-5 h-5 text-gray-400 hover:text-purple-600 cursor-help transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                      Total employment days provided. 1 person working 100 days = 100 person-days.
                      <br />
                      <span className="text-gray-300">कुल रोजगार के दिन। 1 व्यक्ति 100 दिन = 100 व्यक्ति-दिवस।</span>
                    </div>
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
                  <div className="relative group/tooltip">
                    <svg className="w-5 h-5 text-gray-400 hover:text-green-600 cursor-help transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                      Percentage of wages paid within 15 days. Higher = Better!
                      <br />
                      <span className="text-gray-300">15 दिनों में भुगतान का प्रतिशत। ज्यादा = अच्छा!</span>
                    </div>
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
                  <div className="relative group/tooltip">
                    <svg className="w-5 h-5 text-gray-400 hover:text-orange-600 cursor-help transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="absolute right-0 top-8 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                      Total expenditure on wages and materials in the district.
                      <br />
                      <span className="text-gray-300">जिले में मजदूरी और सामग्री पर कुल खर्च।</span>
                    </div>
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
                  <p className="text-xl font-black text-gray-700">{familiesWorked.toLocaleString('en-IN')}</p>
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
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
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

export default function DistrictDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
