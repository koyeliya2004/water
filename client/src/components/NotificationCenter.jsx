import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCheck, Trash2, FileText, Quote, Calendar, Award } from 'lucide-react'
import axios from 'axios'

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchNotifications()
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/notifications', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
        setUnreadCount(response.data.data.unreadCount)
      }
    } catch (error) {
      // Use mock notifications if API fails
      setNotifications([
        {
          _id: '1',
          type: 'subsidy',
          title: 'New Subsidy Available',
          message: 'New RWH subsidy scheme launched in your state!',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          type: 'achievement',
          title: 'Achievement Unlocked',
          message: 'You earned the "First Assessment" badge!',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
      setUnreadCount(2)
    }
  }

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      // Update locally
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/notifications/read-all', {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/notifications/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      
      const deleted = notifications.find(n => n._id === id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      const deleted = notifications.find(n => n._id === id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'subsidy': return FileText
      case 'quote': return Quote
      case 'maintenance': return Calendar
      case 'achievement': return Award
      default: return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'subsidy': return 'text-purple-500 bg-purple-50'
      case 'quote': return 'text-blue-500 bg-blue-50'
      case 'maintenance': return 'text-green-500 bg-green-50'
      case 'achievement': return 'text-yellow-500 bg-yellow-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <CheckCheck className="w-4 h-4 mr-1" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type)
                  const iconBg = getNotificationColor(notification.type)
                  
                  return (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-primary-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-lg ${iconBg} flex-shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification._id)}
                                className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification._id)}
                              className="text-xs text-gray-400 hover:text-red-500 flex items-center"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 bg-gray-50">
                <button className="w-full text-sm text-center text-gray-600 hover:text-gray-900">
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
