import React from 'react';
import { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <div className="group relative p-6 bg-surface/30 border border-slate-800 hover:border-safety/40 transition-colors duration-300">
      {/* Tech Markers */}
      <div className="absolute top-2 right-2 flex gap-1">
         <div className="w-1 h-1 bg-slate-600 group-hover:bg-safety"></div>
         <div className="w-1 h-1 bg-slate-600 group-hover:bg-safety/50"></div>
         <div className="w-1 h-1 bg-slate-600 group-hover:bg-safety/20"></div>
      </div>
      
      <div className="flex flex-col h-full justify-between">
        <div className="mb-4">
          <span className="font-body text-xs text-concrete uppercase tracking-widest block mb-1">
            ID: {metric.id}
          </span>
          <h3 className="font-header text-lg text-white uppercase tracking-wider opacity-80">
            {metric.label}
          </h3>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-header text-4xl font-bold text-white group-hover:text-safety transition-colors">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="font-body text-sm text-concrete">{metric.unit}</span>
            )}
          </div>
          
          <div className={`flex items-center gap-1 font-body text-xs font-bold px-2 py-1 bg-slate-800/50 ${
            metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-concrete'
          }`}>
             {metric.trend === 'up' && '▲'}
             {metric.trend === 'down' && '▼'}
             {metric.trend === 'neutral' && '—'}
             {metric.change}
          </div>
        </div>
      </div>
      
      {/* Corner Bracket */}
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-600 group-hover:border-safety transition-colors"></div>
    </div>
  );
};