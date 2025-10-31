# 🇮🇳 MGNREGA Performance TrackerThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

<div align="center">## Getting Started

  <p><strong>Track MGNREGA District Performance Across India</strong></p>

  <p>A transparent platform for monitoring rural employment guarantee implementation</p>First, run the development server:

</div>

```bash

---npm run dev

# or

## 🤖 Introductionyarn dev

# or

**MGNREGA Performance Tracker** is a comprehensive web application designed to monitor and analyze the implementation of the Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) across Indian districts. Built with modern web technologies, this platform provides transparent access to employment data, performance metrics, and comparative analytics.pnpm dev

# or

### What Makes MGNREGA Tracker Special?bun dev

```

- **Real-Time Data Integration**: Fetches latest data from official data.gov.in API

- **GPS-Based Auto-Detection**: Automatically detects your district using geolocationOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **District Comparison**: Compare performance metrics between any two districts side-by-side

- **Beautiful Visualizations**: Interactive charts and graphs powered by RechartsYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Bilingual Interface**: Full support for English and Hindi (हिंदी)

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devicesThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **Automated Data Ingestion**: Cron jobs for regular database updates at 3 AM IST

- **Comprehensive KPIs**: Track families worked, person days, expenditure, and more## Learn More

- **Inclusivity Metrics**: Monitor women, SC, and ST participation rates

- **Help & Guide**: Low-literacy friendly with simple visual guidesTo learn more about Next.js, take a look at the following resources:

Whether you're a citizen checking local performance, an administrator monitoring implementation, or a researcher analyzing trends, MGNREGA Tracker provides easy access to crucial employment guarantee data.- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## 🌍 **Live Demo**

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

🔗 **Visit the live application:** [Coming Soon - Deploy to Vercel]

## Deploy on Vercel

---

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## ✨ Key Features

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### 🎯 **District Finder**

- Search districts by state selection
- View detailed performance dashboards
- Access historical data and trends
- Download reports (planned feature)

### 📍 **GPS Auto-Detection**

- Automatic location detection using browser geolocation
- Nearby district suggestions
- Smart district matching algorithm
- Manual selection fallback option

### 📊 **Performance Dashboard**

- Hero KPIs: Families Worked, Person Days, Expenditure, On-Time Payment
- Work Status: Completed vs Ongoing Works
- Historical Trends: 6-month performance charts
- Inclusivity Metrics: Women, SC, ST participation
- State Comparison: District vs State Average
- 100-Day Completion Rate tracking

### ⚖️ **District Comparison**

- Side-by-side comparison of any two districts
- Visual performance charts (Bar Charts)
- Inclusivity radar charts
- Works status comparison
- Real-time data fetching
- Export comparison (planned feature)

### 📚 **Help & Guide**

- What is MGNREGA?
- How to use the portal
- Understanding metrics
- FAQs section
- Available in English & Hindi

### 🔄 **Automated Data Ingestion**

- **Cron Service**: Runs daily at 3 AM IST
- **Manual Ingestion**: On-demand via `npm run ingest`
- **Batch Processing**: Handles 1000+ records efficiently
- **Error Handling**: Automatic retries and logging
- **KPI Calculation**: Automatic metric computation

### 🎨 **User Experience**

- Beautiful gradient backgrounds
- Smooth animations and transitions
- Loading states with spinners
- Error handling with user-friendly messages
- Accessibility considerations
- Print-friendly layouts

---

## 🛠️ Tech Stack

### **Frontend**

| Technology              | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| ⚛️ **Next.js 16.0.1**   | React framework with App Router and SSR        |
| ⚡ **React 19.2.0**     | UI library for building interactive components |
| 🎨 **Tailwind CSS 3.4** | Utility-first CSS framework                    |
| 📊 **Recharts 2.15**    | Beautiful and customizable charts              |
| 🌐 **TypeScript 5**     | Type-safe JavaScript for better DX             |
| 🗺️ **Nominatim API**    | OpenStreetMap geocoding for location detection |
| 🎯 **Geolocation API**  | Browser-based GPS detection                    |

### **Backend**

| Technology                | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| 🚀 **Next.js API Routes** | Serverless API endpoints                         |
| 🗄️ **PostgreSQL**         | Relational database for storing performance data |
| 🔗 **node-postgres (pg)** | PostgreSQL client for Node.js                    |
| 🌐 **data.gov.in API**    | Official Indian government open data platform    |
| ⏰ **node-cron**          | Task scheduling for automated ingestion          |
| 📝 **Winston**            | Logging library for debugging                    |

