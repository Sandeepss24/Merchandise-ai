import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, CheckCircle2, FileImage, ExternalLink, Bot, AlertTriangle, Info } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

export default function AuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { audits, stores } = useMockData();

  const audit = audits.find(a => a.id === id);
  const store = stores.find(s => s.id === audit?.storeId);

  if (!audit) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary font-medium">Audit not found.</p>
        <button className="text-primary mt-4 font-bold hover:underline" onClick={() => navigate('/audits')}>Back to history</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border pb-4">
        <button onClick={() => navigate('/audits')} className="p-2 hover:bg-gray-100 rounded-full transition-colors self-start sm:self-auto -ml-2">
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text">Audit Detail</h1>
            <Badge variant={audit.status === 'Approved' ? 'success' : 'warning'} className="text-xs uppercase px-2 py-0.5">{audit.status}</Badge>
          </div>
          <p className="text-text-secondary mt-1 text-sm">Audit <span className="font-semibold text-text">{audit.id}</span> • Submitted on {audit.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location & Time</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50/50">
              <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Store</p>
                <p className="font-semibold text-text mt-1 text-base">{store?.name}</p>
                <p className="text-sm text-text-secondary mt-0.5">{store?.address}</p>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Display Area</p>
                <p className="font-semibold text-text mt-1 text-base">{audit.displayArea}</p>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Merchandiser</p>
                <p className="font-semibold text-text mt-1 text-base">Alex Ng</p>
              </div>
              <div className="bg-surface p-4 rounded-xl border border-border shadow-sm">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Date & Time</p>
                <p className="font-semibold text-text mt-1 text-base">{audit.date} at {audit.time}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Audit</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="hidden sm:table-header-group bg-surface">
                    <tr className="border-b border-border text-text-secondary">
                      <th className="pb-3 px-4 sm:px-0 font-semibold text-text">SKU</th>
                      <th className="pb-3 px-4 sm:px-0 font-semibold text-text text-center">Qty Before</th>
                      <th className="pb-3 px-4 sm:px-0 font-semibold text-text text-center">Qty After</th>
                      <th className="pb-3 px-4 sm:px-0 font-semibold text-text text-right sm:text-left">Condition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    {audit.products.map((prod, idx) => (
                      <tr key={idx} className="flex flex-col sm:table-row hover:bg-gray-50">
                        <td className="py-3 px-4 sm:px-0 font-semibold text-text border-b sm:border-0 border-dashed border-gray-200">
                          <span className="sm:hidden text-xs text-text-secondary font-medium mr-2">SKU:</span>
                          {prod.sku}
                        </td>
                        <td className="py-3 px-4 sm:px-0 text-left sm:text-center">
                          <span className="sm:hidden text-xs text-text-secondary font-medium mr-2">Qty Before:</span>
                          <span className="font-medium text-text">{prod.qtyBefore}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-0 text-left sm:text-center">
                          <span className="sm:hidden text-xs text-text-secondary font-medium mr-2">Qty After:</span>
                          <span className="font-bold text-primary">{prod.qtyAfter}</span>
                        </td>
                        <td className="py-3 px-4 sm:px-0 text-left sm:text-left">
                          <span className="sm:hidden text-xs text-text-secondary font-medium mr-2">Condition:</span>
                          <Badge variant={prod.condition === 'Good' ? 'success' : 'warning'}>
                            {prod.condition}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activities Performed</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
                {audit.checklist.restocked ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />}
                <span className="text-sm font-medium text-text">Restocked Shelves</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
                {audit.checklist.cleaned ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />}
                <span className="text-sm font-medium text-text">Cleaned Display Area</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
                {audit.checklist.priceUpdated ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />}
                <span className="text-sm font-medium text-text">Updated Price Tags/Signage</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
                {audit.checklist.removedExpired ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />}
                <span className="text-sm font-medium text-text">Removed Expired/Damaged Items</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-primary-surface/50 border-b border-primary/10 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> AI Extraction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Status</p>
                <Badge variant={audit.aiMetadata?.extractionStatus === 'Success' ? 'success' : 'warning'}>{audit.aiMetadata?.extractionStatus || 'Processing'}</Badge>
              </div>
              <div>
                <p className="text-xs text-text-secondary uppercase font-bold mb-1">Overall Confidence</p>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${audit.aiMetadata?.overallConfidence || 0}%` }}></div>
                  </div>
                  <span className="text-sm font-bold">{audit.aiMetadata?.overallConfidence || 0}%</span>
                </div>
              </div>
              {audit.aiMetadata?.correctedFields?.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> Manually Corrected Fields</p>
                  <p className="text-sm text-amber-700 mt-1 font-medium">{audit.aiMetadata.correctedFields.join(', ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[3/4] bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-border relative overflow-hidden group">
                <FileImage className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-xs font-medium">Scanned Form.jpg</p>
                <div className="absolute inset-0 bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="bg-white p-2 rounded-full shadow-md text-primary">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <button className="w-full text-sm text-primary font-bold hover:underline text-center">
                View Full Image
              </button>
            </CardContent>
          </Card>
          
          {audit.comments && (
            <Card>
              <CardHeader>
                <CardTitle>Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-text bg-gray-50 p-4 rounded-xl border border-border font-medium italic">
                  "{audit.comments}"
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
