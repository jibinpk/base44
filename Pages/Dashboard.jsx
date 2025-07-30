
import React, { useState, useEffect } from "react";
import { SupportIssue } from "@/entities/SupportIssue";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import { Clock, AlertTriangle, CheckCircle, TrendingUp, Plus } from "lucide-react";

import StatsCard from "../components/dashboard/StatsCard";
import ChartCard from "../components/dashboard/ChartCard";
import IssueModal from "../components/issues/IssueModal";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    escalated: 0,
    recurring: 0,
    averageTime: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await SupportIssue.list('-created_date');
      setIssues(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const open = data.filter(issue => issue.status === 'Open').length;
    const resolved = data.filter(issue => issue.status === 'Resolved').length;
    const escalated = data.filter(issue => issue.status === 'Escalated').length;
    const recurring = data.filter(issue => issue.recurring_issue).length;
    const averageTime = data.length > 0 ? 
      Math.round(data.reduce((sum, issue) => sum + (issue.time_spent || 0), 0) / data.length) : 0;

    setStats({
      total,
      open,
      resolved,
      escalated,
      recurring,
      averageTime
    });
  };
  
  const handleSaveIssue = async (issueData) => {
    try {
      if (editingIssue) {
        await SupportIssue.update(editingIssue.id, issueData);
      } else {
        await SupportIssue.create(issueData);
      }
      loadData();
      setShowModal(false);
      setEditingIssue(null);
    } catch (error) {
      console.error('Error saving issue:', error);
    }
  };

  const getCategoryData = () => {
    const categories = {};
    issues.forEach(issue => {
      categories[issue.issue_category] = (categories[issue.issue_category] || 0) + 1;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const getPluginData = () => {
    const plugins = {};
    issues.forEach(issue => {
      plugins[issue.plugin_name] = (plugins[issue.plugin_name] || 0) + 1;
    });
    return Object.entries(plugins).map(([name, value]) => ({ name, value }));
  };

  const getTimelineData = () => {
    const timeline = {};
    issues.forEach(issue => {
      const date = new Date(issue.created_date).toLocaleDateString();
      timeline[date] = (timeline[date] || 0) + 1;
    });
    return Object.entries(timeline)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, count]) => ({ date, count }));
  };

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 neumorphic-inset rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 neumorphic-inset rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <div className="flex items-center gap-4">
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Last updated: {new Date().toLocaleString()}
            </div>
            <button
                onClick={() => {
                  setEditingIssue(null);
                  setShowModal(true);
                }}
                className="neumorphic-button px-6 py-2 rounded-2xl font-medium flex items-center gap-2"
                style={{ color: 'var(--accent)' }}
              >
              <Plus className="w-4 h-4" />
              New Issue
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Issues"
          value={stats.total}
          icon={TrendingUp}
          color="var(--accent)"
        />
        <StatsCard
          title="Open Issues"
          value={stats.open}
          icon={AlertTriangle}
          color="#f5576c"
        />
        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon={CheckCircle}
          color="#43e97b"
        />
        <StatsCard
          title="Avg Time (min)"
          value={stats.averageTime}
          icon={Clock}
          color="#4facfe"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Issues by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Issues by Plugin">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPluginData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neumorphic-dark)" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Issues Over Time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getTimelineData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--neumorphic-dark)" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="var(--accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Modal */}
      {showModal && (
        <IssueModal
          issue={editingIssue}
          onSave={handleSaveIssue}
          onClose={() => {
            setShowModal(false);
            setEditingIssue(null);
          }}
        />
      )}
    </div>
  );
}
