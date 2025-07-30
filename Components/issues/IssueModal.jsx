
import React, { useState, useEffect } from 'react';
import { AppConfig } from "@/entities/AppConfig";
import { X, Save } from 'lucide-react';

export default function IssueModal({ issue, onSave, onClose }) {
  const [formData, setFormData] = useState({
    client_reference_id: issue?.client_reference_id || '',
    plugin_name: issue?.plugin_name || '',
    plugin_version: issue?.plugin_version || '',
    wordpress_version: issue?.wordpress_version || '',
    woocommerce_version: issue?.woocommerce_version || '',
    issue_category: issue?.issue_category || '',
    issue_summary: issue?.issue_summary || '',
    detailed_description: issue?.detailed_description || '',
    steps_to_reproduce: issue?.steps_to_reproduce || '',
    errors_logs: issue?.errors_logs || '',
    troubleshooting_steps: issue?.troubleshooting_steps || '',
    resolution: issue?.resolution || '',
    time_spent: issue?.time_spent || 0,
    escalated_to_dev: issue?.escalated_to_dev || false,
    status: issue?.status || 'Open',
    recurring_issue: issue?.recurring_issue || false
  });
  
  const [pluginOptions, setPluginOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const configs = await AppConfig.list();
        const plugins = configs.find(c => c.key === 'plugin_options')?.value || [];
        const categories = configs.find(c => c.key === 'category_options')?.value || [];
        setPluginOptions(plugins);
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Failed to fetch dropdown options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="neumorphic-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {issue ? 'Edit Issue' : 'New Issue'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="neumorphic-button p-2 rounded-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Client Reference ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_reference_id}
                  onChange={(e) => handleChange('client_reference_id', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Plugin Name *
                </label>
                <select
                  required
                  value={formData.plugin_name}
                  onChange={(e) => handleChange('plugin_name', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">Select Plugin</option>
                  {pluginOptions.map(plugin => (
                    <option key={plugin} value={plugin}>{plugin}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Plugin Version
                </label>
                <input
                  type="text"
                  value={formData.plugin_version}
                  onChange={(e) => handleChange('plugin_version', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  WordPress Version
                </label>
                <input
                  type="text"
                  value={formData.wordpress_version}
                  onChange={(e) => handleChange('wordpress_version', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  WooCommerce Version
                </label>
                <input
                  type="text"
                  value={formData.woocommerce_version}
                  onChange={(e) => handleChange('woocommerce_version', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={ { color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Issue Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Issue Category *
                </label>
                <select
                  required
                  value={formData.issue_category}
                  onChange={(e) => handleChange('issue_category', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="Open">Open</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" 
                       style={{ color: 'var(--text-secondary)' }}>
                  Time Spent (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.time_spent}
                  onChange={(e) => handleChange('time_spent', parseInt(e.target.value) || 0)}
                  className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                  style={{ color: 'var(--text-primary)' }}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.escalated_to_dev}
                    onChange={(e) => handleChange('escalated_to_dev', e.target.checked)}
                    className="w-5 h-5 neumorphic-inset rounded"
                  />
                  <span style={{ color: 'var(--text-primary)' }}>Escalated to Dev Team</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.recurring_issue}
                    onChange={(e) => handleChange('recurring_issue', e.target.checked)}
                    className="w-5 h-5 neumorphic-inset rounded"
                  />
                  <span style={{ color: 'var(--text-primary)' }}>Recurring Issue</span>
                </label>
              </div>
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Issue Summary *
              </label>
              <input
                type="text"
                required
                value={formData.issue_summary}
                onChange={(e) => handleChange('issue_summary', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Detailed Description
              </label>
              <textarea
                rows="4"
                value={formData.detailed_description}
                onChange={(e) => handleChange('detailed_description', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Steps to Reproduce
              </label>
              <textarea
                rows="4"
                value={formData.steps_to_reproduce}
                onChange={(e) => handleChange('steps_to_reproduce', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Errors/Logs
              </label>
              <textarea
                rows="4"
                value={formData.errors_logs}
                onChange={(e) => handleChange('errors_logs', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Troubleshooting Steps Taken
              </label>
              <textarea
                rows="4"
                value={formData.troubleshooting_steps}
                onChange={(e) => handleChange('troubleshooting_steps', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" 
                     style={{ color: 'var(--text-secondary)' }}>
                Resolution
              </label>
              <textarea
                rows="4"
                value={formData.resolution}
                onChange={(e) => handleChange('resolution', e.target.value)}
                className="input-neumorphic w-full px-4 py-3 rounded-xl font-medium resize-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="neumorphic-button px-6 py-3 rounded-xl font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="neumorphic-button px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              style={{ color: 'var(--accent)' }}
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
