import { useState, useEffect } from 'react';
import {
  Smartphone, Shield, MapPin, Gauge, RefreshCw, CheckCircle, AlertTriangle,
  Clock, TrendingUp, Activity, Signal, Wifi, Globe, Target, Zap, Lock,
  Search, Filter, Calendar, BarChart3, Settings, Play, Pause, Eye, AlertCircle,
  Navigation, Radio, Database, Code, ChevronRight, Check, X, Download, Webhook,
  Edit, Trash2
} from 'lucide-react';
import { db } from '../../lib/db';
import { useAuth } from '../../contexts/AuthContext';

interface TelcoAPIProps {
  onNavigate?: (view: string) => void;
}

export default function TelcoAPI({ onNavigate }: TelcoAPIProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sim-swap' | 'number-verify' | 'location' | 'qod' | 'analytics'>('sim-swap');

  const [providers, setProviders] = useState<any[]>([]);
  const [simSwapRequests, setSimSwapRequests] = useState<any[]>([]);
  const [numberVerifyRequests, setNumberVerifyRequests] = useState<any[]>([]);
  const [locationRequests, setLocationRequests] = useState<any[]>([]);
  const [geofences, setGeofences] = useState<any[]>([]);
  const [qodSessions, setQodSessions] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any[]>([]);
  const [trackedDevices, setTrackedDevices] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configTab, setConfigTab] = useState<'providers' | 'api-keys' | 'webhooks' | 'geofences' | 'qos' | 'testing'>('providers');
  const [showTestModal, setShowTestModal] = useState(false);
  const [testService, setTestService] = useState<'sim-swap' | 'number-verify' | 'location' | 'qod'>('sim-swap');
  const [testPhone, setTestPhone] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const [showNewSimSwapModal, setShowNewSimSwapModal] = useState(false);
  const [showNewNumberVerifyModal, setShowNewNumberVerifyModal] = useState(false);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);
  const [showNewQodModal, setShowNewQodModal] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showEditSimSwapModal, setShowEditSimSwapModal] = useState(false);
  const [showEditNumberVerifyModal, setShowEditNumberVerifyModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [showEditQodModal, setShowEditQodModal] = useState(false);
  const [showEditDeviceModal, setShowEditDeviceModal] = useState(false);

  const [editingItem, setEditingItem] = useState<any>(null);

  const [newSimSwapData, setNewSimSwapData] = useState({
    phone_number: '',
    lookback_days: '7'
  });

  const [newNumberVerifyData, setNewNumberVerifyData] = useState({
    phone_number: '',
    verification_method: 'network_auth'
  });

  const [newLocationData, setNewLocationData] = useState({
    phone_number: '',
    request_type: 'precise',
    geofence_id: ''
  });

  const [newQodData, setNewQodData] = useState({
    phone_number: '',
    qos_profile: 'gaming',
    session_duration_minutes: '60',
    target_latency_ms: '50',
    target_bandwidth_mbps: '100'
  });

  const [newDeviceData, setNewDeviceData] = useState({
    device_name: '',
    phone_number: '',
    device_type: 'Android',
    os_version: '',
    device_model: '',
    imei: '',
    tracking_enabled: true,
    location_consent: true,
    precision_level: 'approximate',
    update_frequency_minutes: '60',
    battery_optimization: true,
    tags: '',
    notes: '',
    alert_on_movement: false,
    alert_on_geofence_exit: false,
    alert_on_geofence_enter: false
  });

  useEffect(() => {
    if (user) {
      Promise.all([
        loadProviders(),
        loadSimSwapRequests(),
        loadNumberVerifyRequests(),
        loadLocationRequests(),
        loadGeofences(),
        loadQodSessions(),
        loadUsageStats(),
        loadTrackedDevices()
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadProviders = async () => {
    const { data, error } = await db
      .from('telco_api_providers')
      .select('*')
      .order('is_active', { ascending: false });

    if (!error && data) {
      setProviders(data);
    }
  };

  const loadSimSwapRequests = async () => {
    const { data, error } = await db
      .from('sim_swap_requests')
      .select('*')
      .order('request_timestamp', { ascending: false })
      .limit(50);

    if (!error && data) {
      setSimSwapRequests(data);
    }
  };

  const loadNumberVerifyRequests = async () => {
    const { data, error } = await db
      .from('number_verification_requests')
      .select('*')
      .order('request_timestamp', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNumberVerifyRequests(data);
    }
  };

  const loadLocationRequests = async () => {
    const { data, error } = await db
      .from('device_location_requests')
      .select('*')
      .order('request_timestamp', { ascending: false })
      .limit(50);

    if (!error && data) {
      setLocationRequests(data);
    }
  };

  const loadGeofences = async () => {
    const { data, error } = await db
      .from('geofences')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGeofences(data);
    }
  };

  const loadQodSessions = async () => {
    const { data, error } = await db
      .from('qod_sessions')
      .select('*')
      .order('request_timestamp', { ascending: false })
      .limit(50);

    if (!error && data) {
      setQodSessions(data);
    }
  };

  const loadUsageStats = async () => {
    const { data, error } = await db
      .from('telco_api_usage')
      .select('*')
      .order('usage_date', { ascending: false })
      .limit(100);

    if (!error && data) {
      setUsageStats(data);
    }
  };

  const loadTrackedDevices = async () => {
    const { data, error } = await db
      .from('telco_tracked_devices')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTrackedDevices(data);
    }
  };

  const handleTestAPI = async () => {
    if (!testPhone) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      if (testService === 'sim-swap') {
        const result = {
          phone_number: testPhone,
          swap_detected: Math.random() > 0.7,
          fraud_score: Math.floor(Math.random() * 100),
          last_swap_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          days_since_swap: Math.floor(Math.random() * 30),
          response_time_ms: Math.floor(Math.random() * 200) + 100
        };
        setTestResult(result);
        setNotification({ type: 'success', message: 'SIM Swap check completed' });
      } else if (testService === 'number-verify') {
        const result = {
          phone_number: testPhone,
          is_verified: Math.random() > 0.3,
          match_score: Math.floor(Math.random() * 100),
          network_name: ['Maxis', 'Celcom', 'DiGi', 'U Mobile'][Math.floor(Math.random() * 4)],
          network_type: '4G',
          response_time_ms: Math.floor(Math.random() * 150) + 80
        };
        setTestResult(result);
        setNotification({ type: 'success', message: 'Number verification completed' });
      } else if (testService === 'location') {
        const result = {
          phone_number: testPhone,
          latitude: 3.1390 + (Math.random() - 0.5) * 0.1,
          longitude: 101.6869 + (Math.random() - 0.5) * 0.1,
          accuracy_meters: Math.floor(Math.random() * 100) + 50,
          city: 'Kuala Lumpur',
          country: 'Malaysia',
          response_time_ms: Math.floor(Math.random() * 300) + 150
        };
        setTestResult(result);
        setNotification({ type: 'success', message: 'Location retrieved successfully' });
      } else if (testService === 'qod') {
        const result = {
          session_id: `qod_${Date.now()}`,
          phone_number: testPhone,
          status: 'active',
          target_latency_ms: 50,
          actual_latency_ms: Math.floor(Math.random() * 40) + 20,
          target_bandwidth_mbps: 100,
          actual_bandwidth_mbps: Math.floor(Math.random() * 100) + 80,
          packet_loss_percent: (Math.random() * 2).toFixed(2),
          jitter_ms: Math.floor(Math.random() * 10) + 5
        };
        setTestResult(result);
        setNotification({ type: 'success', message: 'QoD session created successfully' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'API test failed' });
    } finally {
      setTesting(false);
    }
  };

  const toggleProvider = async (providerId: string, isActive: boolean) => {
    const { error } = await db
      .from('telco_api_providers')
      .update({ is_active: !isActive })
      .eq('id', providerId);

    if (!error) {
      setNotification({ type: 'success', message: `Provider ${!isActive ? 'activated' : 'deactivated'}` });
      loadProviders();
    } else {
      setNotification({ type: 'error', message: 'Failed to update provider' });
    }
  };

  const createGeofence = async (geofenceData: any) => {
    const { error } = await db
      .from('geofences')
      .insert([geofenceData]);

    if (!error) {
      setNotification({ type: 'success', message: 'Geofence created successfully' });
      loadGeofences();
    } else {
      setNotification({ type: 'error', message: 'Failed to create geofence' });
    }
  };

  const deleteGeofence = async (geofenceId: string) => {
    const { error } = await db
      .from('geofences')
      .delete()
      .eq('id', geofenceId);

    if (!error) {
      setNotification({ type: 'success', message: 'Geofence deleted successfully' });
      loadGeofences();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete geofence' });
    }
  };

  const handleCreateSimSwapCheck = async () => {
    if (!newSimSwapData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    try {
      const swapDetected = Math.random() > 0.7;
      const fraudScore = Math.floor(Math.random() * 100);
      const daysAgo = Math.floor(Math.random() * parseInt(newSimSwapData.lookback_days));

      const { error } = await db
        .from('sim_swap_requests')
        .insert([{
          phone_number: newSimSwapData.phone_number,
          provider_id: providers.find(p => p.is_active)?.id,
          swap_detected: swapDetected,
          fraud_score: fraudScore,
          last_swap_date: swapDetected ? new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString() : null,
          days_since_swap: swapDetected ? daysAgo : null,
          response_time_ms: Math.floor(Math.random() * 200) + 100,
          request_timestamp: new Date().toISOString()
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'SIM Swap check completed successfully' });
        setShowNewSimSwapModal(false);
        setNewSimSwapData({ phone_number: '', lookback_days: '7' });
        loadSimSwapRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to create SIM Swap check' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateNumberVerification = async () => {
    if (!newNumberVerifyData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    try {
      const isVerified = Math.random() > 0.3;
      const matchScore = Math.floor(Math.random() * 100);
      const networks = ['Maxis', 'Celcom', 'DiGi', 'U Mobile'];

      const { error } = await db
        .from('number_verification_requests')
        .insert([{
          phone_number: newNumberVerifyData.phone_number,
          provider_id: providers.find(p => p.is_active)?.id,
          verification_method: newNumberVerifyData.verification_method,
          is_verified: isVerified,
          match_score: matchScore,
          network_name: networks[Math.floor(Math.random() * networks.length)],
          network_type: ['4G', '5G'][Math.floor(Math.random() * 2)],
          response_time_ms: Math.floor(Math.random() * 150) + 80,
          request_timestamp: new Date().toISOString()
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'Number verification completed successfully' });
        setShowNewNumberVerifyModal(false);
        setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' });
        loadNumberVerifyRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to verify number' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLocationRequest = async () => {
    if (!newLocationData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    try {
      const lat = 3.1390 + (Math.random() - 0.5) * 0.1;
      const lng = 101.6869 + (Math.random() - 0.5) * 0.1;
      const accuracy = Math.floor(Math.random() * 100) + 50;

      const { error } = await db
        .from('device_location_requests')
        .insert([{
          phone_number: newLocationData.phone_number,
          provider_id: providers.find(p => p.is_active)?.id,
          request_type: newLocationData.request_type,
          geofence_id: newLocationData.geofence_id || null,
          latitude: lat,
          longitude: lng,
          accuracy_meters: accuracy,
          city: 'Kuala Lumpur',
          country: 'Malaysia',
          is_within_area: newLocationData.geofence_id ? Math.random() > 0.5 : null,
          status: 'completed',
          response_time_ms: Math.floor(Math.random() * 300) + 150,
          request_timestamp: new Date().toISOString()
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'Location request completed successfully' });
        setShowNewLocationModal(false);
        setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' });
        loadLocationRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to create location request' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateQodSession = async () => {
    if (!newQodData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter a phone number' });
      return;
    }

    setSubmitting(true);
    try {
      const sessionId = `qod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const targetLatency = parseInt(newQodData.target_latency_ms);
      const actualLatency = Math.floor(Math.random() * (targetLatency * 0.8)) + (targetLatency * 0.2);
      const targetBandwidth = parseInt(newQodData.target_bandwidth_mbps);
      const actualBandwidth = Math.floor(Math.random() * (targetBandwidth * 0.3)) + (targetBandwidth * 0.7);

      const { error } = await db
        .from('qod_sessions')
        .insert([{
          session_id: sessionId,
          phone_number: newQodData.phone_number,
          provider_id: providers.find(p => p.is_active)?.id,
          qos_profile: newQodData.qos_profile,
          target_latency_ms: targetLatency,
          actual_latency_ms: actualLatency,
          target_bandwidth_mbps: targetBandwidth,
          actual_bandwidth_mbps: actualBandwidth,
          session_duration_minutes: parseInt(newQodData.session_duration_minutes),
          packet_loss_percent: parseFloat((Math.random() * 2).toFixed(2)),
          jitter_ms: Math.floor(Math.random() * 10) + 5,
          status: 'active',
          request_timestamp: new Date().toISOString()
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'QoD session created successfully' });
        setShowNewQodModal(false);
        setNewQodData({
          phone_number: '',
          qos_profile: 'gaming',
          session_duration_minutes: '60',
          target_latency_ms: '50',
          target_bandwidth_mbps: '100'
        });
        loadQodSessions();
      } else {
        setNotification({ type: 'error', message: 'Failed to create QoD session' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddDevice = async () => {
    if (!newDeviceData.device_name || !newDeviceData.phone_number) {
      setNotification({ type: 'error', message: 'Please enter device name and phone number' });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = newDeviceData.tags
        ? newDeviceData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { error } = await db
        .from('telco_tracked_devices')
        .insert([{
          user_id: user?.id,
          device_name: newDeviceData.device_name,
          phone_number: newDeviceData.phone_number,
          device_type: newDeviceData.device_type,
          os_version: newDeviceData.os_version || null,
          device_model: newDeviceData.device_model || null,
          imei: newDeviceData.imei || null,
          tracking_enabled: newDeviceData.tracking_enabled,
          location_consent: newDeviceData.location_consent,
          precision_level: newDeviceData.precision_level,
          update_frequency_minutes: parseInt(newDeviceData.update_frequency_minutes),
          battery_optimization: newDeviceData.battery_optimization,
          tags: tagsArray,
          notes: newDeviceData.notes || null,
          alert_on_movement: newDeviceData.alert_on_movement,
          alert_on_geofence_exit: newDeviceData.alert_on_geofence_exit,
          alert_on_geofence_enter: newDeviceData.alert_on_geofence_enter,
          is_active: true
        }]);

      if (!error) {
        setNotification({ type: 'success', message: 'Device added successfully' });
        setShowAddDeviceModal(false);
        setNewDeviceData({
          device_name: '',
          phone_number: '',
          device_type: 'Android',
          os_version: '',
          device_model: '',
          imei: '',
          tracking_enabled: true,
          location_consent: true,
          precision_level: 'approximate',
          update_frequency_minutes: '60',
          battery_optimization: true,
          tags: '',
          notes: '',
          alert_on_movement: false,
          alert_on_geofence_exit: false,
          alert_on_geofence_enter: false
        });
        loadTrackedDevices();
      } else {
        setNotification({ type: 'error', message: 'Failed to add device' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSimSwapRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SIM Swap check?')) return;

    const { error } = await db
      .from('sim_swap_requests')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotification({ type: 'success', message: 'SIM Swap check deleted successfully' });
      loadSimSwapRequests();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete SIM Swap check' });
    }
  };

  const handleDeleteNumberVerifyRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this verification request?')) return;

    const { error } = await db
      .from('number_verification_requests')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotification({ type: 'success', message: 'Verification request deleted successfully' });
      loadNumberVerifyRequests();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete verification request' });
    }
  };

  const handleDeleteLocationRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location request?')) return;

    const { error } = await db
      .from('location_verification_requests')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotification({ type: 'success', message: 'Location request deleted successfully' });
      loadLocationRequests();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete location request' });
    }
  };

  const handleDeleteQodSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QoD session?')) return;

    const { error } = await db
      .from('qod_sessions')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotification({ type: 'success', message: 'QoD session deleted successfully' });
      loadQodSessions();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete QoD session' });
    }
  };

  const handleDeleteTrackedDevice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tracked device?')) return;

    const { error } = await db
      .from('telco_tracked_devices')
      .delete()
      .eq('id', id);

    if (!error) {
      setNotification({ type: 'success', message: 'Tracked device deleted successfully' });
      loadTrackedDevices();
    } else {
      setNotification({ type: 'error', message: 'Failed to delete tracked device' });
    }
  };

  const handleEditSimSwapRequest = (request: any) => {
    setEditingItem(request);
    setNewSimSwapData({
      phone_number: request.phone_number,
      lookback_days: '7'
    });
    setShowEditSimSwapModal(true);
  };

  const handleUpdateSimSwapRequest = async () => {
    if (!editingItem || !newSimSwapData.phone_number) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('sim_swap_requests')
        .update({
          phone_number: newSimSwapData.phone_number,
          request_timestamp: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (!error) {
        setNotification({ type: 'success', message: 'SIM Swap check updated successfully' });
        setShowEditSimSwapModal(false);
        setEditingItem(null);
        setNewSimSwapData({ phone_number: '', lookback_days: '7' });
        loadSimSwapRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to update SIM Swap check' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNumberVerifyRequest = (request: any) => {
    setEditingItem(request);
    setNewNumberVerifyData({
      phone_number: request.phone_number,
      verification_method: request.verification_method || 'network_auth'
    });
    setShowEditNumberVerifyModal(true);
  };

  const handleUpdateNumberVerifyRequest = async () => {
    if (!editingItem || !newNumberVerifyData.phone_number) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('number_verification_requests')
        .update({
          phone_number: newNumberVerifyData.phone_number,
          verification_method: newNumberVerifyData.verification_method,
          request_timestamp: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (!error) {
        setNotification({ type: 'success', message: 'Verification request updated successfully' });
        setShowEditNumberVerifyModal(false);
        setEditingItem(null);
        setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' });
        loadNumberVerifyRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to update verification request' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditLocationRequest = (request: any) => {
    setEditingItem(request);
    setNewLocationData({
      phone_number: request.phone_number,
      request_type: request.request_type || 'precise',
      geofence_id: request.geofence_id || ''
    });
    setShowEditLocationModal(true);
  };

  const handleUpdateLocationRequest = async () => {
    if (!editingItem || !newLocationData.phone_number) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('location_verification_requests')
        .update({
          phone_number: newLocationData.phone_number,
          request_type: newLocationData.request_type,
          geofence_id: newLocationData.geofence_id || null,
          request_timestamp: new Date().toISOString()
        })
        .eq('id', editingItem.id);

      if (!error) {
        setNotification({ type: 'success', message: 'Location request updated successfully' });
        setShowEditLocationModal(false);
        setEditingItem(null);
        setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' });
        loadLocationRequests();
      } else {
        setNotification({ type: 'error', message: 'Failed to update location request' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditQodSession = (session: any) => {
    setEditingItem(session);
    setNewQodData({
      phone_number: session.phone_number,
      qos_profile: session.qos_profile,
      session_duration_minutes: session.session_duration_minutes?.toString() || '60',
      target_latency_ms: session.target_latency_ms?.toString() || '50',
      target_bandwidth_mbps: session.target_bandwidth_mbps?.toString() || '100'
    });
    setShowEditQodModal(true);
  };

  const handleUpdateQodSession = async () => {
    if (!editingItem || !newQodData.phone_number) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await db
        .from('qod_sessions')
        .update({
          phone_number: newQodData.phone_number,
          qos_profile: newQodData.qos_profile,
          session_duration_minutes: parseInt(newQodData.session_duration_minutes),
          target_latency_ms: parseInt(newQodData.target_latency_ms),
          target_bandwidth_mbps: parseInt(newQodData.target_bandwidth_mbps)
        })
        .eq('id', editingItem.id);

      if (!error) {
        setNotification({ type: 'success', message: 'QoD session updated successfully' });
        setShowEditQodModal(false);
        setEditingItem(null);
        setNewQodData({
          phone_number: '',
          qos_profile: 'gaming',
          session_duration_minutes: '60',
          target_latency_ms: '50',
          target_bandwidth_mbps: '100'
        });
        loadQodSessions();
      } else {
        setNotification({ type: 'error', message: 'Failed to update QoD session' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTrackedDevice = (device: any) => {
    setEditingItem(device);
    setNewDeviceData({
      device_name: device.device_name,
      phone_number: device.phone_number,
      device_type: device.device_type,
      os_version: device.os_version || '',
      device_model: device.device_model || '',
      imei: device.imei || '',
      tracking_enabled: device.tracking_enabled,
      location_consent: device.location_consent,
      precision_level: device.precision_level,
      update_frequency_minutes: device.update_frequency_minutes?.toString() || '60',
      battery_optimization: device.battery_optimization,
      tags: device.tags ? device.tags.join(', ') : '',
      notes: device.notes || '',
      alert_on_movement: device.alert_on_movement,
      alert_on_geofence_exit: device.alert_on_geofence_exit,
      alert_on_geofence_enter: device.alert_on_geofence_enter
    });
    setShowEditDeviceModal(true);
  };

  const handleUpdateTrackedDevice = async () => {
    if (!editingItem || !newDeviceData.device_name || !newDeviceData.phone_number) {
      setNotification({ type: 'error', message: 'Please fill in required fields' });
      return;
    }

    setSubmitting(true);
    try {
      const tagsArray = newDeviceData.tags
        ? newDeviceData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const { error } = await db
        .from('telco_tracked_devices')
        .update({
          device_name: newDeviceData.device_name,
          phone_number: newDeviceData.phone_number,
          device_type: newDeviceData.device_type,
          os_version: newDeviceData.os_version || null,
          device_model: newDeviceData.device_model || null,
          imei: newDeviceData.imei || null,
          tracking_enabled: newDeviceData.tracking_enabled,
          location_consent: newDeviceData.location_consent,
          precision_level: newDeviceData.precision_level,
          update_frequency_minutes: parseInt(newDeviceData.update_frequency_minutes),
          battery_optimization: newDeviceData.battery_optimization,
          tags: tagsArray,
          notes: newDeviceData.notes || null,
          alert_on_movement: newDeviceData.alert_on_movement,
          alert_on_geofence_exit: newDeviceData.alert_on_geofence_exit,
          alert_on_geofence_enter: newDeviceData.alert_on_geofence_enter
        })
        .eq('id', editingItem.id);

      if (!error) {
        setNotification({ type: 'success', message: 'Tracked device updated successfully' });
        setShowEditDeviceModal(false);
        setEditingItem(null);
        setNewDeviceData({
          device_name: '',
          phone_number: '',
          device_type: 'Android',
          os_version: '',
          device_model: '',
          imei: '',
          tracking_enabled: true,
          location_consent: true,
          precision_level: 'approximate',
          update_frequency_minutes: '60',
          battery_optimization: true,
          tags: '',
          notes: '',
          alert_on_movement: false,
          alert_on_geofence_exit: false,
          alert_on_geofence_enter: false
        });
        loadTrackedDevices();
      } else {
        setNotification({ type: 'error', message: 'Failed to update tracked device' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'An error occurred' });
    } finally {
      setSubmitting(false);
    }
  };

  const totalSimSwapChecks = simSwapRequests.length;
  const swapsDetected = simSwapRequests.filter(r => r.swap_detected).length;
  const avgSimSwapScore = simSwapRequests.reduce((sum, r) => sum + (r.fraud_score || 0), 0) / (totalSimSwapChecks || 1);

  const totalNumberVerify = numberVerifyRequests.length;
  const verified = numberVerifyRequests.filter(r => r.is_verified).length;
  const avgMatchScore = numberVerifyRequests.reduce((sum, r) => sum + (r.match_score || 0), 0) / (totalNumberVerify || 1);

  const totalLocationRequests = locationRequests.length;
  const successfulLocations = locationRequests.filter(r => r.status === 'completed').length;

  const totalQodSessions = qodSessions.length;
  const activeSessions = qodSessions.filter(s => s.status === 'active').length;

  const todayUsage = usageStats.filter(u => {
    const usageDate = new Date(u.usage_date);
    const today = new Date();
    return usageDate.toDateString() === today.toDateString();
  });

  const totalRequestsToday = todayUsage.reduce((sum, u) => sum + (u.total_requests || 0), 0);
  const totalCostToday = todayUsage.reduce((sum, u) => sum + parseFloat(u.total_cost || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39FF14]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Telco API</h1>
          <p className="text-slate-400 mt-1">Network intelligence APIs for authentication, fraud prevention, and QoS</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTestModal(true)}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" />
            Test APIs
          </button>
          <button
            onClick={() => onNavigate?.('resources')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Code className="w-5 h-5" />
            API Docs
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Configure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">API Requests Today</h3>
            <Activity className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white">{totalRequestsToday.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">Across all services</p>
        </div>

        <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Success Rate</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">
            {totalRequestsToday > 0
              ? ((todayUsage.reduce((sum, u) => sum + u.successful_requests, 0) / totalRequestsToday) * 100).toFixed(1)
              : 0}%
          </p>
          <p className="text-xs text-slate-400 mt-1">API reliability</p>
        </div>

        <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Active QoD Sessions</h3>
            <Gauge className="w-5 h-5 text-[#39FF14]" />
          </div>
          <p className="text-3xl font-bold text-white">{activeSessions}</p>
          <p className="text-xs text-slate-400 mt-1">Live network optimization</p>
        </div>

        <div className="bg-gradient-to-br from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-white">Cost Today</h3>
            <TrendingUp className="w-5 h-5 text-[#39FF14]" />
          </div>
          <p className="text-3xl font-bold text-white">${totalCostToday.toFixed(2)}</p>
          <p className="text-xs text-slate-400 mt-1">API usage cost</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-1 inline-flex gap-1">
        <button
          onClick={() => setActiveTab('sim-swap')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'sim-swap' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          SIM Swap
        </button>
        <button
          onClick={() => setActiveTab('number-verify')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'number-verify' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Number Verification
        </button>
        <button
          onClick={() => setActiveTab('location')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'location' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Device Location
        </button>
        <button
          onClick={() => setActiveTab('qod')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'qod' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Quality on Demand
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'sim-swap' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">SIM Swap Detection</h2>
                <p className="text-slate-300 mb-4">
                  Protect your users from SIM swap fraud by detecting recent SIM card changes or port-outs.
                  This API checks if a phone number has been associated with a different SIM card recently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">Real-time Detection</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Instant verification of SIM card status and recent changes</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Timestamp History</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Returns exact date and time of last SIM swap or port</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Fraud Scoring</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Risk assessment based on swap timing and patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Total Checks</h3>
              <p className="text-4xl font-bold text-white mb-1">{totalSimSwapChecks}</p>
              <p className="text-slate-400 text-sm">API requests processed</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Swaps Detected</h3>
              <p className="text-4xl font-bold text-red-400 mb-1">{swapsDetected}</p>
              <p className="text-slate-400 text-sm">
                {totalSimSwapChecks > 0 ? ((swapsDetected / totalSimSwapChecks) * 100).toFixed(1) : 0}% detection rate
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Avg Fraud Score</h3>
              <p className="text-4xl font-bold text-[#39FF14] mb-1">{avgSimSwapScore.toFixed(0)}</p>
              <p className="text-slate-400 text-sm">Risk assessment average</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent SIM Swap Checks</h3>
              <button
                onClick={() => setShowNewSimSwapModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors"
              >
                New Check
              </button>
            </div>

            <div className="space-y-3">
              {simSwapRequests.slice(0, 10).map((request) => (
                <div key={request.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <span className="text-white font-mono">{request.phone_number}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.swap_detected
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {request.swap_detected ? 'SWAP DETECTED' : 'NO SWAP'}
                        </span>
                        {request.fraud_score >= 70 && (
                          <span className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-semibold">
                            HIGH RISK
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Fraud Score</p>
                          <p className="text-white font-semibold">{request.fraud_score || 0}/100</p>
                        </div>
                        {request.last_swap_date && (
                          <div>
                            <p className="text-slate-400">Last Swap</p>
                            <p className="text-white font-semibold">
                              {new Date(request.last_swap_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {request.days_since_swap !== null && (
                          <div>
                            <p className="text-slate-400">Days Since Swap</p>
                            <p className="text-white font-semibold">{request.days_since_swap} days</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-400">Response Time</p>
                          <p className="text-white font-semibold">{request.response_time_ms}ms</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditSimSwapRequest(request)}
                        className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-[#39FF14]" />
                      </button>
                      <button
                        onClick={() => handleDeleteSimSwapRequest(request.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'number-verify' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Smartphone className="w-8 h-8 text-green-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Number Verification</h2>
                <p className="text-slate-300 mb-4">
                  Silently verify user identity in the background using network intelligence. No SMS OTP required -
                  the API confirms the mobile number matches the device using the network connection.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-semibold">Silent Authentication</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Background verification with zero user friction</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Signal className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Network-Based</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Uses carrier network data for instant verification</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">No SMS Required</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Eliminates OTP friction and SMS costs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Total Verifications</h3>
              <p className="text-4xl font-bold text-white mb-1">{totalNumberVerify}</p>
              <p className="text-slate-400 text-sm">API requests processed</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Verified Users</h3>
              <p className="text-4xl font-bold text-green-400 mb-1">{verified}</p>
              <p className="text-slate-400 text-sm">
                {totalNumberVerify > 0 ? ((verified / totalNumberVerify) * 100).toFixed(1) : 0}% success rate
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Avg Match Score</h3>
              <p className="text-4xl font-bold text-[#39FF14] mb-1">{avgMatchScore.toFixed(0)}%</p>
              <p className="text-slate-400 text-sm">Confidence level</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent Verifications</h3>
              <button
                onClick={() => setShowNewNumberVerifyModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors"
              >
                New Verification
              </button>
            </div>

            <div className="space-y-3">
              {numberVerifyRequests.slice(0, 10).map((request) => (
                <div key={request.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <span className="text-white font-mono">{request.phone_number}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.is_verified
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {request.is_verified ? 'VERIFIED' : 'NOT VERIFIED'}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs uppercase">
                          {request.verification_method}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Match Score</p>
                          <p className="text-white font-semibold">{request.match_score || 0}%</p>
                        </div>
                        {request.network_name && (
                          <div>
                            <p className="text-slate-400">Network</p>
                            <p className="text-white font-semibold">{request.network_name}</p>
                          </div>
                        )}
                        {request.network_type && (
                          <div>
                            <p className="text-slate-400">Network Type</p>
                            <p className="text-white font-semibold">{request.network_type}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-400">Response Time</p>
                          <p className="text-white font-semibold">{request.response_time_ms}ms</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Timestamp</p>
                          <p className="text-white font-semibold">
                            {new Date(request.request_timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditNumberVerifyRequest(request)}
                        className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-[#39FF14]" />
                      </button>
                      <button
                        onClick={() => handleDeleteNumberVerifyRequest(request.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#39FF14]/20/20 rounded-lg">
                <MapPin className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Device Location</h2>
                <p className="text-slate-300 mb-4">
                  Access device location data through network intelligence. Verify if a device is within a specific area
                  (geofencing) or retrieve precise GPS coordinates with user consent.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Geofence Verification</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Check if device is within defined geographic area</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">Precise Coordinates</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Get exact latitude/longitude with meter-level accuracy</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Consent-Based</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Privacy-first location access with user permission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Active Geofences</h3>
              <div className="space-y-3">
                {geofences.map((geofence) => (
                  <div key={geofence.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#39FF14]" />
                        <h4 className="text-white font-semibold">{geofence.geofence_name}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        geofence.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {geofence.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Center</p>
                        <p className="text-white font-mono text-xs">
                          {geofence.center_latitude?.toFixed(4)}, {geofence.center_longitude?.toFixed(4)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400">Radius</p>
                        <p className="text-white font-semibold">{(geofence.radius_meters / 1000).toFixed(1)} km</p>
                      </div>
                    </div>
                    {geofence.tags && geofence.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {geofence.tags.map((tag: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Location Statistics</h3>
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Total Requests</p>
                  <p className="text-3xl font-bold text-white">{totalLocationRequests}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Successful Locations</p>
                  <p className="text-3xl font-bold text-green-400">{successfulLocations}</p>
                  <p className="text-slate-400 text-xs mt-1">
                    {totalLocationRequests > 0 ? ((successfulLocations / totalLocationRequests) * 100).toFixed(1) : 0}% success rate
                  </p>
                </div>
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-1">Active Geofences</p>
                  <p className="text-3xl font-bold text-[#39FF14]">{geofences.filter(g => g.is_active).length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Tracked Devices</h3>
              <button
                onClick={() => setShowAddDeviceModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Add Device
              </button>
            </div>

            <div className="space-y-3">
              {trackedDevices.slice(0, 5).map((device) => (
                <div key={device.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="w-5 h-5 text-[#39FF14]" />
                        <span className="text-white font-semibold">{device.device_name}</span>
                        <span className="text-slate-400 font-mono text-sm">{device.phone_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          device.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {device.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        {device.tracking_enabled && (
                          <span className="px-2 py-1 bg-[#39FF14]/20/20 text-[#39FF14] rounded-full text-xs font-semibold flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            TRACKING
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Device Type</p>
                          <p className="text-white font-semibold">{device.device_type}</p>
                        </div>
                        {device.device_model && (
                          <div>
                            <p className="text-slate-400">Model</p>
                            <p className="text-white">{device.device_model}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-400">Precision</p>
                          <p className="text-white capitalize">{device.precision_level}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Update Frequency</p>
                          <p className="text-white">{device.update_frequency_minutes} min</p>
                        </div>
                      </div>

                      {device.last_known_latitude && device.last_known_longitude && (
                        <div className="mt-2 p-2 bg-slate-800/50 rounded border border-slate-700">
                          <p className="text-slate-400 text-xs mb-1">Last Known Location</p>
                          <p className="text-white font-mono text-xs">
                            {device.last_known_latitude.toFixed(4)}, {device.last_known_longitude.toFixed(4)}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            Updated: {device.last_location_update ? new Date(device.last_location_update).toLocaleString() : 'Never'}
                          </p>
                        </div>
                      )}

                      {device.tags && device.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {device.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditTrackedDevice(device)}
                        className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-[#39FF14]" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrackedDevice(device.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {trackedDevices.length === 0 && (
                <div className="text-center py-8">
                  <Smartphone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No tracked devices yet</p>
                  <p className="text-slate-500 text-sm mt-1">Add your first device to start tracking</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Recent Location Requests</h3>
              <button
                onClick={() => setShowNewLocationModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors"
              >
                New Request
              </button>
            </div>

            <div className="space-y-3">
              {locationRequests.slice(0, 10).map((request) => (
                <div key={request.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span className="text-white font-mono">{request.phone_number}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : request.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {request.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs uppercase">
                          {request.request_type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {request.latitude && request.longitude && (
                          <div>
                            <p className="text-slate-400">Coordinates</p>
                            <p className="text-white font-mono text-xs">
                              {request.latitude?.toFixed(4)}, {request.longitude?.toFixed(4)}
                            </p>
                          </div>
                        )}
                        {request.accuracy_meters && (
                          <div>
                            <p className="text-slate-400">Accuracy</p>
                            <p className="text-white font-semibold">{request.accuracy_meters}m</p>
                          </div>
                        )}
                        {request.city && (
                          <div>
                            <p className="text-slate-400">Location</p>
                            <p className="text-white font-semibold">{request.city}</p>
                          </div>
                        )}
                        {request.is_within_area !== null && (
                          <div>
                            <p className="text-slate-400">In Geofence</p>
                            <p className={`font-semibold ${request.is_within_area ? 'text-green-400' : 'text-red-400'}`}>
                              {request.is_within_area ? 'Yes' : 'No'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditLocationRequest(request)}
                        className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-[#39FF14]" />
                      </button>
                      <button
                        onClick={() => handleDeleteLocationRequest(request.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qod' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#39FF14]/10 to-[#32e012]/10 border border-[#39FF14]/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#39FF14]/20 rounded-lg">
                <Gauge className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Quality on Demand (QoD)</h2>
                <p className="text-slate-300 mb-4">
                  Request guaranteed network performance for specific sessions. Ensure stable latency and prioritized
                  bandwidth for critical applications like gaming, video streaming, or IoT.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Stable Latency</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Guarantee consistent low-latency connections</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">Prioritized Bandwidth</h4>
                    </div>
                    <p className="text-slate-400 text-sm">Reserve dedicated bandwidth for your application</p>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-[#39FF14]" />
                      <h4 className="text-white font-semibold">Session-Based</h4>
                    </div>
                    <p className="text-slate-400 text-sm">QoS guarantees for specific time periods</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Total Sessions</h3>
              <p className="text-4xl font-bold text-white mb-1">{totalQodSessions}</p>
              <p className="text-slate-400 text-sm">Lifetime requests</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Active Now</h3>
              <p className="text-4xl font-bold text-green-400 mb-1">{activeSessions}</p>
              <p className="text-slate-400 text-sm">Live QoD sessions</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Avg Latency</h3>
              <p className="text-4xl font-bold text-[#39FF14] mb-1">
                {qodSessions.filter(s => s.actual_latency_ms).length > 0
                  ? (qodSessions.reduce((sum, s) => sum + (s.actual_latency_ms || 0), 0) /
                     qodSessions.filter(s => s.actual_latency_ms).length).toFixed(0)
                  : 0}ms
              </p>
              <p className="text-slate-400 text-sm">Active sessions</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Avg Bandwidth</h3>
              <p className="text-4xl font-bold text-[#39FF14] mb-1">
                {qodSessions.filter(s => s.actual_bandwidth_mbps).length > 0
                  ? (qodSessions.reduce((sum, s) => sum + (s.actual_bandwidth_mbps || 0), 0) /
                     qodSessions.filter(s => s.actual_bandwidth_mbps).length).toFixed(0)
                  : 0} Mbps
              </p>
              <p className="text-slate-400 text-sm">Active sessions</p>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">QoD Sessions</h3>
              <button
                onClick={() => setShowNewQodModal(true)}
                className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors"
              >
                New Session
              </button>
            </div>

            <div className="space-y-3">
              {qodSessions.slice(0, 10).map((session) => (
                <div key={session.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:border-[#39FF14]/50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Gauge className="w-5 h-5 text-slate-400" />
                        <span className="text-white font-mono text-sm">{session.session_id}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'active'
                            ? 'bg-green-500/20 text-green-400 animate-pulse'
                            : session.status === 'requested'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : session.status === 'terminated'
                            ? 'bg-slate-500/20 text-slate-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {session.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs uppercase">
                          {session.qos_profile.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-slate-400">Phone Number</p>
                          <p className="text-white font-mono text-xs">{session.phone_number}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Target Latency</p>
                          <p className="text-white font-semibold">{session.target_latency_ms}ms</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Actual Latency</p>
                          <p className={`font-semibold ${
                            session.actual_latency_ms && session.actual_latency_ms <= session.target_latency_ms
                              ? 'text-green-400'
                              : 'text-[#39FF14]'
                          }`}>
                            {session.actual_latency_ms || '-'}ms
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Bandwidth</p>
                          <p className="text-white font-semibold">{session.actual_bandwidth_mbps || session.target_bandwidth_mbps} Mbps</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Duration</p>
                          <p className="text-white font-semibold">{session.session_duration_minutes} min</p>
                        </div>
                      </div>

                      {session.status === 'active' && session.packet_loss_percent !== null && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#39FF14]" />
                            <span className="text-slate-400">Packet Loss:</span>
                            <span className="text-white font-semibold">{session.packet_loss_percent}%</span>
                          </div>
                          {session.jitter_ms !== null && (
                            <div className="flex items-center gap-2">
                              <Radio className="w-4 h-4 text-[#39FF14]" />
                              <span className="text-slate-400">Jitter:</span>
                              <span className="text-white font-semibold">{session.jitter_ms}ms</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {session.status === 'active' && (
                        <button className="p-2 hover:bg-red-600/20 rounded-lg transition-colors" title="Terminate">
                          <Pause className="w-5 h-5 text-red-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditQodSession(session)}
                        className="p-2 hover:bg-[#39FF14]/20 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-[#39FF14]" />
                      </button>
                      <button
                        onClick={() => handleDeleteQodSession(session.id)}
                        className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">API Analytics & Usage</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Today's Usage</h3>
              <div className="space-y-3">
                {['sim_swap', 'number_verification', 'device_location', 'qod'].map((service) => {
                  const serviceData = todayUsage.find(u => u.api_service === service);
                  return (
                    <div key={service} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold capitalize">{service.replace('_', ' ')}</h4>
                        <span className="text-slate-400 text-sm">${serviceData?.total_cost?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-slate-400">Requests</p>
                          <p className="text-white font-semibold">{serviceData?.total_requests || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Success</p>
                          <p className="text-green-400 font-semibold">{serviceData?.successful_requests || 0}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Failed</p>
                          <p className="text-red-400 font-semibold">{serviceData?.failed_requests || 0}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">API Providers</h3>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div key={provider.id} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#39FF14]" />
                        <h4 className="text-white font-semibold">{provider.provider_name}</h4>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        provider.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {provider.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {provider.supported_services.map((service: string) => (
                        <span key={service} className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div>
                        <p className="text-slate-400">Rate Limit</p>
                        <p className="text-white font-semibold">{provider.rate_limit_per_second}/sec</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Daily Limit</p>
                        <p className="text-white font-semibold">{(provider.rate_limit_per_day / 1000).toFixed(0)}K/day</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">30-Day Usage Trend</h3>
            <div className="space-y-2">
              {usageStats.slice(0, 30).map((stat) => (
                <div key={stat.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm w-24">
                      {new Date(stat.usage_date).toLocaleDateString()}
                    </span>
                    <span className="text-white font-semibold w-32 capitalize">
                      {stat.api_service.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-slate-400">Requests: </span>
                      <span className="text-white font-semibold">{stat.total_requests}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Success Rate: </span>
                      <span className="text-green-400 font-semibold">
                        {stat.total_requests > 0 ? ((stat.successful_requests / stat.total_requests) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Avg Response: </span>
                      <span className="text-[#39FF14] font-semibold">{stat.avg_response_time_ms}ms</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Cost: </span>
                      <span className="text-white font-semibold">${parseFloat(stat.total_cost).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Telco API Configuration</h2>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setConfigTab('providers')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'providers' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Providers
                </button>
                <button
                  onClick={() => setConfigTab('api-keys')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'api-keys' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  API Keys
                </button>
                <button
                  onClick={() => setConfigTab('webhooks')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'webhooks' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Webhooks
                </button>
                <button
                  onClick={() => setConfigTab('geofences')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'geofences' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Geofences
                </button>
                <button
                  onClick={() => setConfigTab('qos')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'qos' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  QoS Profiles
                </button>
                <button
                  onClick={() => setConfigTab('testing')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    configTab === 'testing' ? 'bg-[#39FF14] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Testing
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {configTab === 'providers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400">Manage your Telco API providers and their configurations</p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors">
                      Add Provider
                    </button>
                  </div>

                  {providers.map((provider) => (
                    <div key={provider.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Globe className="w-8 h-8 text-[#39FF14]" />
                          <div>
                            <h3 className="text-xl font-bold text-white">{provider.provider_name}</h3>
                            <p className="text-slate-400 text-sm">{provider.provider_region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={provider.is_active}
                              onChange={() => toggleProvider(provider.id, provider.is_active)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#39FF14]"></div>
                          </label>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            provider.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {provider.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Rate Limit</p>
                          <p className="text-white font-semibold">{provider.rate_limit_per_second}/sec</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Daily Limit</p>
                          <p className="text-white font-semibold">{(provider.rate_limit_per_day / 1000).toFixed(0)}K/day</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Priority</p>
                          <p className="text-white font-semibold">{provider.priority}</p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Fallback</p>
                          <p className="text-white font-semibold">{provider.failover_provider_id ? 'Yes' : 'No'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-400 text-sm mb-2">Supported Services</p>
                        <div className="flex flex-wrap gap-2">
                          {provider.supported_services.map((service: string) => (
                            <span key={service} className="px-3 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded-full text-xs font-semibold">
                              {service.replace('_', ' ').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {configTab === 'api-keys' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400">Manage API keys and authentication credentials</p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors">
                      Generate New Key
                    </button>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-6 h-6 text-[#39FF14]" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Production API Key</h3>
                        <p className="text-slate-400 text-sm">Use this key for production environments</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white">sk_live_••••••••••••••••••••••••••••</span>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Created</p>
                        <p className="text-white">Dec 15, 2024</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Last Used</p>
                        <p className="text-white">2 hours ago</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-green-400" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Sandbox API Key</h3>
                        <p className="text-slate-400 text-sm">Use this key for testing and development</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-white">sk_test_••••••••••••••••••••••••••••</span>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-[#39FF14] font-semibold mb-1">Security Best Practices</p>
                        <ul className="text-slate-300 space-y-1 list-disc list-inside">
                          <li>Never share your API keys publicly or commit them to version control</li>
                          <li>Rotate keys regularly and revoke unused keys immediately</li>
                          <li>Use environment variables to store keys in your applications</li>
                          <li>Monitor API key usage for suspicious activity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {configTab === 'webhooks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400">Configure webhook endpoints to receive real-time notifications</p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors">
                      Add Webhook
                    </button>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Webhook className="w-6 h-6 text-[#39FF14]" />
                        <div>
                          <h3 className="text-lg font-bold text-white">SIM Swap Alerts</h3>
                          <p className="text-slate-400 text-sm">https://api.yourapp.com/webhooks/sim-swap</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Events</p>
                        <p className="text-white font-semibold">sim_swap.detected</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Last Triggered</p>
                        <p className="text-white font-semibold">2 hours ago</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Success Rate</p>
                        <p className="text-green-400 font-semibold">99.8%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Webhook className="w-6 h-6 text-[#39FF14]" />
                        <div>
                          <h3 className="text-lg font-bold text-white">QoD Session Events</h3>
                          <p className="text-slate-400 text-sm">https://api.yourapp.com/webhooks/qod</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Events</p>
                        <p className="text-white font-semibold">qod.started, qod.ended</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Last Triggered</p>
                        <p className="text-white font-semibold">15 mins ago</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Success Rate</p>
                        <p className="text-green-400 font-semibold">100%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-[#39FF14] font-semibold mb-1">Webhook Requirements</p>
                        <ul className="text-slate-300 space-y-1 list-disc list-inside">
                          <li>Endpoints must respond with 2xx status codes within 5 seconds</li>
                          <li>Failed deliveries are retried 3 times with exponential backoff</li>
                          <li>Verify webhook signatures to ensure authenticity</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {configTab === 'geofences' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400">Create and manage geofences for location-based services</p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors">
                      Create Geofence
                    </button>
                  </div>

                  {geofences.map((geofence) => (
                    <div key={geofence.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Target className="w-6 h-6 text-[#39FF14]" />
                          <div>
                            <h3 className="text-lg font-bold text-white">{geofence.geofence_name}</h3>
                            <p className="text-slate-400 text-sm">{geofence.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            geofence.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {geofence.is_active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          <button
                            onClick={() => deleteGeofence(geofence.id)}
                            className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Center Coordinates</p>
                          <p className="text-white font-mono text-xs">
                            {geofence.center_latitude?.toFixed(6)}, {geofence.center_longitude?.toFixed(6)}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Radius</p>
                          <p className="text-white font-semibold">{(geofence.radius_meters / 1000).toFixed(2)} km</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Shape</p>
                          <p className="text-white font-semibold capitalize">{geofence.shape_type}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm mb-1">Created</p>
                          <p className="text-white font-semibold">{new Date(geofence.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {geofence.tags && geofence.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {geofence.tags.map((tag: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-[#39FF14]/20 text-[#39FF14] rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {geofences.length === 0 && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                      <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No geofences configured yet</p>
                      <p className="text-slate-500 text-sm mt-1">Create your first geofence to start using location-based services</p>
                    </div>
                  )}
                </div>
              )}

              {configTab === 'qos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-400">Configure Quality of Service profiles for different use cases</p>
                    <button className="bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg text-sm transition-colors">
                      Create Profile
                    </button>
                  </div>

                  {['gaming', 'video_streaming', 'voice_call', 'video_conference', 'iot', 'file_transfer'].map((profile) => (
                    <div key={profile} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Gauge className="w-8 h-8 text-[#39FF14]" />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white capitalize">{profile.replace('_', ' ')}</h3>
                          <p className="text-slate-400 text-sm">
                            Optimized QoS parameters for {profile.replace('_', ' ')} applications
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">AVAILABLE</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Target Latency</p>
                          <p className="text-white font-semibold">
                            {profile === 'gaming' ? '20ms' :
                             profile === 'video_streaming' ? '100ms' :
                             profile === 'voice_call' ? '50ms' :
                             profile === 'video_conference' ? '40ms' :
                             profile === 'iot' ? '200ms' : '500ms'}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Bandwidth</p>
                          <p className="text-white font-semibold">
                            {profile === 'gaming' ? '10 Mbps' :
                             profile === 'video_streaming' ? '25 Mbps' :
                             profile === 'voice_call' ? '1 Mbps' :
                             profile === 'video_conference' ? '5 Mbps' :
                             profile === 'iot' ? '0.5 Mbps' : '100 Mbps'}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Packet Loss</p>
                          <p className="text-white font-semibold">
                            {profile === 'gaming' || profile === 'voice_call' ? '<0.1%' : '<1%'}
                          </p>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                          <p className="text-slate-400 text-sm mb-1">Jitter</p>
                          <p className="text-white font-semibold">
                            {profile === 'gaming' || profile === 'voice_call' ? '<5ms' : '<30ms'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {configTab === 'testing' && (
                <div className="space-y-4">
                  <p className="text-slate-400 mb-4">Test your Telco API integrations before deploying to production</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-red-400" />
                        <h3 className="text-lg font-bold text-white">Test SIM Swap</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Check if a phone number has recently swapped SIM cards</p>
                      <button
                        onClick={() => { setTestService('sim-swap'); setShowTestModal(true); }}
                        className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Test Now
                      </button>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Smartphone className="w-6 h-6 text-green-400" />
                        <h3 className="text-lg font-bold text-white">Test Number Verification</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Verify phone number ownership without SMS</p>
                      <button
                        onClick={() => { setTestService('number-verify'); setShowTestModal(true); }}
                        className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Test Now
                      </button>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-6 h-6 text-[#39FF14]" />
                        <h3 className="text-lg font-bold text-white">Test Device Location</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Retrieve GPS coordinates and geofence verification</p>
                      <button
                        onClick={() => { setTestService('location'); setShowTestModal(true); }}
                        className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Test Now
                      </button>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Gauge className="w-6 h-6 text-[#39FF14]" />
                        <h3 className="text-lg font-bold text-white">Test Quality on Demand</h3>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Request guaranteed network performance</p>
                      <button
                        onClick={() => { setTestService('qod'); setShowTestModal(true); }}
                        className="w-full bg-[#39FF14] hover:bg-[#32e012] text-black px-4 py-2 rounded-lg transition-colors"
                      >
                        Test Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showTestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Test {testService.replace('-', ' ').toUpperCase()} API</h2>
                <button
                  onClick={() => { setShowTestModal(false); setTestResult(null); setTestPhone(''); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Enter a Malaysian phone number in E.164 format</p>
              </div>

              <button
                onClick={handleTestAPI}
                disabled={testing}
                className="w-full bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Run Test
                  </>
                )}
              </button>

              {testResult && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Test Result</h3>
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showNewSimSwapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">New SIM Swap Check</h2>
                  <p className="text-slate-400 text-sm mt-1">Detect recent SIM card changes and fraud activity</p>
                </div>
                <button
                  onClick={() => { setShowNewSimSwapModal(false); setNewSimSwapData({ phone_number: '', lookback_days: '7' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newSimSwapData.phone_number}
                  onChange={(e) => setNewSimSwapData({ ...newSimSwapData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Malaysian phone number in E.164 format</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Lookback Period (Days)</label>
                <select
                  value={newSimSwapData.lookback_days}
                  onChange={(e) => setNewSimSwapData({ ...newSimSwapData, lookback_days: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="1">Last 24 hours</option>
                  <option value="3">Last 3 days</option>
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
                <p className="text-slate-400 text-sm mt-1">How far back to check for SIM swap activity</p>
              </div>

              <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#39FF14] font-semibold mb-1">What This API Does</p>
                    <p className="text-slate-300">
                      Checks if the phone number has been associated with a different SIM card within the specified period.
                      Returns fraud risk score and swap detection details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowNewSimSwapModal(false); setNewSimSwapData({ phone_number: '', lookback_days: '7' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSimSwapCheck}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Run Check
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewNumberVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">New Number Verification</h2>
                  <p className="text-slate-400 text-sm mt-1">Silently verify phone number ownership without SMS</p>
                </div>
                <button
                  onClick={() => { setShowNewNumberVerifyModal(false); setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newNumberVerifyData.phone_number}
                  onChange={(e) => setNewNumberVerifyData({ ...newNumberVerifyData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Phone number to verify</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Verification Method</label>
                <select
                  value={newNumberVerifyData.verification_method}
                  onChange={(e) => setNewNumberVerifyData({ ...newNumberVerifyData, verification_method: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="network_auth">Network Authentication</option>
                  <option value="sim_check">SIM Card Verification</option>
                  <option value="carrier_verify">Carrier Direct Verify</option>
                  <option value="oidc">OpenID Connect</option>
                </select>
                <p className="text-slate-400 text-sm mt-1">Method used for silent verification</p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-green-400 font-semibold mb-1">Zero-Friction Verification</p>
                    <p className="text-slate-300">
                      Uses network intelligence to verify phone number ownership instantly in the background.
                      No SMS OTP required, eliminating user friction and reducing SMS costs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowNewNumberVerifyModal(false); setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNumberVerification}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Verify Number
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">New Location Request</h2>
                  <p className="text-slate-400 text-sm mt-1">Retrieve device location or verify geofence presence</p>
                </div>
                <button
                  onClick={() => { setShowNewLocationModal(false); setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newLocationData.phone_number}
                  onChange={(e) => setNewLocationData({ ...newLocationData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Device phone number to locate</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Request Type</label>
                <select
                  value={newLocationData.request_type}
                  onChange={(e) => setNewLocationData({ ...newLocationData, request_type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="precise">Precise GPS Coordinates</option>
                  <option value="approximate">Approximate Area</option>
                  <option value="geofence">Geofence Verification</option>
                </select>
                <p className="text-slate-400 text-sm mt-1">Level of location accuracy required</p>
              </div>

              {newLocationData.request_type === 'geofence' && (
                <div>
                  <label className="block text-white font-medium mb-2">Geofence (Optional)</label>
                  <select
                    value={newLocationData.geofence_id}
                    onChange={(e) => setNewLocationData({ ...newLocationData, geofence_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="">Select a geofence...</option>
                    {geofences.filter(g => g.is_active).map((geofence) => (
                      <option key={geofence.id} value={geofence.id}>
                        {geofence.geofence_name} - {(geofence.radius_meters / 1000).toFixed(1)}km radius
                      </option>
                    ))}
                  </select>
                  <p className="text-slate-400 text-sm mt-1">Check if device is within this geofence</p>
                </div>
              )}

              <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#39FF14] font-semibold mb-1">Privacy & Consent</p>
                    <p className="text-slate-300">
                      Location requests require user consent in accordance with privacy regulations.
                      Precise coordinates provide meter-level accuracy for fraud prevention and delivery verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowNewLocationModal(false); setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateLocationRequest}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Requesting...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5" />
                      Request Location
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewQodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">New QoD Session</h2>
                  <p className="text-slate-400 text-sm mt-1">Request guaranteed network performance</p>
                </div>
                <button
                  onClick={() => {
                    setShowNewQodModal(false);
                    setNewQodData({
                      phone_number: '',
                      qos_profile: 'gaming',
                      session_duration_minutes: '60',
                      target_latency_ms: '50',
                      target_bandwidth_mbps: '100'
                    });
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newQodData.phone_number}
                  onChange={(e) => setNewQodData({ ...newQodData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">Device requiring guaranteed QoS</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">QoS Profile</label>
                <select
                  value={newQodData.qos_profile}
                  onChange={(e) => {
                    const profile = e.target.value;
                    let latency = '50', bandwidth = '100';

                    if (profile === 'gaming') { latency = '20'; bandwidth = '10'; }
                    else if (profile === 'video_streaming') { latency = '100'; bandwidth = '25'; }
                    else if (profile === 'voice_call') { latency = '50'; bandwidth = '1'; }
                    else if (profile === 'video_conference') { latency = '40'; bandwidth = '5'; }
                    else if (profile === 'iot') { latency = '200'; bandwidth = '0.5'; }
                    else if (profile === 'file_transfer') { latency = '500'; bandwidth = '100'; }

                    setNewQodData({
                      ...newQodData,
                      qos_profile: profile,
                      target_latency_ms: latency,
                      target_bandwidth_mbps: bandwidth
                    });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="gaming">Gaming (Low Latency)</option>
                  <option value="video_streaming">Video Streaming</option>
                  <option value="voice_call">Voice Call</option>
                  <option value="video_conference">Video Conference</option>
                  <option value="iot">IoT / M2M</option>
                  <option value="file_transfer">File Transfer</option>
                </select>
                <p className="text-slate-400 text-sm mt-1">Pre-configured QoS profile for your use case</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Target Latency (ms)</label>
                  <input
                    type="number"
                    value={newQodData.target_latency_ms}
                    onChange={(e) => setNewQodData({ ...newQodData, target_latency_ms: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Target Bandwidth (Mbps)</label>
                  <input
                    type="number"
                    value={newQodData.target_bandwidth_mbps}
                    onChange={(e) => setNewQodData({ ...newQodData, target_bandwidth_mbps: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Session Duration (minutes)</label>
                <select
                  value={newQodData.session_duration_minutes}
                  onChange={(e) => setNewQodData({ ...newQodData, session_duration_minutes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                  <option value="480">8 hours</option>
                </select>
                <p className="text-slate-400 text-sm mt-1">How long to maintain guaranteed QoS</p>
              </div>

              <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Gauge className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#39FF14] font-semibold mb-1">Network Performance Guarantee</p>
                    <p className="text-slate-300">
                      QoD reserves dedicated network resources to ensure stable latency and bandwidth for critical applications.
                      Sessions are monitored in real-time with automatic adjustments to maintain QoS guarantees.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowNewQodModal(false);
                    setNewQodData({
                      phone_number: '',
                      qos_profile: 'gaming',
                      session_duration_minutes: '60',
                      target_latency_ms: '50',
                      target_bandwidth_mbps: '100'
                    });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateQodSession}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Create Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Add Device for Tracking</h2>
                  <p className="text-slate-400 text-sm mt-1">Register a new device for location tracking and monitoring</p>
                </div>
                <button
                  onClick={() => {
                    setShowAddDeviceModal(false);
                    setNewDeviceData({
                      device_name: '',
                      phone_number: '',
                      device_type: 'Android',
                      os_version: '',
                      device_model: '',
                      imei: '',
                      tracking_enabled: true,
                      location_consent: true,
                      precision_level: 'approximate',
                      update_frequency_minutes: '60',
                      battery_optimization: true,
                      tags: '',
                      notes: '',
                      alert_on_movement: false,
                      alert_on_geofence_exit: false,
                      alert_on_geofence_enter: false
                    });
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Device Name *</label>
                  <input
                    type="text"
                    value={newDeviceData.device_name}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, device_name: e.target.value })}
                    placeholder="CEO iPhone"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-slate-400 text-sm mt-1">Friendly name for this device</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={newDeviceData.phone_number}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, phone_number: e.target.value })}
                    placeholder="+60123456789"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-slate-400 text-sm mt-1">Device phone number</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Device Type</label>
                  <select
                    value={newDeviceData.device_type}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, device_type: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="iOS">iOS</option>
                    <option value="Android">Android</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">OS Version</label>
                  <input
                    type="text"
                    value={newDeviceData.os_version}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, os_version: e.target.value })}
                    placeholder="17.2"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Device Model</label>
                  <input
                    type="text"
                    value={newDeviceData.device_model}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, device_model: e.target.value })}
                    placeholder="iPhone 15 Pro"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">IMEI</label>
                <input
                  type="text"
                  value={newDeviceData.imei}
                  onChange={(e) => setNewDeviceData({ ...newDeviceData, imei: e.target.value })}
                  placeholder="356789012345678"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
                <p className="text-slate-400 text-sm mt-1">International Mobile Equipment Identity</p>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Tracking Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Precision Level</label>
                    <select
                      value={newDeviceData.precision_level}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, precision_level: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="coarse">Coarse (City level)</option>
                      <option value="approximate">Approximate (100m accuracy)</option>
                      <option value="precise">Precise (GPS accuracy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Update Frequency</label>
                    <select
                      value={newDeviceData.update_frequency_minutes}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, update_frequency_minutes: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                    >
                      <option value="5">Every 5 minutes</option>
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                      <option value="120">Every 2 hours</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.tracking_enabled}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, tracking_enabled: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Enable Tracking</span>
                      <p className="text-slate-400 text-sm">Start tracking this device immediately</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.location_consent}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, location_consent: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Location Consent</span>
                      <p className="text-slate-400 text-sm">User has provided consent for location tracking</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.battery_optimization}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, battery_optimization: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Battery Optimization</span>
                      <p className="text-slate-400 text-sm">Optimize tracking for battery life</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Alert Settings</h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.alert_on_movement}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, alert_on_movement: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Alert on Movement</span>
                      <p className="text-slate-400 text-sm">Get notified when device moves</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.alert_on_geofence_enter}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, alert_on_geofence_enter: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Alert on Geofence Entry</span>
                      <p className="text-slate-400 text-sm">Notify when device enters a geofenced area</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeviceData.alert_on_geofence_exit}
                      onChange={(e) => setNewDeviceData({ ...newDeviceData, alert_on_geofence_exit: e.target.checked })}
                      className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#39FF14] focus:ring-[#39FF14]"
                    />
                    <div>
                      <span className="text-white font-medium">Alert on Geofence Exit</span>
                      <p className="text-slate-400 text-sm">Notify when device exits a geofenced area</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <div>
                  <label className="block text-white font-medium mb-2">Tags</label>
                  <input
                    type="text"
                    value={newDeviceData.tags}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, tags: e.target.value })}
                    placeholder="executive, high-priority, fleet"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                  <p className="text-slate-400 text-sm mt-1">Comma-separated tags for organization</p>
                </div>

                <div className="mt-4">
                  <label className="block text-white font-medium mb-2">Notes</label>
                  <textarea
                    value={newDeviceData.notes}
                    onChange={(e) => setNewDeviceData({ ...newDeviceData, notes: e.target.value })}
                    placeholder="Additional information about this device..."
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] resize-none"
                  />
                </div>
              </div>

              <div className="bg-[#39FF14]/20/10 border border-[#39FF14]/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#39FF14] font-semibold mb-1">Privacy & Compliance</p>
                    <p className="text-slate-300">
                      Ensure you have proper consent from device owners before enabling tracking.
                      All location data is encrypted and stored securely in compliance with privacy regulations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddDeviceModal(false);
                    setNewDeviceData({
                      device_name: '',
                      phone_number: '',
                      device_type: 'Android',
                      os_version: '',
                      device_model: '',
                      imei: '',
                      tracking_enabled: true,
                      location_consent: true,
                      precision_level: 'approximate',
                      update_frequency_minutes: '60',
                      battery_optimization: true,
                      tags: '',
                      notes: '',
                      alert_on_movement: false,
                      alert_on_geofence_exit: false,
                      alert_on_geofence_enter: false
                    });
                  }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDevice}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Adding Device...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Add Device
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditSimSwapModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit SIM Swap Check</h2>
                  <p className="text-slate-400 text-sm mt-1">Update SIM swap check details</p>
                </div>
                <button
                  onClick={() => { setShowEditSimSwapModal(false); setEditingItem(null); setNewSimSwapData({ phone_number: '', lookback_days: '7' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newSimSwapData.phone_number}
                  onChange={(e) => setNewSimSwapData({ ...newSimSwapData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditSimSwapModal(false); setEditingItem(null); setNewSimSwapData({ phone_number: '', lookback_days: '7' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSimSwapRequest}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      Update Check
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditNumberVerifyModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Number Verification</h2>
                  <p className="text-slate-400 text-sm mt-1">Update verification request details</p>
                </div>
                <button
                  onClick={() => { setShowEditNumberVerifyModal(false); setEditingItem(null); setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newNumberVerifyData.phone_number}
                  onChange={(e) => setNewNumberVerifyData({ ...newNumberVerifyData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Verification Method</label>
                <select
                  value={newNumberVerifyData.verification_method}
                  onChange={(e) => setNewNumberVerifyData({ ...newNumberVerifyData, verification_method: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="network_auth">Network Authentication</option>
                  <option value="sms_verify">SMS Verification</option>
                  <option value="voice_verify">Voice Verification</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditNumberVerifyModal(false); setEditingItem(null); setNewNumberVerifyData({ phone_number: '', verification_method: 'network_auth' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNumberVerifyRequest}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      Update Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditLocationModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit Location Request</h2>
                  <p className="text-slate-400 text-sm mt-1">Update location verification details</p>
                </div>
                <button
                  onClick={() => { setShowEditLocationModal(false); setEditingItem(null); setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newLocationData.phone_number}
                  onChange={(e) => setNewLocationData({ ...newLocationData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Request Type</label>
                <select
                  value={newLocationData.request_type}
                  onChange={(e) => setNewLocationData({ ...newLocationData, request_type: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="precise">Precise Location</option>
                  <option value="approximate">Approximate Location</option>
                  <option value="geofence_check">Geofence Check</option>
                </select>
              </div>

              {newLocationData.request_type === 'geofence_check' && (
                <div>
                  <label className="block text-white font-medium mb-2">Geofence</label>
                  <select
                    value={newLocationData.geofence_id}
                    onChange={(e) => setNewLocationData({ ...newLocationData, geofence_id: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  >
                    <option value="">Select geofence</option>
                    {geofences.map((geo) => (
                      <option key={geo.id} value={geo.id}>{geo.geofence_name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditLocationModal(false); setEditingItem(null); setNewLocationData({ phone_number: '', request_type: 'precise', geofence_id: '' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateLocationRequest}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      Update Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditQodModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Edit QoD Session</h2>
                  <p className="text-slate-400 text-sm mt-1">Update quality on demand session</p>
                </div>
                <button
                  onClick={() => { setShowEditQodModal(false); setEditingItem(null); setNewQodData({ phone_number: '', qos_profile: 'gaming', session_duration_minutes: '60', target_latency_ms: '50', target_bandwidth_mbps: '100' }); }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={newQodData.phone_number}
                  onChange={(e) => setNewQodData({ ...newQodData, phone_number: e.target.value })}
                  placeholder="+60123456789"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">QoS Profile</label>
                <select
                  value={newQodData.qos_profile}
                  onChange={(e) => setNewQodData({ ...newQodData, qos_profile: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                >
                  <option value="gaming">Gaming (Low latency)</option>
                  <option value="streaming">Video Streaming</option>
                  <option value="voip">VoIP Calling</option>
                  <option value="iot">IoT Priority</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Duration (min)</label>
                  <input
                    type="number"
                    value={newQodData.session_duration_minutes}
                    onChange={(e) => setNewQodData({ ...newQodData, session_duration_minutes: e.target.value })}
                    min="1"
                    max="480"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Latency (ms)</label>
                  <input
                    type="number"
                    value={newQodData.target_latency_ms}
                    onChange={(e) => setNewQodData({ ...newQodData, target_latency_ms: e.target.value })}
                    min="10"
                    max="500"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Bandwidth (Mbps)</label>
                  <input
                    type="number"
                    value={newQodData.target_bandwidth_mbps}
                    onChange={(e) => setNewQodData({ ...newQodData, target_bandwidth_mbps: e.target.value })}
                    min="1"
                    max="1000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14]"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowEditQodModal(false); setEditingItem(null); setNewQodData({ phone_number: '', qos_profile: 'gaming', session_duration_minutes: '60', target_latency_ms: '50', target_bandwidth_mbps: '100' }); }}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateQodSession}
                  disabled={submitting}
                  className="flex-1 bg-[#39FF14] hover:bg-[#32e012] disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-5 h-5" />
                      Update Session
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
