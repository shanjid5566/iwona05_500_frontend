import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-toastify';
import Spinner from '../../components/common/Spinner';
import { settingsService } from '../../services/api.services';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: '',
    contactEmail: '',
    defaultHomeAirport: '',
    aboutUsText: '',
    requireEmailConfirmation: false,
    allowPublicRegistration: false,
  });
  const [originalSettings, setOriginalSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        websiteName: settings.websiteName,
        contactEmail: settings.contactEmail,
        defaultHomeAirport: settings.defaultHomeAirport,
        aboutUsText: settings.aboutUsText,
        requireEmailConfirm: settings.requireEmailConfirmation,
        allowPublicReg: settings.allowPublicRegistration,
      };
      const res = await settingsService.updateSettings(payload);
      if (res.success) {
        toast.success('Settings updated successfully');
        // Update original and state from response if provided
        const s = res.data?.settings;
        if (s) {
          const mapped = {
            websiteName: s.websiteName || '',
            contactEmail: s.contactEmail || '',
            defaultHomeAirport: s.defaultHomeAirport || '',
            aboutUsText: s.aboutUsText || '',
            requireEmailConfirmation: !!s.requireEmailConfirm,
            allowPublicRegistration: !!s.allowPublicReg,
          };
          setSettings(mapped);
          setOriginalSettings(mapped);
        }
        setHasChanges(false);
      } else {
        toast.error(res.message || 'Failed to update settings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original fetched values
    if (originalSettings) {
      setSettings(originalSettings);
    }
    setHasChanges(false);
  };

  // Fetch settings on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await settingsService.getSettings();
        if (res.success) {
          const s = res.data?.settings || {};
          const mapped = {
            websiteName: s.websiteName || '',
            contactEmail: s.contactEmail || '',
            defaultHomeAirport: s.defaultHomeAirport || '',
            aboutUsText: s.aboutUsText || '',
            requireEmailConfirmation: !!s.requireEmailConfirm,
            allowPublicRegistration: !!s.allowPublicReg,
          };
          setSettings(mapped);
          setOriginalSettings(mapped);
        } else {
          toast.error(res.message || 'Failed to load settings');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load settings');
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Website Settings</h1>
        </div>

        {/* Website Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Website Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Name
              </label>
              <input
                type="text"
                name="websiteName"
                value={settings.websiteName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none"
              />
            </div>

            {/* Default Home Airport */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Home Airport
              </label>
              <select
                name="defaultHomeAirport"
                value={settings.defaultHomeAirport}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none bg-white"
              >
                <option value="Dublin">Dublin</option>
                <option value="Cork">Cork</option>
                <option value="Shannon">Shannon</option>
                <option value="Kerry">Kerry</option>
              </select>
            </div>

            {/* About Us Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Us Text
              </label>
              <textarea
                name="aboutUsText"
                value={settings.aboutUsText}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
          
          <div className="space-y-4">
            {/* Require Email Confirmation */}
            <div className="flex items-start">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  name="requireEmailConfirmation"
                  checked={settings.requireEmailConfirmation}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-olive border-gray-300 rounded focus:ring-olive cursor-pointer"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Require Email Confirmation for New Accounts
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Users will need to verify their email address before accessing their account
                </p>
              </div>
            </div>

            {/* Allow Public Registration */}
            <div className="flex items-start">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  name="allowPublicRegistration"
                  checked={settings.allowPublicRegistration}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-olive border-gray-300 rounded focus:ring-olive cursor-pointer"
                />
              </div>
              <div className="ml-3">
                <label className="text-sm font-medium text-gray-900 cursor-pointer">
                  Allow Public Registration
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  Enable new users to create accounts through the signup page
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: hasChanges ? '#7a7d5a' : '#9ca3af' }}
            onMouseEnter={(e) => hasChanges && (e.currentTarget.style.backgroundColor = '#6a6d4a')}
            onMouseLeave={(e) => hasChanges && (e.currentTarget.style.backgroundColor = '#7a7d5a')}
          >
            {saving ? (
              <>
                <Spinner />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Note about changes */}
        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  You have unsaved changes. Make sure to save your settings before leaving this page.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
