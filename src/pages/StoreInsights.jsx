import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapPin, Box, AlertTriangle, CheckCircle, ChevronRight, Download, Filter } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const visitData = [
  { name: 'Week 1', visits: 12 },
  { name: 'Week 2', visits: 19 },
  { name: 'Week 3', visits: 15 },
  { name: 'Week 4', visits: 22 },
];

export default function StoreInsights() {
  const { stores, audits } = useMockData();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedStore, setSelectedStore] = useState(location.state?.selectedStore || stores[0].id);

  const store = stores.find(s => s.id === selectedStore);
  const storeAudits = audits.filter(a => a.storeId === store?.id);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Validated': return 'primary';
      case 'Pending Validation': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Store Insights</h1>
          <p className="text-text-secondary mt-1 text-sm md:text-base">Deep dive into store performance and merchandising analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
        <label className="text-sm font-semibold text-text-secondary whitespace-nowrap uppercase tracking-wider">Select Store:</label>
        <select 
          className="w-full max-w-md h-10 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
        >
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
          ))}
        </select>
      </div>

      {store && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Store Overview */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Store Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary uppercase font-bold">Store Name</p>
                  <p className="font-semibold text-text">{store.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Code</p>
                    <p className="font-semibold text-text">{store.code}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Type</p>
                    <p className="font-semibold text-text">{store.type}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-text-secondary uppercase font-bold">Location</p>
                  <p className="font-semibold text-text">{store.city}, {store.region}</p>
                </div>
                <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Merchandiser</p>
                    <p className="font-semibold text-text">{store.assignedMerchandiser}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Frequency</p>
                    <p className="font-semibold text-text">{store.visitFrequency}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Last Visit</p>
                    <p className="font-semibold text-text">{store.lastVisit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-text-secondary uppercase font-bold">Next Visit</p>
                    <p className="font-semibold text-primary">{store.nextVisit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-max">
              <Card className="hover:border-primary/20 transition-colors">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-text-secondary">Total Audits</p>
                  <p className="text-3xl font-bold text-text mt-2">{store.metrics.totalAudits}</p>
                </CardContent>
              </Card>
              <Card className="hover:border-emerald-500/20 transition-colors">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-text-secondary">SKU Availability</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">{store.metrics.skuAvailability}%</p>
                </CardContent>
              </Card>
              <Card className="hover:border-primary/20 transition-colors">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-text-secondary">Merchandising Compliance</p>
                  <p className="text-3xl font-bold text-primary mt-2">{store.metrics.compliance}%</p>
                </CardContent>
              </Card>
              <Card className="hover:border-rose-500/20 transition-colors">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-text-secondary">Display Issues</p>
                  <p className="text-3xl font-bold text-rose-600 mt-2">{store.metrics.displayIssues}</p>
                </CardContent>
              </Card>
              <Card className="hover:border-rose-500/20 transition-colors">
                <CardContent className="p-5">
                  <p className="text-sm font-semibold text-text-secondary">Stock Issues</p>
                  <p className="text-3xl font-bold text-rose-600 mt-2">{store.metrics.stockIssues}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visit Frequency Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <div className="h-64 md:h-72 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={visitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      />
                      <Line type="monotone" dataKey="visits" stroke="#F04623" strokeWidth={3} dot={{ r: 4, fill: '#F04623', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Compliance & AI Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="p-5 md:p-6">
                <div className="space-y-8 mt-2">
                  <div>
                    <div className="flex justify-between text-sm mb-2.5">
                      <span className="font-semibold text-text">Overall AI Extraction Accuracy</span>
                      <span className="text-primary font-bold">94%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2.5">
                      <span className="font-semibold text-text">Stock Before vs After Reliability</span>
                      <span className="text-amber-600 font-bold">88%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2.5">
                      <span className="font-semibold text-text">Merchandising Task Completion</span>
                      <span className="text-emerald-600 font-bold">98%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Store Audit History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Store Audit History</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-text-secondary">
                  <thead className="bg-gray-50 border-y border-border">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-text">Date</th>
                      <th className="px-6 py-3 font-semibold text-text">Merchandiser</th>
                      <th className="px-6 py-3 font-semibold text-text">SKU Sample</th>
                      <th className="px-6 py-3 font-semibold text-text text-center">Qty (B→A)</th>
                      <th className="px-6 py-3 font-semibold text-text">Condition</th>
                      <th className="px-6 py-3 font-semibold text-text">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {storeAudits.map((audit) => {
                      const sampleProduct = audit.products[0];
                      return (
                        <tr key={audit.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/audits/${audit.id}`)}>
                          <td className="px-6 py-4 font-medium text-text">{audit.date}</td>
                          <td className="px-6 py-4">{audit.merchandiserId === 'u1' ? 'Alex Ng' : audit.merchandiserId}</td>
                          <td className="px-6 py-4 font-medium">{sampleProduct?.sku || 'N/A'}</td>
                          <td className="px-6 py-4 text-center">
                            {sampleProduct?.qtyBefore} → <span className="font-bold text-primary">{sampleProduct?.qtyAfter}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={sampleProduct?.condition === 'Good' ? 'success' : 'warning'}>{sampleProduct?.condition}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {storeAudits.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">No audits found for this store.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
