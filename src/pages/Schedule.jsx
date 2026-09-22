import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, User } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export default function Schedule() {
  const { schedules, stores } = useMockData();
  const { user } = useAuth();
  const [view, setView] = useState('List');
  
  const displaySchedules = user?.role === 'MERCHANDISER' 
    ? schedules.filter(s => s.assignedTo === user.id)
    : schedules;

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Scheduled': return 'default';
      case 'In Progress': return 'primary';
      case 'Completed': return 'success';
      case 'Missed': return 'error';
      case 'Rescheduled': return 'warning';
      default: return 'default';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Schedule</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Upcoming store visits and merchandising activities.</p>
        </div>
        
        {/* View Toggle */}
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          {['Month', 'Week', 'Day', 'List'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${view === v ? 'bg-white shadow-sm text-text' : 'text-text-secondary hover:text-text'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {displaySchedules.map(schedule => {
          const store = stores.find(s => s.id === schedule.storeId);
          const isToday = schedule.date === new Date().toISOString().split('T')[0];
          
          return (
            <Card key={schedule.id} className={`group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer overflow-hidden ${schedule.status === 'Missed' ? 'border-error/30 opacity-75' : ''}`}>
              <div className="flex flex-col sm:flex-row w-full">
                {/* Date Block */}
                <div className={`p-4 sm:p-6 sm:w-32 flex flex-row sm:flex-col items-center sm:justify-center border-b sm:border-b-0 sm:border-r border-border gap-4 sm:gap-1 ${isToday ? 'bg-primary-surface text-primary' : 'bg-gray-50 text-text-secondary'}`}>
                  <div className="text-left sm:text-center">
                    <span className="block text-xs font-bold uppercase tracking-wider">
                      {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="block text-3xl font-black leading-none mt-1">
                      {new Date(schedule.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 sm:hidden flex justify-end">
                    <Badge variant={getStatusVariant(schedule.status)}>
                      {schedule.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Block */}
                <CardContent className="p-4 sm:p-6 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors leading-tight">
                        {store?.name}
                      </h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-5 mt-3 text-sm font-medium text-text-secondary">
                      <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-md border border-border w-fit">
                        <Clock className="w-4 h-4 text-primary" />
                        {schedule.time}
                      </div>
                      <div className="flex items-start sm:items-center gap-2 mt-1 sm:mt-0">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 sm:mt-0 flex-shrink-0" />
                        <span className="leading-snug">{store?.address}</span>
                      </div>
                      {user?.role === 'RETAIL_OPS_HEAD' && (
                        <div className="flex items-center gap-2 mt-1 sm:mt-0 bg-primary-light/50 px-2.5 py-1 rounded-md text-primary font-semibold">
                          <User className="w-3.5 h-3.5" />
                          <span>Alex Ng</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="hidden sm:block">
                      <Badge variant={getStatusVariant(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-text-secondary bg-gray-100 px-3 py-1 rounded-full">{schedule.activityType}</p>
                    <div className="sm:hidden text-primary">
                       <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          );
        })}
        
        {displaySchedules.length === 0 && (
          <Card>
            <CardContent className="text-center py-16">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-text-secondary font-medium">No scheduled visits found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
