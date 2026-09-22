import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { AlertTriangle, CheckCircle, FileImage, Save, ArrowLeft, PenLine } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';

const EditableField = ({ label, data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.value);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const needsReview = data.confidence < 80;

  return (
    <div className={`p-4 rounded-xl border transition-colors ${needsReview ? 'bg-primary-surface border-primary/40 shadow-sm' : 'bg-gray-50/80 border-border'}`}>
      <div className="flex justify-between items-start mb-2">
        <Label className={`text-xs uppercase tracking-wider font-bold ${needsReview ? 'text-primary' : 'text-text-secondary'}`}>{label}</Label>
        {needsReview && (
          <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/20 shadow-sm">
            <AlertTriangle className="w-3 h-3"/> Verify
          </span>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex gap-2 mt-2">
          <Input 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className="h-10 text-sm font-semibold border-primary ring-1 ring-primary/20"
            autoFocus
          />
          <Button size="sm" onClick={handleSave} className="h-10 px-4 flex-shrink-0 shadow-sm">
            <Save className="w-4 h-4 mr-1.5"/> Save
          </Button>
        </div>
      ) : (
        <div className="mt-1">
          <div className="flex justify-between items-center group">
            <p className={`text-base font-bold text-text break-words pr-4 ${needsReview ? 'text-primary underline decoration-primary/30 underline-offset-4' : ''}`}>
              {value?.toString() || '—'}
            </p>
            <button 
              onClick={() => setIsEditing(true)}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${needsReview ? 'bg-primary text-white hover:bg-primary-hover shadow-sm' : 'text-gray-400 hover:text-primary hover:bg-primary-light'}`}
            >
              <PenLine className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-xs mt-1.5 font-semibold ${needsReview ? 'text-primary' : 'text-text-secondary/70'}`}>
            Confidence: {data.confidence}%
          </p>
        </div>
      )}
    </div>
  );
};

