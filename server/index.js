const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const connectDB = require('./config/database');
connectDB();

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
const authRoutes = require('./routes/auth');
const creditsRoutes = require('./routes/credits');
const achievementsRoutes = require('./routes/achievements');
const challengesRoutes = require('./routes/challenges');
const communityRoutes = require('./routes/community');
const impactRoutes = require('./routes/impact');
const socialRoutes = require('./routes/social');

app.use('/api/assessment', assessmentRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/aquifer', aquiferRoutes);
app.use('/api/roof-detection', roofDetectionRoutes);
app.use('/api/roof-detect', roofDetectionRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/subsidy', subsidyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/credits', creditsRoutes);
app.use('/api/achievements', achievementsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/social', socialRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