### **Data Sources**

| Source                               | Data Type                                 |
| ------------------------------------ | ----------------------------------------- |
| 📂 **data.gov.in**                   | MGNREGA district-level performance data   |
| 🗺️ **Nominatim**                     | Geographic location and reverse geocoding |
| 🏛️ **Ministry of Rural Development** | Official MGNREGA documentation            |

---

## 📁 Detailed Project Structure

```
📦 mgnrega-tracker/
│
├── 📂 app/                           # Next.js App Router
│   ├── 📄 favicon.ico                # Indian flag favicon
│   ├── 📄 globals.css                # Global styles with Tailwind
│   ├── 📄 layout.tsx                 # Root layout with metadata
│   ├── 📄 page.tsx                   # Homepage with action cards
│   │
│   ├── 📂 api/                       # API Routes (Serverless Functions)
│   │   ├── 📂 states/
│   │   │   └── 📄 route.ts           # GET /api/states - List all states
│   │   ├── 📂 districts/
│   │   │   └── 📂 [stateCode]/
│   │   │       └── 📄 route.ts       # GET /api/districts/:stateCode
│   │   ├── 📂 dashboard/
│   │   │   └── 📂 [districtCode]/
│   │   │       └── 📄 route.ts       # GET /api/dashboard/:districtCode
│   │   ├── 📂 compare/
│   │   │   └── 📄 route.ts           # GET /api/compare?d1=...&d2=...
│   │   ├── 📂 data/
│   │   │   └── 📂 [stateId]/
│   │   │       └── 📂 [districtId]/
│   │   │           └── 📄 route.ts   # GET /api/data/:stateId/:districtId
│   │   ├── 📂 run-ingestion/
│   │   │   └── 📄 route.ts           # POST /api/run-ingestion (manual trigger)
│   │   └── 📂 test-ingest/
│   │       └── 📄 route.ts           # GET /api/test-ingest (test endpoint)
│   │
│   ├── 📂 auto-detect/
│   │   └── 📄 page.tsx               # GPS-based automatic district detection
│   │
│   ├── 📂 district-finder/
│   │   └── 📄 page.tsx               # Manual state/district selection
│   │
│   ├── 📂 dashboard/
│   │   └── 📄 page.tsx               # District performance dashboard with charts
│   │
│   ├── 📂 compare/
│   │   └── 📄 page.tsx               # Side-by-side district comparison
│   │
│   └── 📂 help/
│       └── 📄 page.tsx               # Help guide and FAQs
│
├── 📂 data/                          # Database and ingestion scripts
│   ├── 📄 schema.sql                 # PostgreSQL database schema
│   ├── 📄 postgres.ts                # Database connection pool
│   ├── 📄 ingestData.ts              # Data fetching and storage logic
│   ├── 📄 transformData.ts           # Data transformation utilities
│   ├── 📄 transformAndStorePerformanceData.ts  # ETL pipeline
│   ├── 📄 runIngestion.mjs           # Standalone ingestion script
│   ├── 📄 migrateSchema.mjs          # Database migration script
│   └── 📄 resetTables.mjs            # Database reset utility
│
├── 📂 scripts/                       # Automation scripts
│   ├── 📄 manual-ingest.mjs          # On-demand data ingestion
│   └── 📄 cron-service.mjs           # Daily 3 AM automated ingestion
│
├── 📂 logs/                          # Log files (generated)
│   └── 📄 cron.log                   # Cron job execution logs
│
├── 📂 public/                        # Static assets
│
├── 📄 .env.local                     # Environment variables (not in git)
├── 📄 .env.example                   # Environment template
├── 📄 .gitignore                     # Git ignore rules
├── 📄 eslint.config.mjs              # ESLint configuration
├── 📄 next.config.ts                 # Next.js configuration
├── 📄 next-env.d.ts                  # Next.js TypeScript definitions
├── 📄 package.json                   # Dependencies and scripts
├── 📄 pnpm-lock.yaml                 # pnpm lockfile
├── 📄 postcss.config.mjs             # PostCSS configuration
├── 📄 tsconfig.json                  # TypeScript configuration
├── 📄 vercel.json                    # Vercel deployment config
├── 📄 INGESTION_GUIDE.md             # Data ingestion documentation
├── 📄 VERCEL_DEPLOYMENT.md           # Deployment guide
└── 📄 README.md                      # This file
```

