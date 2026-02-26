# JalDhar - Rooftop Rainwater Harvesting Assessment Application

A comprehensive web application for assessing rooftop rainwater harvesting (RTRWH) potential, promoting groundwater conservation, and connecting users with implementation resources.

## Features

### Core Assessment
- **Rooftop Area Detection**: Computer Vision-based roof detection using map coordinates or uploaded images
- **Rainfall Data**: State-wise rainfall statistics for accurate calculations
- **Runoff Calculation**: Based on roof type coefficients and local rainfall
- **Structure Recommendations**: Personalized recharge structure suggestions based on soil type
- **Cost Estimation**: Detailed breakdown of installation and maintenance costs
- **Benefit Analysis**: Payback period, water savings, and groundwater recharge estimates

### Advanced Features
- **GIS Integration**: Location-based aquifer and rainfall data
- **3D Aquifer Visualization**: Interactive underground water system views
- **Weather Integration**: Hyper-local weather data and harvest forecasting
- **Community Leaderboard**: Gamified water credit system for engagement
- **Impact Dashboard**: Track collective conservation efforts

### Implementation Support
- **Vendor Marketplace**: Connect with verified RWH service providers
- **DIY Blueprints**: Downloadable PDF guides with bill of materials
- **Subsidy Tracker**: Government scheme information by state
- **Multi-language Support**: Regional language accessibility (planned)

## Tech Stack

### Backend
- Node.js with Express
- RESTful API architecture
- PDF generation (PDFKit)
- Image upload support (Multer)

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Leaflet for maps
- Recharts for data visualization
- Framer Motion for animations

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rainwater-harvesting-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

This will start both the backend server (port 3001) and frontend dev server (port 5173).

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Assessment
- `POST /api/assessment/calculate` - Calculate RWH potential
- `GET /api/assessment/states` - Get state rainfall data

### Weather
- `POST /api/weather/forecast` - Get weather forecast
- `POST /api/weather/historical` - Get historical rainfall

### Aquifer
- `POST /api/aquifer/info` - Get aquifer information
- `GET /api/aquifer/types` - List aquifer types

### Roof Detection
- `POST /api/roof-detect/analyze-map` - Analyze roof from coordinates
- `POST /api/roof-detect/upload-image` - Analyze uploaded roof image

### Marketplace
- `GET /api/marketplace/vendors` - List verified vendors
- `GET /api/marketplace/products` - List products

### Reports
- `POST /api/report/generate-pdf` - Generate assessment report
- `POST /api/report/blueprint` - Generate DIY blueprint

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `POST /api/leaderboard/submit` - Submit water recharge data

### Subsidies
- `POST /api/subsidy/check` - Check available subsidies

## Data Sources

- **Rainfall Data**: India Meteorological Department (IMD) patterns
- **Aquifer Information**: Central Ground Water Board (CGWB) publications
- **Runoff Coefficients**: Standard hydrological engineering values
- **Cost Estimates**: Market rates for RWH components in India

## Project Structure

```
project/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API route handlers
│   ├── uploads/            # File uploads
│   └── index.js
└── package.json
```

## Contributing

This project supports the Jal Jeevan Mission and groundwater conservation efforts in India. Contributions are welcome!

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Central Ground Water Board (CGWB) for technical guidance
- India Meteorological Department for rainfall data
- Ministry of Jal Shakti for policy framework
