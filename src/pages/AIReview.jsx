import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { AlertTriangle, CheckCircle, FileImage, Save, ArrowLeft, PenLine, MapPin } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';

const EditableField = ({ label, data, onSave, error, options }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(data.value);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const needsReview = data.confidence && data.confidence < 80;
  const isError = error;

  return (
    <div className={`p-4 rounded-xl border transition-colors ${needsReview ? 'bg-primary-surface border-primary/40 shadow-sm' : isError ? 'bg-red-50 border-red-300' : 'bg-gray-50/80 border-border'}`}>
      <div className="flex justify-between items-start mb-2">
        <Label className={`text-xs uppercase tracking-wider font-bold ${needsReview ? 'text-primary' : isError ? 'text-red-600' : 'text-text-secondary'}`}>
          {label} {isError && <span className="text-red-500">* Required</span>}
        </Label>
        {needsReview && !isEditing && (
          <span className="text-[10px] font-bold text-primary bg-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/20 shadow-sm">
            <AlertTriangle className="w-3 h-3"/> Verify
          </span>
        )}
      </div>
      
      {isEditing ? (
        <div className="flex gap-2 mt-2 flex-col sm:flex-row">
          {options ? (
            <select 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className="h-10 text-sm font-semibold border border-primary/20 rounded-md px-3 bg-white w-full"
              autoFocus
            >
              <option value="">Select...</option>
              {options.map(opt => (
                <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
              ))}
            </select>
          ) : (
            <Input 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              className="h-10 text-sm font-semibold border-primary ring-1 ring-primary/20"
              autoFocus
            />
          )}
          <Button size="sm" onClick={handleSave} className="h-10 px-4 flex-shrink-0 shadow-sm w-full sm:w-auto">
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
          {data.confidence && (
            <p className={`text-xs mt-1.5 font-semibold ${needsReview ? 'text-primary' : 'text-text-secondary/70'}`}>
              Confidence: {data.confidence}%
            </p>
          )}
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
  
  const { extractedData, imageUrl, manualMode } = location.state || {};
  
  const [data, setData] = useState(extractedData || {
    auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    store: { value: '', confidence: 0 },
    location: { value: '', confidence: 0 },
    date: { value: new Date().toISOString().split('T')[0], confidence: 0 },
    time: { value: '', confidence: 0 },
    displayArea: { value: '', confidence: 0 },
    products: [{ name: { value: '', confidence: 0 }, sku: { value: '', confidence: 0 }, condition: { value: 'Good', confidence: 0 }, qtyBefore: { value: '', confidence: 0 }, qtyAfter: { value: '', confidence: 0 } }],
    checklist: { restocked: { value: false, confidence: 0 }, cleaned: { value: false, confidence: 0 }, priceUpdated: { value: false, confidence: 0 }, removedExpired: { value: false, confidence: 0 } },
    comments: { value: '', confidence: 0 }
  });
  
  const [correctedFields, setCorrectedFields] = useState([]);
  const [storeConfirmed, setStoreConfirmed] = useState(manualMode);
  const [isChangingStore, setIsChangingStore] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [success, setSuccess] = useState(false);

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
    
    // Clear validation error if corrected
    setValidationErrors(validationErrors.filter(err => err !== field));
  };

  const handleStoreChange = (storeId) => {
    const selectedStore = stores.find(s => s.id === storeId);
    if (selectedStore) {
      handleFieldChange('main', 'store', selectedStore.name);
      handleFieldChange('main', 'location', `${selectedStore.city}, ${selectedStore.region}`);
    }
    setStoreConfirmed(true);
    setIsChangingStore(false);
  };

  const validateForm = () => {
    const errors = [];
    if (!data.store.value) errors.push('store');
    if (!data.date.value) errors.push('date');
    if (!data.time.value) errors.push('time');
    if (!data.displayArea.value) errors.push('displayArea');
    if (!data.products[0].name.value) errors.push('name');
    if (!data.products[0].sku.value) errors.push('sku');
    if (!data.products[0].qtyBefore.value) errors.push('qtyBefore');
    if (!data.products[0].qtyAfter.value) errors.push('qtyAfter');
    if (!data.products[0].condition.value) errors.push('condition');

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleConfirm = () => {
    if (!storeConfirmed) {
      alert("Please confirm the store first.");
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    const matchedStore = stores.find(s => s.name.toLowerCase().includes(data.store.value.toLowerCase())) || stores[0];

    const newAudit = {
      id: data.auditId,
      storeId: matchedStore.id,
      date: data.date.value,
      time: data.time.value,
      merchandiserId: user.id,
      displayArea: data.displayArea.value,
      status: 'Validated',
      aiMetadata: {
        extractionStatus: correctedFields.length > 0 ? 'Manual Review' : 'Success',
        overallConfidence: 89,
        correctedFields: correctedFields
      },
      products: [
        {
          sku: data.products[0].sku.value,
          name: data.products[0].name.value,
          qtyBefore: parseInt(data.products[0].qtyBefore.value) || 0,
          qtyAfter: parseInt(data.products[0].qtyAfter.value) || 0,
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
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-text">Audit submitted successfully</h1>
        
        <Card className="max-w-sm mx-auto shadow-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-text-secondary">Audit ID</span>
              <span className="font-bold text-text">{data.auditId}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-text-secondary">Store</span>
              <span className="font-bold text-text truncate max-w-[200px]">{data.store.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Status</span>
              <Badge variant="primary" className="bg-emerald-100 text-emerald-700">Validated</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button onClick={() => navigate(`/audits/${data.auditId}`)} className="w-full sm:w-auto h-12">
            View Audit
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto h-12">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const lowConfidenceFields = Object.values(data).filter(v => v.confidence && v.confidence < 80).length + 
                              Object.values(data.products[0]).filter(v => v.confidence && v.confidence < 80).length + 
                              Object.values(data.checklist).filter(v => v.confidence && v.confidence < 80).length;

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
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" onClick={() => navigate('/scan')} className="flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm shadow-sm bg-white">
            Re-scan
          </Button>
          <Button onClick={handleConfirm} className="gap-2 flex-1 sm:flex-none h-12 sm:h-10 text-base sm:text-sm font-bold shadow-md">
            <CheckCircle className="w-5 h-5 md:w-4 md:h-4" />
            Confirm & Submit Audit
          </Button>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Missing Required Fields</h4>
            <p className="text-sm mt-1">Please fill in all required fields highlighted in red below before submitting.</p>
          </div>
        </div>
      )}

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
            
            {!storeConfirmed ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-3 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" /> Verify Detected Store
                </h3>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className="font-bold text-text text-lg">{data.store.value || 'Store not detected'}</p>
                      <p className="text-text-secondary text-sm mt-1">{data.location.value}</p>
                    </div>
                    {data.store.confidence > 0 && (
                      <Badge variant="primary" className="bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm font-bold">
                        {data.store.confidence}% Match
                      </Badge>
                    )}
                  </div>
                  
                  {isChangingStore ? (
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-text-secondary uppercase">Select Assigned Store</Label>
                      <select 
                        className="w-full h-11 border border-border rounded-md px-3 font-medium bg-white"
                        onChange={(e) => handleStoreChange(e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a store...</option>
                        {user.assignedLocations.includes('all') ? stores.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        )) : stores.filter(s => user.assignedLocations.includes(s.id)).map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <Button variant="outline" size="sm" onClick={() => setIsChangingStore(false)} className="w-full">Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Button onClick={() => setStoreConfirmed(true)} className="flex-1 bg-primary hover:bg-primary-hover text-white shadow-sm font-bold">
                        Confirm Store
                      </Button>
                      <Button variant="outline" onClick={() => setIsChangingStore(true)} className="flex-1 border-gray-300">
                        Change Store
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Audit Details</h3>
                  <Button variant="ghost" size="sm" onClick={() => {setStoreConfirmed(false); setIsChangingStore(true);}} className="text-primary hover:bg-primary-light h-6 px-2 text-xs">
                    Change Store
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <EditableField label="Store Name" data={data.store} error={validationErrors.includes('store')} onSave={(val) => handleFieldChange('main', 'store', val)} />
                  </div>
                  <EditableField label="Location/Region" data={data.location} onSave={(val) => handleFieldChange('main', 'location', val)} />
                  <div className="sm:col-span-2">
                    <EditableField label="Display Area" data={data.displayArea} error={validationErrors.includes('displayArea')} onSave={(val) => handleFieldChange('main', 'displayArea', val)} />
                  </div>
                  <EditableField label="Date" data={data.date} error={validationErrors.includes('date')} onSave={(val) => handleFieldChange('main', 'date', val)} />
                  <EditableField label="Time" data={data.time} error={validationErrors.includes('time')} onSave={(val) => handleFieldChange('main', 'time', val)} />
                </div>
              </section>
            )}

            <section className={!storeConfirmed ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Product Information</h3>
              <div className="bg-surface border border-border shadow-sm rounded-xl p-4 md:p-5 space-y-4">
                <EditableField label="Product Name" data={data.products[0].name} error={validationErrors.includes('name')} onSave={(val) => handleFieldChange('products', 'name', val)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EditableField label="SKU / Product Code" data={data.products[0].sku} error={validationErrors.includes('sku')} onSave={(val) => handleFieldChange('products', 'sku', val)} />
                  <EditableField 
                    label="Product Condition" 
                    data={data.products[0].condition} 
                    error={validationErrors.includes('condition')} 
                    onSave={(val) => handleFieldChange('products', 'condition', val)}
                    options={['Good', 'Damaged', 'Expired', 'Near Expiry', 'Out of Stock', 'Other']}
                  />
                  <EditableField label="Quantity Before" data={data.products[0].qtyBefore} error={validationErrors.includes('qtyBefore')} onSave={(val) => handleFieldChange('products', 'qtyBefore', val)} />
                  <EditableField label="Quantity After" data={data.products[0].qtyAfter} error={validationErrors.includes('qtyAfter')} onSave={(val) => handleFieldChange('products', 'qtyAfter', val)} />
                </div>
              </div>
            </section>

            <section className={!storeConfirmed ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Merchandising Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField label="Restocked Shelves" data={data.checklist.restocked} options={[{label: 'Yes', value: true}, {label: 'No', value: false}]} onSave={(val) => handleFieldChange('checklist', 'restocked', val)} />
                <EditableField label="Cleaned Area" data={data.checklist.cleaned} options={[{label: 'Yes', value: true}, {label: 'No', value: false}]} onSave={(val) => handleFieldChange('checklist', 'cleaned', val)} />
                <EditableField label="Updated Prices/Signage" data={data.checklist.priceUpdated} options={[{label: 'Yes', value: true}, {label: 'No', value: false}]} onSave={(val) => handleFieldChange('checklist', 'priceUpdated', val)} />
                <EditableField label="Removed Expired/Damaged" data={data.checklist.removedExpired} options={[{label: 'Yes', value: true}, {label: 'No', value: false}]} onSave={(val) => handleFieldChange('checklist', 'removedExpired', val)} />
              </div>
            </section>

            <section className={!storeConfirmed ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Additional Information</h3>
              <EditableField label="Additional Comments" data={data.comments} onSave={(val) => handleFieldChange('main', 'comments', val)} />
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
