
import React, { useState, useEffect } from 'react';
import { AppConfig } from "@/entities/AppConfig";
import { format } from 'date-fns';
import { Clock, AlertTriangle, Edit, Trash2 } from 'lucide-react';

export default function KanbanView({ issues, onEdit, onDelete, onStatusChange }) {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const config = await AppConfig.filter({ key: 'status_options' });
        if (config.length > 0) {
          setStatuses(config[0].value);
        } else {
          setStatuses(['Open', 'Resolved', 'Escalated']); // Fallback
        }
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
        setStatuses(['Open', 'Resolved', 'Escalated']); // Fallback
      }
    };
    fetchStatuses();
  }, []);
  
  const getIssuesByStatus = (status) => {
    return issues.filter(issue => issue.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#f5576c';
      case 'Resolved': return '#43e97b';
      case 'Escalated': return '#667eea';
      default: return 'var(--text-secondary)';
    }
  };

  const handleStatusChange = async (issue, newStatus) => {
    if (issue.status !== newStatus) {
      await onStatusChange(issue.id, { ...issue, status: newStatus });
    }
  };

  if (statuses.length === 0) {
      return <div>Loading statuses...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statuses.map(status => (
        <div key={status} className="space-y-4">
          {/* Column Header */}
          <div className="neumorphic-inset p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2"
                  style={{ color: getStatusColor(status) }}>
                <div className="w-3 h-3 rounded-full"
                     style={{ backgroundColor: getStatusColor(status) }}></div>
                {status}
              </h3>
              <span className="neumorphic-inset px-3 py-1 rounded-xl text-sm font-medium"
                    style={{ color: 'var(--text-primary)' }}>
                {getIssuesByStatus(status).length}
              </span>
            </div>
          </div>

          {/* Issues */}
          <div className="space-y-3 min-h-64">
            {getIssuesByStatus(status).map(issue => (
              <div key={issue.id} 
                   className="neumorphic-card p-4 cursor-pointer hover:scale-105 transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {issue.escalated_to_dev && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    {issue.recurring_issue && <Clock className="w-4 h-4 text-orange-500" />}
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {issue.client_reference_id}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(issue);
                      }}
                      className="neumorphic-button p-1 rounded-lg hover:scale-110 transition-transform duration-200"
                      style={{ color: 'var(--accent)' }}
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(issue.id);
                      }}
                      className="neumorphic-button p-1 rounded-lg hover:scale-110 transition-transform duration-200"
                      style={{ color: '#f5576c' }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <h4 className="font-semibold mb-2 line-clamp-2" 
                    style={{ color: 'var(--text-primary)' }}>
                  {issue.issue_summary}
                </h4>

                <p className="text-sm mb-3 line-clamp-2" 
                   style={{ color: 'var(--text-secondary)' }}>
                  {issue.detailed_description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="neumorphic-inset px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ color: 'var(--text-primary)' }}>
                    {issue.plugin_name}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {format(new Date(issue.created_date), 'MMM d')}
                  </span>
                </div>

                {issue.time_spent && (
                  <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Time spent: {issue.time_spent} min
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
