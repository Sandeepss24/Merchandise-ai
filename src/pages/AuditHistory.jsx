import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Search, Filter, Eye, Store, Clock, ChevronRight, Download } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function AuditHistory() {
  const { audits, stores } = useMockData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // If merchandiser, only show their own audits. Else show all.
  const displayAudits = user?.role === 'MERCHANDISER'
    ? audits.filter(a => a.merchandiserId === user.id)
    : audits;

  const filteredAudits = displayAudits.filter(audit => {
    const store = stores.find(s => s.id === audit.storeId);
    return (
      audit.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Validated': return 'primary';
      case 'Pending Validation': return 'warning';
      case 'Manual Review': return 'warning';
      case 'Processing Failed': return 'error';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Audit History</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">View and manage submitted stock audits.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-gray-50 flex flex-col sm:flex-row justify-between items-center rounded-t-xl gap-3">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by Audit ID or Store..." 
                className="pl-9 h-10 w-full bg-surface"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary" className="w-full sm:w-auto h-10 gap-2 font-semibold">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-text">Audit ID</th>
                  <th className="px-6 py-4 font-semibold text-text">Date & Time</th>
                  <th className="px-6 py-4 font-semibold text-text">Store</th>
                  <th className="px-6 py-4 font-semibold text-text">Display Area</th>
                  <th className="px-6 py-4 font-semibold text-text">Status</th>
                  <th className="px-6 py-4 font-semibold text-text text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-surface">
                {filteredAudits.map((audit) => {
                  const store = stores.find(s => s.id === audit.storeId);
                  return (
                    <tr key={audit.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => navigate(`/audits/${audit.id}`)}>
                      <td className="px-6 py-4 font-bold text-text group-hover:text-primary transition-colors">{audit.id}</td>
                      <td className="px-6 py-4">{audit.date} • {audit.time}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-text">{store?.name}</p>
                      </td>
                      <td className="px-6 py-4">{audit.displayArea}</td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="p-2 text-text-secondary group-hover:text-primary group-hover:bg-primary-light rounded-lg transition-colors inline-flex">
                          <Eye className="w-5 h-5" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-border">
            {filteredAudits.map((audit) => {
              const store = stores.find(s => s.id === audit.storeId);
              return (
                <div key={audit.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/audits/${audit.id}`)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{audit.id}</span>
                      <span className="text-xs text-text-secondary font-medium">• {audit.date}</span>
                    </div>
                    <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3 bg-gray-50/80 border border-border p-3 rounded-lg">
                    <div className="flex items-start gap-2 text-sm text-text">
                      <Store className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="font-semibold">{store?.name}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-text-secondary">
                      <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{audit.time} • {audit.displayArea}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center w-full py-1 text-xs font-bold text-primary uppercase tracking-wide">
                    View Audit <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              );
            })}
          </div>
            
          {filteredAudits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary font-medium">No audits found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
