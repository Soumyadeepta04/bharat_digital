"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AutoDetect() {
  const router = useRouter();
  const [status, setStatus] = useState("detecting");
  const [error, setError] = useState<string | null>(null);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const [nearbyOptions, setNearbyOptions] = useState<any[]>([]);
  const [showNearbyChoice, setShowNearbyChoice] = useState(false);

  useEffect(() => {
    detectLocation();
  }, []);

  // Calculate string similarity (Levenshtein-based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    // Check if one contains the other
    if (longer.includes(shorter)) return 0.8;
    if (shorter.includes(longer)) return 0.8;
    
    // Calculate edit distance
    const editDistance = getEditDistance(str1, str2);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleNearbyChoice = (useNearby: boolean) => {
    if (useNearby && nearbyOptions.length > 0) {
      // Use the most similar district (first in sorted array)
      const bestMatch = nearbyOptions[0];
      console.log('User chose nearby district:', bestMatch);
      
      setShowNearbyChoice(false);
      setStatus("loading");
      setDetectedLocation(`Loading ${bestMatch.district_name} dashboard...`);
      
      setTimeout(() => {
        const dashboardUrl = `/dashboard?districtCode=${bestMatch.district_code}&districtName=${encodeURIComponent(bestMatch.district_name)}&stateName=${encodeURIComponent(detectedLocation.split(', ')[1] || '')}`;
        console.log('Navigating to nearby district:', dashboardUrl);
        router.push(dashboardUrl);
      }, 1000);
    } else {
      // User wants manual selection
      console.log('User chose manual selection');
      setShowNearbyChoice(false);
      router.push('/district-finder');
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by your browser | आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        console.log('GPS Coordinates:', { latitude, longitude });
        
        try {
          // Step 1: Get location from coordinates
          setStatus("detecting");
          setDetectedLocation("Getting your location...");
          
          // Try multiple geocoding services for better accuracy
          let state = '';
          let district = '';
          
          try {
            // Try different zoom levels for better accuracy
            const zoomLevels = [14, 12, 10]; // Higher zoom first for more precise location
            let nominatimData: any = null;
            
            for (const zoom of zoomLevels) {
              console.log(`Trying Nominatim with zoom level ${zoom}...`);
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en&zoom=${zoom}`,
                {
                  headers: {
                    'Accept-Language': 'en',
                    'User-Agent': 'MGNREGA-Tracker'
                  }
                }
              );
              const data = await response.json();
              
              console.log(`Zoom ${zoom} response:`, data);
              
              // Check if we got a district-level result
              if (data.address?.state_district || data.address?.county) {
                nominatimData = data;
                console.log('Found district-level data at zoom', zoom);
                break;
              }
              
              // Store the data anyway as fallback
              if (!nominatimData) nominatimData = data;
            }
            
            console.log('Final Nominatim Response:', nominatimData);
            console.log('Address Details:', nominatimData.address);
            
            state = nominatimData.address?.state || '';
            
            // FIRST: Check if we're in Kolkata metro area using GPS coordinates
            // This overrides API results for better accuracy
            const cityName = nominatimData.address?.city || nominatimData.address?.state_district || nominatimData.address?.county || '';
            const isKolkataMetro = cityName.toLowerCase().includes('kolkata') || 
                                   (latitude >= 22.3 && latitude <= 22.8 && longitude >= 88.0 && longitude <= 88.5);
            
            if (isKolkataMetro) {
              console.log('Kolkata metro area detected! Using GPS coordinates for precise district...');
              console.log(`GPS: Latitude ${latitude}, Longitude ${longitude}`);
              
              // Howrah district boundaries (west of Hooghly River)
              if (longitude < 88.36) {
                district = 'Howrah';
                console.log('✅ GPS indicates HOWRAH district (west of Hooghly River)');
              }
              // North 24 Parganas (north of Kolkata)
              else if (latitude > 22.65 && longitude >= 88.36) {
                district = '24 Parganas (North)';
                console.log('✅ GPS indicates North 24 Parganas');
              }
              // South 24 Parganas (south of Kolkata)
              else if (latitude < 22.47 && longitude >= 88.36) {
                district = '24 Parganas South';
                console.log('✅ GPS indicates South 24 Parganas');
              }
              // Central Kolkata area - default to Howrah as nearest rural district
              else {
                district = 'Howrah';
                console.log('✅ Central Kolkata - defaulting to HOWRAH (nearest MGNREGA district)');
              }
            }
            // If NOT Kolkata metro, use API results
            else {
              // Extract district with multiple strategies
              // Priority 1: state_district (most accurate)
              if (nominatimData.address?.state_district) {
                district = nominatimData.address.state_district;
                console.log('Strategy 1 - Found state_district:', district);
              } 
              // Priority 2: county
              else if (nominatimData.address?.county) {
                district = nominatimData.address.county;
                console.log('Strategy 2 - Found county:', district);
              } 
              // Priority 3: city_district
              else if (nominatimData.address?.city_district) {
                district = nominatimData.address.city_district;
                console.log('Strategy 3 - Found city_district:', district);
              }
              // Priority 4: city name
              else if (nominatimData.address?.city) {
                district = nominatimData.address.city;
                console.log('Strategy 4 - Using city name:', district);
              }
              // Priority 5: suburb/municipality
              else {
                district = nominatimData.address?.suburb || 
                          nominatimData.address?.municipality || 
                          nominatimData.address?.town || '';
                console.log('Strategy 5 - Using suburb/municipality:', district);
              }
            }
            
          } catch (geoErr) {
            console.error('Geocoding error:', geoErr);
            throw new Error('Failed to get location details');
          }
          
          // Clean up the names
          state = state.trim();
          district = district.replace(/\s+District$/i, '').trim();
          
          console.log('Final Detected State:', state);
          console.log('Final Detected District:', district);
          
          if (!state || !district) {
            setStatus("error");
            setError("Could not determine your district. Please select manually | आपका जिला निर्धारित नहीं हो सका। कृपया मैन्युअल रूप से चुनें");
            setTimeout(() => router.push('/district-finder'), 3000);
            return;
          }
          
          // Step 2: Show detected location to user
          setStatus("found");
          setDetectedLocation(`${district}, ${state}`);
          
          // Wait a moment for user to see the detected location
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Step 3: Match with database
          setStatus("loading");
          setDetectedLocation(`Loading ${district} dashboard...`);
          
          console.log('========================================');
          console.log('🔍 STARTING DATABASE MATCHING');
          console.log('District to match:', district);
          console.log('State to match:', state);
          console.log('========================================');
          
          console.log('Fetching states from API...');
          const statesResponse = await fetch('/api/states');
          const statesData = await statesResponse.json();
          
          console.log('States API response:', statesData);
          
          if (!statesData.success || !statesData.data) {
            throw new Error('Failed to fetch states from database');
          }
          
          // Find matching state (flexible matching)
          const matchedState = statesData.data.find((s: any) => {
            const dbStateLower = s.state_name.toLowerCase();
            const detectedStateLower = state.toLowerCase();
            
            // Exact match or contains match
            return dbStateLower === detectedStateLower || 
                   dbStateLower.includes(detectedStateLower) ||
                   detectedStateLower.includes(dbStateLower);
          });
          
          if (!matchedState) {
            console.error('State not matched. Available states:', statesData.data.map((s: any) => s.state_name));
            setStatus("error");
            setError(`State "${state}" not found in database. Please select manually | राज्य "${state}" डेटाबेस में नहीं मिला।`);
            setTimeout(() => router.push('/district-finder'), 3000);
            return;
          }
          
          console.log('Matched State:', matchedState);
          
          // Get districts for this state
          console.log('Fetching districts for state code:', matchedState.state_code);
          const districtsResponse = await fetch(`/api/districts/${matchedState.state_code}`);
          const districtsData = await districtsResponse.json();
          
          console.log('Districts API response:', districtsData);
          
          if (!districtsData.success || !districtsData.data) {
            throw new Error('Failed to fetch districts from database');
          }
          
          // Find matching district (flexible matching)
          const matchedDistrict = districtsData.data.find((d: any) => {
            const dbDistrictLower = d.district_name.toLowerCase();
            const detectedDistrictLower = district.toLowerCase();
            
            // Exact match or contains match
            return dbDistrictLower === detectedDistrictLower || 
                   dbDistrictLower.includes(detectedDistrictLower) ||
                   detectedDistrictLower.includes(dbDistrictLower);
          });
          
          if (!matchedDistrict) {
            console.error('District not matched. Detected:', district);
            console.error('Available districts:', districtsData.data.map((d: any) => d.district_name));
            
            // Special city-to-district mapping for major cities
            const cityToDistrictMap: { [key: string]: string[] } = {
              'kolkata': ['HOWRAH', '24 PARGANAS (NORTH)', '24 PARGANAS SOUTH'],
              'delhi': ['NEW DELHI', 'NORTH DELHI', 'SOUTH DELHI', 'EAST DELHI'],
              'mumbai': ['MUMBAI', 'MUMBAI SUBURBAN', 'THANE'],
              'chennai': ['CHENNAI', 'THIRUVALLUR', 'KANCHIPURAM'],
              'bangalore': ['BANGALORE URBAN', 'BANGALORE RURAL'],
              'bengaluru': ['BANGALORE URBAN', 'BANGALORE RURAL'],
              'hyderabad': ['HYDERABAD', 'RANGAREDDY', 'MEDCHAL'],
              'pune': ['PUNE'],
              'ahmedabad': ['AHMEDABAD'],
              'surat': ['SURAT'],
              'jaipur': ['JAIPUR'],
              'lucknow': ['LUCKNOW'],
              'kanpur': ['KANPUR NAGAR', 'KANPUR DEHAT'],
              'nagpur': ['NAGPUR'],
              'indore': ['INDORE'],
              'bhopal': ['BHOPAL'],
              'patna': ['PATNA'],
              'vadodara': ['VADODARA']
            };
            
            // Check if detected location is a known city
            const detectedLower = district.toLowerCase();
            let mappedDistricts: string[] = [];
            
            if (cityToDistrictMap[detectedLower]) {
              mappedDistricts = cityToDistrictMap[detectedLower];
              console.log(`City "${district}" mapped to districts:`, mappedDistricts);
            }
            
            // Find nearby/similar districts as alternatives
            const nearbyDistricts = districtsData.data
              .map((d: any) => {
                let similarity = calculateSimilarity(district.toLowerCase(), d.district_name.toLowerCase());
                
                // Boost similarity if district is in the mapped list
                if (mappedDistricts.length > 0) {
                  if (mappedDistricts.some(mapped => d.district_name.includes(mapped))) {
                    similarity = Math.max(similarity, 0.9); // High priority for mapped districts
                    console.log(`Boosted similarity for ${d.district_name}: ${similarity}`);
                  }
                }
                
                return {
                  ...d,
                  similarity
                };
              })
              .sort((a: any, b: any) => b.similarity - a.similarity)
              .slice(0, 5) // Top 5 most similar
              .filter((d: any) => d.similarity > 0.2); // Lower threshold to 20%
            
            console.log('Nearby/Similar districts:', nearbyDistricts);
            
            if (nearbyDistricts.length > 0) {
              // Show choice to user: Manual selection or use nearby district
              setStatus("found");
              setDetectedLocation(`${district}, ${state}`);
              setNearbyOptions(nearbyDistricts);
              setShowNearbyChoice(true);
              setError(`"${district}" not found in database. Would you like to see data from nearby district? | "${district}" डेटाबेस में नहीं मिला। क्या आप पास के जिले का डेटा देखना चाहेंगे?`);
              return;
            }
            
            // No nearby options found
            setStatus("error");
            setError(`District "${district}" not found in database. Redirecting to select from list... | जिला "${district}" नहीं मिला।`);
            setTimeout(() => {
              router.push(`/district-finder?autoState=${encodeURIComponent(matchedState.state_name)}`);
            }, 3000);
            return;
          }
          
          console.log('Matched District:', matchedDistrict);
          console.log('Redirecting to dashboard with code:', matchedDistrict.district_code);
          
          // Success! Show final location and redirect
          setDetectedLocation(`${matchedDistrict.district_name}, ${matchedState.state_name}`);
          
          setTimeout(() => {
            const dashboardUrl = `/dashboard?districtCode=${matchedDistrict.district_code}&districtName=${encodeURIComponent(matchedDistrict.district_name)}&stateName=${encodeURIComponent(matchedState.state_name)}`;
            console.log('Navigating to:', dashboardUrl);
            router.push(dashboardUrl);
          }, 1500);
          
        } catch (err) {
          console.error('Location detection error:', err);
          setStatus("error");
          setError("Location detection failed. Redirecting to manual selection... | स्थान का पता लगाना विफल रहा।");
          setTimeout(() => router.push('/district-finder'), 3000);
        }
      },
      (err) => {
        setStatus("error");
        if (err.code === 1) {
          setError("Location permission denied. Please select manually | स्थान अनुमति अस्वीकृत। कृपया मैन्युअल रूप से चुनें");
        } else {
          setError("Unable to detect location. Please select manually | स्थान का पता लगाने में असमर्थ। कृपया मैन्युअल रूप से चुनें");
        }
        setTimeout(() => router.push('/district-finder'), 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

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
            {status === "detecting" && "Finding your location..."}
            {status === "found" && "Location Detected!"}
            {status === "loading" && "Loading Dashboard..."}
            {status === "error" && "Location Detection Failed"}
          </h2>
          <p className="text-2xl text-blue-600 mb-4 font-semibold">
            {status === "detecting" && "आपका स्थान ढूंढा जा रहा है..."}
            {status === "found" && "स्थान मिल गया!"}
            {status === "loading" && "डैशबोर्ड लोड हो रहा है..."}
            {status === "error" && "स्थान का पता लगाना विफल"}
          </p>
          {detectedLocation && status !== "error" && (
            <p className="text-xl text-green-600 font-bold mb-12 bg-green-50 py-3 px-6 rounded-lg inline-block border-2 border-green-300">
              📍 {detectedLocation}
            </p>
          )}
          {!detectedLocation && status !== "error" && <div className="mb-12"></div>}

          {/* Search Icon with Animation */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              {/* Multiple pulsing shadow effects */}
              {(status === "detecting" || status === "loading") && (
                <>
                  <div className="absolute inset-0 bg-blue-400 rounded-full opacity-30 animate-ping"></div>
                  <div className="absolute inset-0 bg-orange-400 rounded-full opacity-20 animate-ping" style={{ animationDelay: '500ms' }}></div>
                </>
              )}
              
              {/* Main circle */}
              <div className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl ${
                status === "found" ? "bg-linear-to-br from-green-500 to-green-600" : 
                status === "loading" ? "bg-linear-to-br from-purple-500 to-purple-600" :
                status === "error" ? "bg-linear-to-br from-red-500 to-red-600" :
                "bg-linear-to-br from-blue-500 to-blue-600"
              }`}>
                {status === "detecting" && (
                  <svg className="w-20 h-20 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {status === "found" && (
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {status === "loading" && (
                  <svg className="w-20 h-20 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {status === "error" && (
                  <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className={`max-w-xl mx-auto rounded-2xl border-2 p-8 shadow-xl mb-10 ${
            status === "error" || showNearbyChoice ? "bg-yellow-50 border-yellow-300" : "bg-white border-orange-300"
          }`}>
            {error ? (
              <>
                <p className="text-gray-800 text-lg mb-3 font-bold">
                  {error.split('|')[0]}
                </p>
                <p className="text-gray-700 text-base font-semibold">
                  {error.split('|')[1] || error.split('|')[0]}
                </p>
                
                {/* Show nearby options if available */}
                {showNearbyChoice && nearbyOptions.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                      <p className="font-bold text-green-700 mb-2">📍 Nearest District Found:</p>
                      <p className="text-xl font-black text-green-900">{nearbyOptions[0].district_name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {Math.round(nearbyOptions[0].similarity * 100)}% match with your location
                      </p>
                    </div>
                    
                    {nearbyOptions.length > 1 && (
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-gray-700 font-semibold mb-2">Other nearby options:</p>
                        <div className="flex flex-wrap gap-2">
                          {nearbyOptions.slice(1).map((opt: any, idx: number) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {opt.district_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <button
                        onClick={() => handleNearbyChoice(true)}
                        className="flex-1 px-6 py-4 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
                      >
                        ✅ Show {nearbyOptions[0].district_name} Data
                        <br />
                        <span className="text-sm font-normal">{nearbyOptions[0].district_name} का डेटा दिखाएं</span>
                      </button>
                      <button
                        onClick={() => handleNearbyChoice(false)}
                        className="flex-1 px-6 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all transform hover:scale-105 cursor-pointer"
                      >
                        🔍 Select Manually
                        <br />
                        <span className="text-sm font-normal">मैन्युअल रूप से चुनें</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-blue-700 text-lg mb-3 font-bold">
                  {status === "detecting" && "Please wait while we detect your location..."}
                  {status === "found" && "Successfully detected your location!"}
                  {status === "loading" && "Loading your district dashboard..."}
                </p>
                <p className="text-blue-600 text-base font-semibold">
                  {status === "detecting" && "कृपया प्रतीक्षा करें जब हम आपका स्थान निर्धारित करते हैं..."}
                  {status === "found" && "सफलतापूर्वक आपका स्थान निर्धारित किया!"}
                  {status === "loading" && "आपका जिला डैशबोर्ड लोड हो रहा है..."}
                </p>
              </>
            )}
          </div>

          {/* Loading Dots */}
          {(status === "detecting" || status === "loading") && (
            <div className="flex justify-center gap-3">
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-4 bg-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
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
