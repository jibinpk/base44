import React from 'react';
import { Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function TableView({ issues, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#f5576c';
      case 'Resolved': return '#43e97b';
      case 'Escalated': return '#667eea';
      default: return 'var(--text-secondary)';
    }
  };

  const getPriorityIcon = (issue) => {
    if (issue.escalated_to_dev) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (issue.recurring_issue) return <Clock className="w-4 h-4 text-orange-500" />;
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--neumorphic-dark)' }}>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Reference ID
            </th>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Plugin
            </th>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Issue Summary
            </th>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Category
            </th>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Status
            </th>
            <th className="text-left py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Created
            </th>
            <th className="text-right py-4 px-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-b hover:bg-opacity-50 transition-colors duration-200"
                style={{ borderColor: 'var(--neumorphic-dark)' }}>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(issue)}
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {issue.client_reference_id}
                  </span>
                </div>
              </td>
              <td className="py-4 px-4" style={{ color: 'var(--text-primary)' }}>
                {issue.plugin_name}
              </td>
              <td className="py-4 px-4">
                <div className="max-w-xs">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {issue.issue_summary}
                  </p>
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {issue.detailed_description}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="neumorphic-inset px-3 py-1 rounded-xl text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}>
                  {issue.issue_category}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className="neumorphic-inset px-3 py-1 rounded-xl text-sm font-medium"
                      style={{ color: getStatusColor(issue.status) }}>
                  {issue.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {format(new Date(issue.created_date), 'MMM d, yyyy')}
              </td>
              <td className="py-4 px-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(issue)}
                    className="neumorphic-button p-2 rounded-xl hover:scale-105 transition-transform duration-200"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(issue.id)}
                    className="neumorphic-button p-2 rounded-xl hover:scale-105 transition-transform duration-200"
                    style={{ color: '#f5576c' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {issues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            No issues found
          </p>
        </div>
      )}
    </div>
  );
}