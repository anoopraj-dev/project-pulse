import React from 'react';
import { Icon } from "@iconify/react";

/**
 * A reusable tab component styled like the Support Center tabs.
 * 
 * @param {Array} tabs - Array of { key, label, icon }
 * @param {string} activeTab - The currently active tab key
 * @param {function} onTabChange - Callback when a tab is clicked
 * @param {Object} counts - Optional map of counts to display as badges
 * @param {string} className - Optional container className
 */
const TableTabs = ({ tabs, activeTab, onTabChange, counts = {}, className = "" }) => {
  return (
    <div className={`flex overflow-x-auto no-scrollbar gap-2 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg border
              text-xs transition-all duration-200
              ${
                isActive
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-200 text-slate-500 hover:bg-gray-50"
              }
            `}
          >
            {tab.icon && (
              <Icon 
                icon={tab.icon} 
                className={isActive ? "text-blue-600" : "text-gray-400"} 
                width="14" 
                height="14" 
              />
            )}
            
            <span>{tab.label}</span>
            
            {counts[tab.key] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
              }`}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TableTabs;