---

## 📋 API Endpoints

### **States & Districts**

| Method | Endpoint                    | Description            | Parameters           |
| ------ | --------------------------- | ---------------------- | -------------------- |
| GET    | `/api/states`               | Get all Indian states  | None                 |
| GET    | `/api/districts/:stateCode` | Get districts by state | `stateCode` (string) |

### **Dashboard & Data**

| Method | Endpoint                         | Description                 | Parameters              |
| ------ | -------------------------------- | --------------------------- | ----------------------- |
| GET    | `/api/dashboard/:districtCode`   | Get district dashboard data | `districtCode` (string) |
| GET    | `/api/data/:stateId/:districtId` | Get raw performance data    | `stateId`, `districtId` |

### **Comparison**

| Method | Endpoint       | Description           | Parameters                                     |
| ------ | -------------- | --------------------- | ---------------------------------------------- |
| GET    | `/api/compare` | Compare two districts | `d1` (district code 1), `d2` (district code 2) |

### **Data Ingestion**

| Method | Endpoint             | Description                     | Auth Required               |
| ------ | -------------------- | ------------------------------- | --------------------------- |
| POST   | `/api/run-ingestion` | Manually trigger data ingestion | ❌ (Add auth in production) |
| GET    | `/api/test-ingest`   | Test ingestion endpoint         | ❌                          |

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/mgnrega_db
# Example for local: postgresql://postgres:password@localhost:5432/mgnrega
# Example for Neon: postgresql://user:pass@host.neon.tech/neondb?sslmode=require

# Data.gov.in API Configuration
DATA_GOV_API_KEY=your_data_gov_in_api_key_here
# Get API key from: https://data.gov.in/
# Register for a free account and generate API key

# Optional: Node Environment
NODE_ENV=development
# Set to 'production' when deploying

# Optional: Port Configuration
PORT=3000
```

### **Getting Data.gov.in API Key**

1. Visit [data.gov.in](https://data.gov.in/)
2. Click on "Register" and create a free account
3. Navigate to your profile/dashboard
4. Generate an API key
5. Copy the key to your `.env.local` file

---

## 🚀 Installation & Setup

### **Prerequisites**

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (recommended) or npm - `npm install -g pnpm`
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### **Step 1: Clone the Repository**

```bash
# Clone the repository
git clone https://github.com/Soumyadeepta04/mgnrega-tracker.git

# Navigate to the project directory
cd mgnrega-tracker
```

### **Step 2: Install Dependencies**

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### **Step 3: Database Setup**

```bash
# Create PostgreSQL database
createdb mgnrega_db

# Or using psql
psql -U postgres
CREATE DATABASE mgnrega_db;
\q

# Run schema migration
node data/migrateSchema.mjs
```

### **Step 4: Environment Configuration**

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add your credentials
# - DATABASE_URL: Your PostgreSQL connection string
# - DATA_GOV_API_KEY: Your data.gov.in API key
```

### **Step 5: Initial Data Ingestion**

```bash
# Run manual ingestion to populate database
npm run ingest

# This will:
# - Fetch data from data.gov.in API
# - Transform and clean the data
# - Store in PostgreSQL database
# - Calculate KPIs and metrics
# Note: This may take 5-10 minutes depending on data volume
```

### **Step 6: Start Development Server**

```bash
# Start Next.js development server
npm run dev

# Server will start at http://localhost:3000
```

### **Step 7: (Optional) Set Up Automated Ingestion**

```bash
# Start cron service for daily updates
npm run cron:start

# This will run data ingestion daily at 3:00 AM IST
# Keep this terminal open or use PM2 for production
```

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run ingest       # Manual data ingestion
npm run cron:start   # Start cron service (3 AM daily)
```

---

## 🚀 Deployment

### **Frontend & Backend Deployment (Vercel)**

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin master
   ```

