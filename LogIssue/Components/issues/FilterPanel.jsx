
import React, { useState, useEffect } from 'react';
import { AppConfig } from "@/entities/AppConfig";

export default function FilterPanel({ filters, onFiltersChange }) {
  const [options, setOptions] = useState({
    plugins: [],
    categories: [],
    statuses: []
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const configs = await AppConfig.list();
        const plugins = configs.find(c => c.key === 'plugin_options')?.value || [];
        const categories = configs.find(c => c.key === 'category_options')?.value || [];
        const statuses = configs.find(c => c.key === 'status_options')?.value || [];
        setOptions({ plugins, categories, statuses });
      } catch (error) {
        console.error("Failed to fetch dropdown options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const filterGroups = [
    {
      key: 'status',
      label: 'Status',
      options: ['all', ...options.statuses]
    },
    {
      key: 'plugin',
      label: 'Plugin',
      options: ['all', ...options.plugins]
    },
    {
      key: 'category',
      label: 'Category',
      options: ['all', ...options.categories]
    },
    {
      key: 'recurring',
      label: 'Recurring',
      options: [
        { value: 'all', label: 'All' },
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    },
    {
      key: 'escalated',
      label: 'Escalated',
      options: [
        { value: 'all', label: 'All' },
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' }
      ]
    }
  ];

  return (
    <div className="neumorphic-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {filterGroups.map(group => (
          <div key={group.key}>
            <label className="block text-sm font-medium mb-2" 
                   style={{ color: 'var(--text-secondary)' }}>
              {group.label}
            </label>
            <select
              value={filters[group.key] || 'all'}
              onChange={(e) => handleFilterChange(group.key, e.target.value)}
              className="input-neumorphic w-full px-4 py-2 rounded-xl font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {group.options.map(option => {
                const value = typeof option === 'string' ? option : option.value;
                const label = typeof option === 'string' ? option : option.label;
                return (
                  <option key={value} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
