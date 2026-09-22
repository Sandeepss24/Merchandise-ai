import React, { createContext, useContext, useState } from 'react';
import { STORES, PRODUCTS, SCHEDULES, AUDITS, NOTIFICATIONS } from '../data/mockData';

const MockDataContext = createContext();

export const MockDataProvider = ({ children }) => {
  const [stores, setStores] = useState(STORES);
  const [products, setProducts] = useState(PRODUCTS);
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [audits, setAudits] = useState(AUDITS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const addAudit = (newAudit) => {
    setAudits([newAudit, ...audits]);
  };

  const updateAuditStatus = (id, newStatus) => {
    setAudits(audits.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const updateScheduleStatus = (id, newStatus) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  return (
    <MockDataContext.Provider value={{
      stores, products, schedules, audits, notifications,
      addAudit, updateAuditStatus, updateScheduleStatus
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => useContext(MockDataContext);
