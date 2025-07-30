
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BarChart3, FileText, Settings, Upload, SlidersHorizontal } from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Issues",
    url: createPageUrl("Issues"),
    icon: FileText,
  },
  {
    title: "Import/Export",
    url: createPageUrl("ImportExport"),
    icon: Upload,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
  {
    title: "Admin Panel",
    url: createPageUrl("AdminPanel"),
    icon: SlidersHorizontal,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f2f5' }}>
      <style>{`
        :root {
          --neumorphic-bg: #f0f2f5;
          --neumorphic-light: #ffffff;
          --neumorphic-dark: #d9dce1;
          --neumorphic-darker: #c8ccd1;
          --text-primary: #3d4a5c;
          --text-secondary: #6b7a90;
          --accent: #5a67d8;
        }

        .neumorphic {
          background: var(--neumorphic-bg);
          box-shadow: 
            6px 6px 12px var(--neumorphic-dark),
            -6px -6px 12px var(--neumorphic-light);
          border: none;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .neumorphic-inset {
          background: var(--neumorphic-bg);
          box-shadow: 
            inset 3px 3px 6px var(--neumorphic-dark),
            inset -3px -3px 6px var(--neumorphic-light);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .neumorphic-button {
          background: var(--neumorphic-bg);
          box-shadow: 
            5px 5px 10px var(--neumorphic-dark),
            -5px -5px 10px var(--neumorphic-light);
          border: none;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .neumorphic-button:hover {
          box-shadow: 
            7px 7px 14px var(--neumorphic-dark),
            -7px -7px 14px var(--neumorphic-light);
          transform: translateY(-1px);
        }

        .neumorphic-button:active {
          box-shadow: 
            inset 2px 2px 4px var(--neumorphic-dark),
            inset -2px -2px 4px var(--neumorphic-light);
          transform: translateY(0);
        }

        .neumorphic-card {
          background: var(--neumorphic-bg);
          box-shadow: 
            10px 10px 20px var(--neumorphic-dark),
            -10px -10px 20px var(--neumorphic-light);
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .neumorphic-card:hover {
          box-shadow: 
            14px 14px 28px var(--neumorphic-dark),
            -14px -14px 28px var(--neumorphic-light);
        }

        .nav-item-active {
          background: var(--neumorphic-bg);
          box-shadow: 
            inset 3px 3px 6px var(--neumorphic-dark),
            inset -3px -3px 6px var(--neumorphic-light);
        }

        .nav-item {
          background: var(--neumorphic-bg);
          box-shadow: 
            3px 3px 6px var(--neumorphic-dark),
            -3px -3px 6px var(--neumorphic-light);
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .nav-item:hover {
          box-shadow: 
            5px 5px 10px var(--neumorphic-dark),
            -5px -5px 10px var(--neumorphic-light);
        }

        .input-neumorphic {
          background: var(--neumorphic-bg);
          box-shadow: 
            inset 2px 2px 5px var(--neumorphic-dark),
            inset -2px -2px 5px var(--neumorphic-light);
          border: none;
          color: var(--text-primary);
        }

        .input-neumorphic:focus {
          box-shadow: 
            inset 4px 4px 8px var(--neumorphic-darker),
            inset -4px -4px 8px var(--neumorphic-light),
            0 0 0 2px var(--accent);
          outline: none;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: var(--neumorphic-bg);
        }
      `}</style>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full lg:w-64 p-6">
          <div className="neumorphic-card p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Support Tracker
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              WordPress & WooCommerce
            </p>
          </div>

          <nav className="space-y-3">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-200 ${
                    isActive ? 'nav-item-active' : 'nav-item'
                  }`}
                  style={{ 
                    color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                    textDecoration: 'none'
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="neumorphic-card p-8 min-h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
