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
    <div className={`flex gap-1 p-1 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm rounded-xl w-fit mb-5${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-150
              ${
                isActive
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }
            `}
          >
            {tab.icon && (
              <Icon 
                icon={tab.icon} 
                className={isActive ? "text-white" : "text-gray-400"} 
                width="14" 
                height="14" 
              />
            )}
            
            <span>{tab.label}</span>
            
            {counts[tab.key] !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                isActive ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-400"
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