export default function AIReview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addAudit, stores } = useMockData();
  const { user } = useAuth();
  
  const { extractedData, imageUrl } = location.state || {};
  
  const [data, setData] = useState(extractedData);
  const [correctedFields, setCorrectedFields] = useState([]);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary font-medium">No data to review. Please scan a document first.</p>
        <Button className="mt-4" onClick={() => navigate('/scan')}>Go back</Button>
      </div>
    );
  }

  const handleFieldChange = (section, field, newValue) => {
    if (!correctedFields.includes(field)) {
      setCorrectedFields([...correctedFields, field]);
    }

    if (section === 'products') {
      const updatedProducts = [...data.products];
      updatedProducts[0][field] = { ...updatedProducts[0][field], value: newValue, confidence: 100 };
      setData({ ...data, products: updatedProducts });
    } else if (section === 'checklist') {
      setData({ ...data, checklist: { ...data.checklist, [field]: { ...data.checklist[field], value: newValue, confidence: 100 } } });
    } else {
      setData({ ...data, [field]: { ...data[field], value: newValue, confidence: 100 } });
    }
  };

  const handleConfirm = () => {
    const matchedStore = stores.find(s => s.name.toLowerCase().includes(data.store.value.toLowerCase())) || stores[0];

    const newAudit = {
      id: data.auditId,
      storeId: matchedStore.id,
      date: data.date.value,
      time: data.time.value,
      merchandiserId: user.id,
      displayArea: data.displayArea.value,
      status: correctedFields.length > 0 ? 'Pending Validation' : 'Approved',
      aiMetadata: {
        extractionStatus: correctedFields.length > 0 ? 'Manual Review' : 'Success',
        overallConfidence: 89,
        correctedFields: correctedFields
      },
      products: [
        {
          sku: data.products[0].sku.value,
          qtyBefore: parseInt(data.products[0].qtyBefore.value),
          qtyAfter: parseInt(data.products[0].qtyAfter.value),
          condition: data.products[0].condition.value
        }
      ],
      checklist: {
        restocked: data.checklist.restocked.value === 'true' || data.checklist.restocked.value === true,
        cleaned: data.checklist.cleaned.value === 'true' || data.checklist.cleaned.value === true,
        priceUpdated: data.checklist.priceUpdated.value === 'true' || data.checklist.priceUpdated.value === true,
        removedExpired: data.checklist.removedExpired.value === 'true' || data.checklist.removedExpired.value === true,
      },
      comments: data.comments.value
    };

    addAudit(newAudit);
    navigate(`/audits`);
  };

  const totalFields = 14;
  const lowConfidenceFields = Object.values(data).filter(v => v.confidence && v.confidence < 80).length + 
                              Object.values(data.products[0]).filter(v => v.confidence < 80).length + 
                              Object.values(data.checklist).filter(v => v.confidence < 80).length;

  return (
    <div className="h-full md:h-[calc(100vh-6rem)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/scan')} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text">AI Data Review</h1>
            <p className="text-text-secondary mt-0.5 text-sm md:text-base">Verify and correct any low-confidence fields before confirming.</p>
          </div>
        </div>
        <Button onClick={handleConfirm} className="gap-2 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm font-bold shadow-md">
          <CheckCircle className="w-5 h-5 md:w-4 md:h-4" />
          Confirm Audit
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Side - Image Viewer */}
        <Card className="lg:flex-1 flex flex-col min-h-[300px] lg:min-h-0 border-border overflow-hidden">
          <div className="py-3 px-4 md:px-6 flex-shrink-0 bg-surface border-b flex justify-between items-center">
            <h3 className="font-semibold text-text flex items-center gap-2">
              <FileImage className="w-5 h-5 text-gray-400" /> Original Document
            </h3>
          </div>
          <div className="flex-1 p-0 bg-gray-900 overflow-hidden relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Scanned Document" 
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <FileImage className="w-16 h-16 opacity-20" />
                <p>Preview not available</p>
              </div>
            )}
          </div>
        </Card>

        {/* Right Side - Extracted Data */}
        <Card className="lg:w-[500px] xl:w-[600px] flex flex-col flex-shrink-0 min-h-0 border-border">
          <div className="py-4 px-4 md:px-6 flex-shrink-0 bg-surface border-b border-border flex justify-between items-center shadow-sm z-10">
            <div>
              <h3 className="font-bold text-text">AI Extraction Results</h3>
              <p className="text-xs text-text-secondary mt-0.5">{lowConfidenceFields} fields require manual verification</p>
            </div>
            <Badge variant="primary" className="text-xs font-bold uppercase tracking-wider">ID: {data.auditId}</Badge>
          </div>
          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-gray-50/50">
            
            <section>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Audit Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <EditableField label="Store Name" data={data.store} onSave={(val) => handleFieldChange('main', 'store', val)} />
                </div>
                <EditableField label="Location/Region" data={data.location} onSave={(val) => handleFieldChange('main', 'location', val)} />
                <div className="sm:col-span-2">
                  <EditableField label="Display Area" data={data.displayArea} onSave={(val) => handleFieldChange('main', 'displayArea', val)} />
                </div>
                <EditableField label="Date" data={data.date} onSave={(val) => handleFieldChange('main', 'date', val)} />
                <EditableField label="Time" data={data.time} onSave={(val) => handleFieldChange('main', 'time', val)} />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Product Information</h3>
              <div className="bg-surface border border-border shadow-sm rounded-xl p-4 md:p-5 space-y-4">
                <EditableField label="Product Description" data={data.products[0].name} onSave={(val) => handleFieldChange('products', 'name', val)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditableField label="SKU / Barcode" data={data.products[0].sku} onSave={(val) => handleFieldChange('products', 'sku', val)} />
                  <EditableField label="Product Condition" data={data.products[0].condition} onSave={(val) => handleFieldChange('products', 'condition', val)} />
                  <EditableField label="Qty Before Fill" data={data.products[0].qtyBefore} onSave={(val) => handleFieldChange('products', 'qtyBefore', val)} />
                  <EditableField label="Qty After Fill" data={data.products[0].qtyAfter} onSave={(val) => handleFieldChange('products', 'qtyAfter', val)} />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Merchandising Activities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField label="Restocked Shelves" data={data.checklist.restocked} onSave={(val) => handleFieldChange('checklist', 'restocked', val)} />
                <EditableField label="Cleaned Area" data={data.checklist.cleaned} onSave={(val) => handleFieldChange('checklist', 'cleaned', val)} />
                <EditableField label="Updated Prices" data={data.checklist.priceUpdated} onSave={(val) => handleFieldChange('checklist', 'priceUpdated', val)} />
                <EditableField label="Removed Expired" data={data.checklist.removedExpired} onSave={(val) => handleFieldChange('checklist', 'removedExpired', val)} />
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Additional Comments</h3>
              <EditableField label="Field Notes" data={data.comments} onSave={(val) => handleFieldChange('main', 'comments', val)} />
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
