import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MapPin, Plus, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommunityCard from '../components/CommunityCard';

export default function Community() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [userCommunity, setUserCommunity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        axios.get('/api/community'),
        axios.get('/api/community/user/my'),
      ]);
      
      setCommunities(allRes.data.data);
      setUserCommunity(userRes.data.data);
    } catch (error) {
      // Mock data
      setCommunities([
        { id: '1', name: 'Mumbai Green Initiative', description: 'Mumbai residents working together for water conservation', location: { state: 'Maharashtra', city: 'Mumbai' }, memberCount: 1250, totalRecharged: 5000000 },
        { id: '2', name: 'Bangalore Water Warriors', description: 'Creating sustainable water solutions for Bangalore', location: { state: 'Karnataka', city: 'Bangalore' }, memberCount: 980, totalRecharged: 4200000 },
        { id: '3', name: 'Chennai Rain Harvesters', description: 'Chennai community embracing rainwater harvesting', location: { state: 'Tamil Nadu', city: 'Chennai' }, memberCount: 750, totalRecharged: 3100000 },
        { id: '4', name: 'Delhi Water Keepers', description: 'Delhi NCR residents fighting water crisis together', location: { state: 'Delhi', city: 'Delhi' }, memberCount: 1100, totalRecharged: 4500000 },
        { id: '5', name: 'Hyderabad Harvesters', description: 'Hyderabad community for sustainable water management', location: { state: 'Telangana', city: 'Hyderabad' }, memberCount: 620, totalRecharged: 2800000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const states = ['all', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Delhi', 'Gujarat'];

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || c.location.state === selectedState;
    return matchesSearch && matchesState;
  });

  const handleCommunityClick = (community) => {
    navigate(`/community/${community.id}`, { state: { community } });
  };

  const handleCreateCommunity = () => {
    // Would open a modal or navigate to create page
    alert('Create community feature coming soon!');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            <span>Community</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Join the <span className="gradient-text">Community</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with neighbors, compete in challenges, and amplify your water conservation impact together.
          </p>
        </motion.div>

        {/* User's Community Banner */}
        {userCommunity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary-600 to-water-600 rounded-2xl p-6 text-white mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-200 text-sm mb-1">Your Community</p>
                <h3 className="text-xl font-bold mb-2">{userCommunity.name}</h3>
                <p className="text-primary-100 text-sm">
                  {userCommunity.memberCount?.toLocaleString() || 0} members • 
                  {(userCommunity.totalRecharged / 1000000).toFixed(1)}M liters recharged
                </p>
              </div>
              <button
                onClick={() => handleCommunityClick(userCommunity)}
                className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-50 transition-colors"
              >
                View Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Create Community Button */}
        {!userCommunity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-dashed border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Start Your Own Community</h3>
                <p className="text-gray-500">Create a group for your neighborhood or apartment complex</p>
              </div>
              <button
                onClick={handleCreateCommunity}
                className="px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none"
            />
          </div>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none bg-white"
          >
            {states.map(state => (
              <option key={state} value={state}>
                {state === 'all' ? 'All States' : state}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Communities Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-pulse">Loading communities...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommunityCard
                  community={community}
                  onClick={handleCommunityClick}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No communities found</p>
            <button
              onClick={handleCreateCommunity}
              className="mt-4 btn-primary"
            >
              Create the First One
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
