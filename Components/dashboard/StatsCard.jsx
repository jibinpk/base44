import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="neumorphic-card p-6 hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            {title}
          </p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
        </div>
        <div 
          className="p-3 rounded-2xl neumorphic-inset"
          style={{ backgroundColor: 'var(--neumorphic-bg)' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}