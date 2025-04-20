import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock size={16} />
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={16} />
    },
    resolved: {
      label: 'Resolved',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle size={16} />
    },
    inprogress: {
      label: 'in Progress',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock size={16} />
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      icon: <XCircle size={16} />
    }
  };

  const { label, color, icon } = statusMap[status] || {};

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {icon}
      <span className="ml-1">{label}</span>
    </span>
  );
};

export default StatusBadge;
