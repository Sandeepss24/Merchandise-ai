import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, MapPin, Phone, User, Clock, CheckCircle, AlertTriangle, Box, ShieldCheck } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

export default function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { stores } = useMockData();

  const store = stores.find(s => s.id === id);

  if (!store) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary font-medium">Store not found.</p>
        <button className="text-primary mt-4 font-bold hover:underline" onClick={() => navigate('/locations')}>Back to locations</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border pb-4">
        <button onClick={() => navigate('/locations')} className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start sm:self-auto -ml-2">
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text">{store.name}</h1>
            <Badge variant={store.status === 'Active' ? 'success' : 'default'} className="text-xs uppercase px-2 py-0.5">
              {store.status}
            </Badge>
          </div>
          <p className="text-text-secondary mt-1 text-sm">Store Code: <span className="font-semibold text-text">{store.code}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Address</p>
                  <p className="text-sm font-medium text-text mt-1">{store.address}</p>
                  <p className="text-sm font-medium text-text">{store.city}, {store.country}</p>
                  <p className="text-sm font-medium text-text mt-1">Region: {store.region}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <Box className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Store Type</p>
                  <p className="text-sm font-medium text-text mt-1">{store.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <User className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Contact Person</p>
                  <p className="text-sm font-medium text-text mt-1">{store.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <Phone className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Contact Number</p>
                  <p className="text-sm font-medium text-text mt-1">{store.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <Clock className="w-5 h-5 text-text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-secondary">Operating Hours</p>
                  <p className="text-sm font-medium text-text mt-1">{store.operatingHours}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">Assigned Merchandiser</p>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-border">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-text">{store.assignedMerchandiser}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">Visit Frequency</p>
                <p className="text-sm font-medium text-text">{store.visitFrequency}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1">Last Visit</p>
                  <p className="text-sm font-bold text-text">{store.lastVisit}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1">Next Visit</p>
                  <p className="text-sm font-bold text-primary">{store.nextVisit}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Analytics */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-text-secondary" />
                    <p className="text-sm font-semibold text-text-secondary">Total Audits</p>
                  </div>
                  <p className="text-2xl font-bold text-text">{store.metrics.totalAudits}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Box className="w-4 h-4 text-text-secondary" />
                    <p className="text-sm font-semibold text-text-secondary">SKU Availability</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{store.metrics.skuAvailability}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-text-secondary" />
                    <p className="text-sm font-semibold text-text-secondary">Compliance</p>
                  </div>
                  <p className="text-2xl font-bold text-primary">{store.metrics.compliance}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-text-secondary" />
                    <p className="text-sm font-semibold text-text-secondary">Display Issues</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">{store.metrics.displayIssues}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-text-secondary" />
                    <p className="text-sm font-semibold text-text-secondary">Stock Issues</p>
                  </div>
                  <p className="text-2xl font-bold text-rose-600">{store.metrics.stockIssues}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => navigate('/insights', { state: { selectedStore: store.id } })}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  View full Store Insights →
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
