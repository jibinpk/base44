import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="neumorphic-card p-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" 
               style={{ color: 'var(--text-secondary)' }} />
        <input
          type="text"
          placeholder="Search issues by summary, plugin, or reference ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-neumorphic w-full pl-12 pr-4 py-3 rounded-2xl font-medium"
          style={{ 
            color: 'var(--text-primary)',
            fontSize: '16px'
          }}
        />
      </div>
    </div>
  );
}