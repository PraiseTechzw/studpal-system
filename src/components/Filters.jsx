import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './Filters.css';

const Filters = () => {
  const filterItems = [
    "All Types",
    "All Priorities",
    "Newest First",
  ];

  return (
    <div className="filters-row">
      <div className="filters-left">
        {filterItems.map((item, idx) => (
          <button key={idx} className="filter-pill">
            <span>{item}</span>
            <ChevronDown size={16} />
          </button>
        ))}
      </div>
      <button className="filter-more-btn">
        <Filter size={16} />
        More Filters
      </button>
    </div>
  );
};

export default Filters;
