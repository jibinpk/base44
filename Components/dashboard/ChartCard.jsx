import React from 'react';

export default function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`neumorphic-card p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <div className="neumorphic-inset rounded-2xl p-4">
        {children}
      </div>
    </div>
  );
}