import React from 'react';

const StatCard = ({ label, value, icon, color, bg, border, delay = 0 }) => {
  return (
    <div
      className={`rounded-2xl p-5 border bg-obsidian/40 backdrop-blur-sm hover:shadow-soft transition-all duration-300 animate-fade-in-up ${border}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className="text-silver text-xs font-medium mb-1 tracking-wide uppercase">{label}</p>
      <p className="text-ivory text-2xl font-bold font-heading">{value}</p>
    </div>
  );
};

export default StatCard;
