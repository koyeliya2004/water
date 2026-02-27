import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Award, Droplets, Share2, Settings, Edit2, Copy, Check } from 'lucide-react';
import axios from 'axios';
import CreditBadge from '../components/CreditBadge';
import TierProgress from '../components/TierProgress';
import CreditHistory from '../components/CreditHistory';
import StreakCounter from '../components/StreakCounter';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [tierProgress, setTierProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, creditsRes] = await Promise.all([
        axios.get('/api/auth/me'),
        axios.get('/api/credits/balance'),
      ]);
      
      setUser(userRes.data.data);
      setCredits(creditsRes.data.data.credits);
      setTierProgress(creditsRes.data.data.tierProgress);
    } catch (error) {
      // Use mock data for fallback
      setUser({
        name: 'Demo User',
        email: 'demo@jaldhar.app',
        location: { state: 'Maharashtra', city: 'Mumbai', locality: 'Andheri' },
        stats: { litersRecharged: 45000, assessmentsCompleted: 3, referrals: 2 },
        achievements: [],
        referralCode: 'DEMO12',
      });
      setCredits({ total: 4500, lifetime: 4500, monthly: 1200 });
      setTierProgress({ current: 'silver', next: 'gold', progress: 45, remaining: 5500 });
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    const code = user?.referralCode || 'DEMO12';
    navigator.clipboard.writeText(`https://jaldhar.app/ref/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const stats = [
    { label: 'Liters Recharged', value: (user?.stats?.litersRecharged || 0).toLocaleString(), icon: Droplets, color: 'text-blue-500' },
    { label: 'Assessments', value: user?.stats?.assessmentsCompleted || 0, icon: Award, color: 'text-green-500' },
    { label: 'Referrals', value: user?.stats?.referrals || 0, icon: User, color: 'text-purple-500' },
    { label: 'Achievements', value: user?.achievements?.length || 0, icon: Award, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-primary-500 to-water-500" />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-water-400 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {user?.name?.charAt(0) || 'D'}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <CreditBadge tier={tierProgress?.current || 'bronze'} size="sm" />
                </div>
              </div>

              {/* Name & Location */}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                  <button className="p-1.5 rounded-full hover:bg-gray-100">
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {user?.location?.city && (
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {user.location.city}, {user.location.state}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg flex items-center gap-2 hover:bg-primary-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="metric-card text-center"
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                <p className="metric-value text-2xl">{stat.value}</p>
                <p className="metric-label text-xs">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Credits & Tier */}
          <div className="lg:col-span-1 space-y-6">
            {/* Credits Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary-600 to-water-600 rounded-2xl p-6 text-white"
            >
              <div className="text-center">
                <p className="text-primary-100 mb-1">Total Water Credits</p>
                <p className="text-4xl font-bold mb-2">
                  {credits?.total?.toLocaleString() || 0}
                </p>
                <p className="text-primary-200 text-sm">
                  +{credits?.monthly?.toLocaleString() || 0} this month
                </p>
              </div>
            </motion.div>

            {/* Tier Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TierProgress 
                currentTier={tierProgress?.current} 
                progress={tierProgress?.progress}
                nextTier={tierProgress?.next}
                remaining={tierProgress?.remaining}
                credits={credits?.lifetime}
              />
            </motion.div>

            {/* Streak Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StreakCounter 
                current={user?.streaks?.current || 5} 
                longest={user?.streaks?.longest || 12}
                size="sm"
              />
            </motion.div>

            {/* Referral Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="font-bold text-gray-900 mb-3">Your Referral Code</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-100 rounded-lg font-mono text-lg text-center">
                  {user?.referralCode || 'DEMO12'}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Share your code and earn 100 credits for each referral!
              </p>
            </motion.div>
          </div>

          {/* Right Column - Credit History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CreditHistory />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
