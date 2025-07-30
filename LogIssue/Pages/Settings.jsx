import React, { useState } from "react";
import { Settings as SettingsIcon, User, Shield, Database } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    notifications: false,
    darkMode: false,
    compactView: false
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingSections = [
    {
      title: "General",
      icon: SettingsIcon,
      settings: [
        {
          key: 'compactView',
          label: 'Compact View',
          description: 'Show more items in less space'
        }
      ]
    },
    {
      title: "Data Management",
      icon: Database,
      settings: [
        {
          key: 'autoBackup',
          label: 'Auto Backup',
          description: 'Automatically backup data daily'
        }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      settings: [
        {
          key: 'notifications',
          label: 'Security Notifications',
          description: 'Get notified of security events'
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>

      <div className="space-y-6">
        {settingSections.map(section => (
          <div key={section.title} className="neumorphic-card p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3" 
                style={{ color: 'var(--text-primary)' }}>
              <section.icon className="w-6 h-6" />
              {section.title}
            </h2>
            
            <div className="space-y-4">
              {section.settings.map(setting => (
                <div key={setting.key} className="flex items-center justify-between p-4 neumorphic-inset rounded-2xl">
                  <div>
                    <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                      {setting.label}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {setting.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleToggle(setting.key)}
                    className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                      settings[setting.key] ? 'neumorphic-inset' : 'neumorphic'
                    }`}
                    style={{ 
                      backgroundColor: settings[setting.key] ? 'var(--accent)' : 'var(--neumorphic-bg)'
                    }}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full neumorphic transition-all duration-200 ${
                        settings[setting.key] ? 'left-7' : 'left-1'
                      }`}
                      style={{ backgroundColor: 'var(--neumorphic-bg)' }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="neumorphic-card p-8">
        <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Application Info
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="neumorphic-inset p-4 rounded-2xl">
            <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Version
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>1.0.0</p>
          </div>
          
          <div className="neumorphic-inset p-4 rounded-2xl">
            <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Environment
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Local MAMP</p>
          </div>
          
          <div className="neumorphic-inset p-4 rounded-2xl">
            <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Database
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>MariaDB</p>
          </div>
          
          <div className="neumorphic-inset p-4 rounded-2xl">
            <h3 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Server
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>Apache</p>
          </div>
        </div>
      </div>
    </div>
  );
}