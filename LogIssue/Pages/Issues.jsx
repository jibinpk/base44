import React, { useState, useEffect } from "react";
import { SupportIssue } from "@/entities/SupportIssue";
import { Plus, Search, Filter, Grid, List, Kanban } from "lucide-react";

import IssueModal from "../Components/issues/IssueModal";
import TableView from "../Components/issues/TableView";
import KanbanView from "../Components/issues/KanbanView";
import FilterPanel from "../Components/issues/FilterPanel";
import SearchBar from "../Components/issues/SearchBar";

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    plugin: '',
    category: '',
    recurring: '',
    escalated: ''
  });

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [issues, filters, searchTerm]);

  const loadIssues = async () => {
    try {
      const data = await SupportIssue.list('-created_date');
      setIssues(data);
    } catch (error) {
      console.error('Error loading issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...issues];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.issue_summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.plugin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.client_reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        switch (key) {
          case 'status':
            filtered = filtered.filter(issue => issue.status === value);
            break;
          case 'plugin':
            filtered = filtered.filter(issue => issue.plugin_name === value);
            break;
          case 'category':
            filtered = filtered.filter(issue => issue.issue_category === value);
            break;
          case 'recurring':
            filtered = filtered.filter(issue => issue.recurring_issue === (value === 'true'));
            break;
          case 'escalated':
            filtered = filtered.filter(issue => issue.escalated_to_dev === (value === 'true'));
            break;
        }
      }
    });

    setFilteredIssues(filtered);
  };

  const handleSaveIssue = async (issueData) => {
    try {
      if (editingIssue) {
        await SupportIssue.update(editingIssue.id, issueData);
      } else {
        await SupportIssue.create(issueData);
      }
      loadIssues();
      setShowModal(false);
      setEditingIssue(null);
    } catch (error) {
      console.error('Error saving issue:', error);
    }
  };

  const handleEditIssue = (issue) => {
    setEditingIssue(issue);
    setShowModal(true);
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      try {
        await SupportIssue.delete(issueId);
        loadIssues();
      } catch (error) {
        console.error('Error deleting issue:', error);
      }
    }
  };

  const viewButtons = [
    { id: 'table', icon: List, label: 'Table' },
    { id: 'kanban', icon: Kanban, label: 'Kanban' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Support Issues
        </h1>
        
        <div className="flex flex-wrap gap-3">
          {/* View Mode Selector */}
          <div className="flex neumorphic rounded-2xl p-1">
            {viewButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setViewMode(button.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  viewMode === button.id ? 'neumorphic-inset' : ''
                }`}
                style={{ 
                  color: viewMode === button.id ? 'var(--accent)' : 'var(--text-primary)'
                }}
              >
                <button.icon className="w-4 h-4" />
                {button.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`neumorphic-button px-4 py-2 rounded-2xl font-medium flex items-center gap-2 ${
              showFilters ? 'neumorphic-inset' : ''
            }`}
            style={{ color: 'var(--text-primary)' }}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

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

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            issues={issues}
          />
        )}
      </div>

      {/* Content */}
      <div className="neumorphic-card p-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-16 neumorphic-inset rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'table' && (
              <TableView
                issues={filteredIssues}
                onEdit={handleEditIssue}
                onDelete={handleDeleteIssue}
              />
            )}
            {viewMode === 'kanban' && (
              <KanbanView
                issues={filteredIssues}
                onEdit={handleEditIssue}
                onDelete={handleDeleteIssue}
                onStatusChange={handleSaveIssue}
              />
            )}
          </>
        )}
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