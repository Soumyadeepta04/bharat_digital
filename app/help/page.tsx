"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HelpPage() {
  const router = useRouter();

  const metrics = [
    {
      emoji: "👨‍👩‍👧‍👦",
      titleEn: "Families Worked",
      titleHi: "काम मिला परिवारों की संख्या",
      descEn: "How many families got work under MGNREGA in your district. More families = better!",
      descHi: "आपके जिले में मनरेगा के तहत कितने परिवारों को काम मिला। ज्यादा परिवार = अच्छा!",
      example: "Example: If 25,000 families worked, it means 25,000 households earned wages",
      color: "blue"
    },
    {
      emoji: "📅",
      titleEn: "Person Days",
      titleHi: "व्यक्ति-दिवस",
      descEn: "Total days of employment given. 1 person working 100 days = 100 person-days.",
      descHi: "कुल कितने दिनों का रोजगार दिया गया। 1 व्यक्ति 100 दिन काम करे = 100 व्यक्ति-दिवस।",
      example: "Example: 1,000,000 person-days means 10,000 people worked for 100 days",
      color: "purple"
    },
    {
      emoji: "💰",
      titleEn: "On-Time Payments",
      titleHi: "समय पर भुगतान",
      descEn: "Percentage of wages paid within 15 days. Higher is better!",
      descHi: "15 दिनों के भीतर कितने प्रतिशत मजदूरी दी गई। ज्यादा = अच्छा!",
      example: "Example: 85% means 85 out of 100 payments were made on time",
      color: "green"
    },
    {
      emoji: "₹",
      titleEn: "Total Expenditure",
      titleHi: "कुल खर्च",
      descEn: "Total money spent on wages and materials in your district.",
      descHi: "आपके जिले में मजदूरी और सामग्री पर खर्च की गई कुल राशि।",
      example: "Example: ₹50 Cr = ₹50 Crore spent on MGNREGA",
      color: "orange"
    },
    {
      emoji: "✅",
      titleEn: "Completed Works",
      titleHi: "पूरे हुए काम",
      descEn: "Number of projects that are finished. Roads, ponds, schools etc.",
      descHi: "पूरे हुए प्रोजेक्ट्स की संख्या। सड़कें, तालाब, स्कूल आदि।",
      example: "Example: 450 completed works means 450 projects are done",
      color: "green"
    },
    {
      emoji: "🔧",
      titleEn: "Ongoing Works",
      titleHi: "चल रहे काम",
      descEn: "Number of projects currently in progress.",
      descHi: "वर्तमान में चल रहे प्रोजेक्ट्स की संख्या।",
      example: "Example: 150 ongoing works means 150 projects are being built",
      color: "yellow"
    },
    {
      emoji: "🎯",
      titleEn: "100-Day Completion",
      titleHi: "100-दिन पूर्णता",
      descEn: "Percentage of families who got full 100 days of work (MGNREGA guarantees 100 days).",
      descHi: "कितने प्रतिशत परिवारों को पूरे 100 दिन का काम मिला (मनरेगा 100 दिन की गारंटी देता है)।",
      example: "Example: 20% means 20 out of 100 families completed 100 days",
      color: "blue"
    },
    {
      emoji: "👩",
      titleEn: "Women Participation",
      titleHi: "महिला भागीदारी",
      descEn: "What percentage of work went to women workers.",
      descHi: "कितने प्रतिशत काम महिला श्रमिकों को मिला।",
      example: "Example: 60% means 60 out of 100 workdays went to women",
      color: "pink"
    },
    {
      emoji: "🤝",
      titleEn: "SC/ST Participation",
      titleHi: "SC/ST भागीदारी",
      descEn: "Percentage of work given to Scheduled Caste and Scheduled Tribe communities.",
      descHi: "अनुसूचित जाति और अनुसूचित जनजाति समुदायों को दिया गया काम का प्रतिशत।",
      example: "Example: SC 25% + ST 15% = 40% work went to these communities",
      color: "purple"
    }
  ];

  const getColorClasses = (color: string): string => {
    const colors: Record<string, string> = {
      blue: "from-blue-500 to-blue-600 border-blue-300",
      purple: "from-purple-500 to-purple-600 border-purple-300",
      green: "from-green-500 to-green-600 border-green-300",
      orange: "from-orange-500 to-orange-600 border-orange-300",
      yellow: "from-yellow-500 to-yellow-600 border-yellow-300",
      pink: "from-pink-500 to-pink-600 border-pink-300"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-6 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Help & Guide</h1>
              <p className="text-blue-100 text-sm">मदद और मार्गदर्शन</p>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">📖</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">What is MGNREGA?</h2>
              <p className="text-xl text-blue-600 font-semibold">मनरेगा क्या है?</p>
            </div>
          </div>
          <div className="space-y-4 text-lg">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-blue-700">MGNREGA</strong> (Mahatma Gandhi National Rural Employment Guarantee Act) is a government program that <strong>guarantees 100 days of paid work</strong> to every rural household that wants to work.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-blue-700">मनरेगा</strong> (महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम) एक सरकारी कार्यक्रम है जो काम चाहने वाले हर ग्रामीण परिवार को <strong>100 दिनों के भुगतान किए गए काम की गारंटी</strong> देता है।
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mt-6">
              <p className="text-gray-800 font-semibold">
                💡 <strong>Simple:</strong> If you live in a village and need work, the government will give you work for 100 days and pay you for it!
              </p>
              <p className="text-gray-800 font-semibold mt-2">
                💡 <strong>सरल:</strong> अगर आप गाँव में रहते हैं और काम चाहते हैं, तो सरकार आपको 100 दिनों का काम देगी और उसके लिए पैसे भी देगी!
              </p>
            </div>
          </div>
        </div>

        {/* How to Use This Portal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🚀</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">How to Use This Portal?</h2>
              <p className="text-xl text-orange-600 font-semibold">इस पोर्टल का उपयोग कैसे करें?</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
              <div className="text-5xl mb-4">1️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select Your District</h3>
              <p className="text-gray-700 mb-2">अपना जिला चुनें</p>
              <p className="text-sm text-gray-600">Choose your state and district from the dropdown menu</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300">
              <div className="text-5xl mb-4">2️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">View Dashboard</h3>
              <p className="text-gray-700 mb-2">डैशबोर्ड देखें</p>
              <p className="text-sm text-gray-600">See all the numbers and charts about your district&apos;s performance</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300">
              <div className="text-5xl mb-4">3️⃣</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compare Districts</h3>
              <p className="text-gray-700 mb-2">जिलों की तुलना करें</p>
              <p className="text-sm text-gray-600">Compare your district with other districts to see how it&apos;s doing</p>
            </div>
          </div>
        </div>

        {/* Understanding the Numbers */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">📊</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Understanding the Numbers</h2>
              <p className="text-xl text-purple-600 font-semibold">संख्याओं को समझना</p>
            </div>
          </div>

          <div className="space-y-6">
            {metrics.map((metric, index) => (
              <div key={index} className={`bg-linear-to-r ${getColorClasses(metric.color)} rounded-xl p-6 text-white shadow-lg`}>
                <div className="flex items-start gap-4">
                  <div className="text-6xl">{metric.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{metric.titleEn}</h3>
                    <p className="text-lg font-semibold mb-3 opacity-90">{metric.titleHi}</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 space-y-2">
                      <p className="text-sm leading-relaxed">{metric.descEn}</p>
                      <p className="text-sm leading-relaxed">{metric.descHi}</p>
                      <p className="text-xs mt-3 bg-white/30 rounded px-3 py-2 font-semibold">{metric.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Questions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">❓</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Common Questions</h2>
              <p className="text-xl text-green-600 font-semibold">आम सवाल</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Q: What does &quot;Good&quot; performance mean?</h3>
              <p className="text-gray-700">A: Higher numbers for families worked, person days, completed works, and on-time payments are good. Higher percentages for women, SC/ST participation and 100-day completion are also good!</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Q: &quot;अच्छा&quot; प्रदर्शन का क्या मतलब है?</h3>
              <p className="text-gray-700">A: काम मिले परिवार, व्यक्ति-दिवस, पूरे हुए काम, और समय पर भुगतान की ज्यादा संख्या अच्छी है। महिला, SC/ST भागीदारी और 100-दिन पूर्णता का ज्यादा प्रतिशत भी अच्छा है!</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border-l-4 border-purple-500">
              <h3 className="font-bold text-lg text-gray-900 mb-2">Q: How often is data updated?</h3>
              <p className="text-gray-700">A: The data is updated monthly by the Government of India. This portal fetches the latest data from data.gov.in regularly.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Check Your District?</h2>
          <p className="text-xl mb-6">अपने जिले की जाँच करने के लिए तैयार हैं?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/district-finder">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                Select District | जिला चुनें
              </button>
            </Link>
            <Link href="/">
              <button className="px-8 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
                Go to Homepage | मुखपृष्ठ पर जाएं
              </button>
            </Link>
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