2. **Deploy to Vercel**

   - Visit [Vercel](https://vercel.com/)
   - Import your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`
     - `DATA_GOV_API_KEY`
   - Deploy!

3. **Post-Deployment**
   - Run initial ingestion via `/api/run-ingestion`
   - Set up cron job using Vercel Cron (vercel.json already configured)

### **Database Deployment (Neon/Supabase)**

**Option 1: Neon (Recommended)**

1. Create account at [neon.tech](https://neon.tech/)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

**Option 2: Supabase**

1. Create account at [supabase.com](https://supabase.com/)
2. Create new project
3. Enable PostgreSQL
4. Copy connection string
5. Add to Vercel environment variables

### **Production Checklist**

- ✅ Environment variables configured
- ✅ Database schema migrated
- ✅ Initial data ingested
- ✅ API key secured (add authentication)
- ✅ Cron jobs scheduled
- ✅ Error monitoring set up
- ✅ SSL enabled
- ✅ CORS configured

---

## 🎯 Usage Guide

### **1. Finding Your District**

**Automatic Detection:**

1. Click "Automatically Detect" on homepage
2. Allow location permissions
3. System detects nearest district
4. Confirm or choose nearby district

**Manual Selection:**

1. Click "Select Manually"
2. Choose your state from dropdown
3. Select your district
4. Click "View Data"

### **2. Viewing Dashboard**

- **KPI Cards**: See key metrics at a glance
- **Historical Charts**: Track trends over 6 months
- **Work Status**: Completed vs ongoing works pie chart
- **Inclusivity Metrics**: Women, SC, ST participation bar chart
- **State Comparison**: Your district vs state average line chart

### **3. Comparing Districts**

1. Navigate to "Compare Districts"
2. Select first district (State → District)
3. Select second district
4. Click "Compare Districts"
5. View side-by-side comparison with charts

### **4. Understanding Metrics**

- **Families Worked**: Number of families provided employment
- **Person Days**: Total work days generated
- **Expenditure**: Total funds spent
- **On-Time Payment**: % of wages paid within 15 days
- **100-Day Completion**: % of families completed 100 days
- **Works Status**: Completed vs Ongoing projects

---

## 🗃️ Database Schema

### **mgnrega_data**

Main table storing all MGNREGA data from data.gov.in

### **district_monthly_performance**

Aggregated monthly performance metrics by district

### **state_monthly_averages**

State-level average performance indicators

For detailed schema, see `data/schema.sql`

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Write meaningful commit messages
- Test on multiple devices
- Update documentation
- Maintain code style consistency

---

## 🐛 Known Issues & Troubleshooting

### **Common Issues**

**Issue 1: Database Connection Error**

```
Error: Connection refused
```

- **Solution**: Ensure PostgreSQL is running: `sudo service postgresql start`

**Issue 2: Data.gov.in API 403 Forbidden**

```
Error: Forbidden
```

- **Solution**: Verify API key in `.env.local` is correct

**Issue 3: Geolocation Not Working**

```
Error: User denied location
```

- **Solution**: Enable location permissions in browser settings

**Issue 4: Ingestion Timeout**

```
Error: Request timeout
```

- **Solution**: Increase timeout in `ingestData.ts` or retry

---

## 📈 Future Enhancements

- [ ] PDF Report Generation
- [ ] Excel Export functionality
- [ ] Advanced filtering (date range, metrics)
- [ ] User authentication & saved comparisons
- [ ] Email alerts for significant changes
- [ ] Multi-language support (regional languages)
- [ ] Mobile app (React Native)
- [ ] Historical data analysis (trends, predictions)
- [ ] District rankings and leaderboards
- [ ] Integration with more govt APIs

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Soumyadeepta**

- GitHub: [@Soumyadeepta04](https://github.com/Soumyadeepta04)
- Project Link: [https://github.com/Soumyadeepta04/mgnrega-tracker](https://github.com/Soumyadeepta04/mgnrega-tracker)

---

## 🙏 Acknowledgments

- **Ministry of Rural Development, Govt. of India** for MGNREGA data
- **data.gov.in** for providing open data platform
- **OpenStreetMap** for Nominatim geocoding service
- **Next.js** team for the amazing framework
- **Recharts** for beautiful chart components
- All contributors and users of this project

---

## 📧 Contact & Support

For questions, suggestions, or issues:

- Open an issue on [GitHub](https://github.com/Soumyadeepta04/mgnrega-tracker/issues)
- Star ⭐ this repository if you find it helpful!

---

<div align="center">
  <p>Made with ❤️ for Rural India</p>
  <p>⭐ Star this repo if it helps you track MGNREGA performance!</p>
  <p>🇮🇳 भारत सरकार | Government of India</p>
</div>
