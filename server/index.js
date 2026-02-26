const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const assessmentRoutes = require('./routes/assessment');
const weatherRoutes = require('./routes/weather');
const aquiferRoutes = require('./routes/aquifer');
const roofDetectionRoutes = require('./routes/roofDetection');
const marketplaceRoutes = require('./routes/marketplace');
const reportRoutes = require('./routes/report');
const leaderboardRoutes = require('./routes/leaderboard');
const subsidyRoutes = require('./routes/subsidy');

app.use('/api/assessment', assessmentRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/aquifer', aquiferRoutes);
app.use('/api/roof-detection', roofDetectionRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/subsidy', subsidyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
