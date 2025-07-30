import React, { useState } from "react";
import { SupportIssue } from "@/entities/SupportIssue";
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function ImportExport() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const issues = await SupportIssue.list('-created_date');
      
      let content, filename, mimeType;
      
      if (format === 'csv') {
        const headers = [
          'Client Reference ID', 'Plugin Name', 'Plugin Version', 'WordPress Version',
          'WooCommerce Version', 'Issue Category', 'Issue Summary', 'Detailed Description',
          'Steps to Reproduce', 'Errors/Logs', 'Troubleshooting Steps', 'Resolution',
          'Time Spent', 'Escalated to Dev', 'Status', 'Recurring Issue', 'Created Date'
        ];
        
        const csvData = issues.map(issue => [
          issue.client_reference_id || '',
          issue.plugin_name || '',
          issue.plugin_version || '',
          issue.wordpress_version || '',
          issue.woocommerce_version || '',
          issue.issue_category || '',
          issue.issue_summary || '',
          issue.detailed_description || '',
          issue.steps_to_reproduce || '',
          issue.errors_logs || '',
          issue.troubleshooting_steps || '',
          issue.resolution || '',
          issue.time_spent || 0,
          issue.escalated_to_dev ? 'Yes' : 'No',
          issue.status || '',
          issue.recurring_issue ? 'Yes' : 'No',
          new Date(issue.created_date).toLocaleString()
        ]);
        
        content = [headers, ...csvData].map(row => 
          row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        filename = `support-issues-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = JSON.stringify(issues, null, 2);
        filename = `support-issues-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (file) => {
    setImporting(true);
    setImportResult(null);
    
    try {
      const text = await file.text();
      let data;
      
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          const obj = {};
          headers.forEach((header, index) => {
            const key = header.toLowerCase().replace(/\s+/g, '_');
            let value = values[index] || '';
            
            // Convert specific fields
            if (key === 'time_spent') {
              value = parseInt(value) || 0;
            } else if (key === 'escalated_to_dev' || key === 'recurring_issue') {
              value = value.toLowerCase() === 'yes';
            }
            
            obj[key] = value;
          });
          return obj;
        });
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }
      
      // Validate and import
      const validIssues = data.filter(item => 
        item.client_reference_id && item.plugin_name && item.issue_category && item.issue_summary
      );
      
      let imported = 0;
      let duplicates = 0;
      
      for (const issue of validIssues) {
        try {
          // Check for duplicates by client_reference_id
          const existing = await SupportIssue.filter({ 
            client_reference_id: issue.client_reference_id 
          });
          
          if (existing.length === 0) {
            await SupportIssue.create(issue);
            imported++;
          } else {
            duplicates++;
          }
        } catch (error) {
          console.error('Error importing issue:', error);
        }
      }
      
      setImportResult({
        success: true,
        total: data.length,
        imported,
        duplicates,
        invalid: data.length - validIssues.length
      });
      
    } catch (error) {
      setImportResult({
        success: false,
        error: error.message
      });
    } finally {
      setImporting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/json' || file.type === 'text/csv' || 
                 file.name.endsWith('.json') || file.name.endsWith('.csv'))) {
      handleImport(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Import & Export
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <div className="neumorphic-card p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" 
              style={{ color: 'var(--text-primary)' }}>
            <Download className="w-6 h-6" />
            Export Data
          </h2>
          
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Download your support issues data as CSV or JSON format for backup or analysis.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="neumorphic-button w-full px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 hover:scale-105 transition-all duration-200"
              style={{ color: 'var(--text-primary)' }}
            >
              <FileText className="w-5 h-5" />
              {exporting ? 'Exporting...' : 'Export as CSV'}
            </button>
            
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="neumorphic-button w-full px-6 py-4 rounded-2xl font-medium flex items-center justify-center gap-3 hover:scale-105 transition-all duration-200"
              style={{ color: 'var(--text-primary)' }}
            >
              <FileText className="w-5 h-5" />
              {exporting ? 'Exporting...' : 'Export as JSON'}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="neumorphic-card p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" 
              style={{ color: 'var(--text-primary)' }}>
            <Upload className="w-6 h-6" />
            Import Data
          </h2>
          
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            Upload CSV or JSON files to import support issues. Duplicates will be detected by Client Reference ID.
          </p>
          
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
              dragActive ? 'neumorphic-inset' : 'neumorphic'
            }`}
            style={{ borderColor: dragActive ? 'var(--accent)' : 'var(--neumorphic-dark)' }}
          >
            <input
              type="file"
              accept=".csv,.json"
              onChange={(e) => e.target.files[0] && handleImport(e.target.files[0])}
              className="hidden"
              id="file-input"
            />
            
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto neumorphic-inset rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>
              
              <div>
                <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  {importing ? 'Importing...' : 'Drop files here or click to browse'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Supports CSV and JSON files
                </p>
              </div>
              
              {!importing && (
                <label
                  htmlFor="file-input"
                  className="neumorphic-button inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium cursor-pointer hover:scale-105 transition-all duration-200"
                  style={{ color: 'var(--accent)' }}
                >
                  <FileText className="w-4 h-4" />
                  Choose File
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Import Results */}
      {importResult && (
        <div className="neumorphic-card p-6">
          <div className="flex items-start gap-4">
            {importResult.success ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            )}
            
            <div className="flex-1">
              <h3 className="font-semibold mb-2" 
                  style={{ color: importResult.success ? '#43e97b' : '#f5576c' }}>
                {importResult.success ? 'Import Completed' : 'Import Failed'}
              </h3>
              
              {importResult.success ? (
                <div className="space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  <p>Total records processed: {importResult.total}</p>
                  <p>Successfully imported: {importResult.imported}</p>
                  <p>Duplicates skipped: {importResult.duplicates}</p>
                  <p>Invalid records: {importResult.invalid}</p>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>
                  {importResult.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}