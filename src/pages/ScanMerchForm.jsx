import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, FileImage, Loader2, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { processDocument } from '../services/aiService';

export default function ScanMerchForm() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressValue, setProgressValue] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startProcessing(e.target.files[0]);
    }
  };

  const startProcessing = async (selectedFile) => {
    setFile(selectedFile);
    setProcessing(true);
    
    // Simulate AI pipeline with more BRS realistic states
    const result = await processDocument(selectedFile, (status, percent) => {
      setProgressStatus(status);
      setProgressValue(percent);
    });
    
    // Set extra UI delay to simulate real network request
    setTimeout(() => {
      navigate('/scan/review', { state: { extractedData: result, imageUrl: URL.createObjectURL(selectedFile) } });
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Scan Merchandising Form</h1>
        <p className="text-text-secondary mt-1 text-sm md:text-base">Capture or upload your completed handwritten stock audit form.</p>
      </div>

      {!processing ? (
        <Card className="overflow-hidden border-2 border-transparent">
          <CardContent className="p-0">
            {/* Primary Mobile Action Area */}
            <div className="bg-primary p-6 md:p-10 text-center text-white sm:hidden relative overflow-hidden">
              <h2 className="text-xl font-bold mb-4 relative z-10">Start New Audit</h2>
              <Button className="w-full h-14 bg-white text-primary hover:bg-gray-100 text-lg font-bold shadow-lg relative z-10">
                <Camera className="w-6 h-6 mr-2" />
                Take Photo
                <input 
                  type="file" 
                  capture="environment"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleChange}
                />
              </Button>
              <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Camera className="w-40 h-40" />
              </div>
            </div>

            {/* Desktop / Secondary Upload Area */}
            <div 
              className={`p-6 md:p-12 text-center transition-all bg-surface ${
                dragActive ? 'bg-primary-surface border-2 border-dashed border-primary' : 'border-2 border-dashed border-border m-6 rounded-2xl hover:border-primary hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileImage className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-text mb-2 hidden sm:block">Drag & Drop form here</h3>
              <p className="text-sm text-text-secondary mb-8">Supported formats: JPG, JPEG, PNG, PDF</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                <Button className="relative w-full h-12 md:h-11 hidden sm:flex">
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                  <input 
                    type="file" 
                    capture="environment"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={handleChange}
                  />
                </Button>
                
                <Button variant="outline" className="relative w-full h-12 md:h-11 border-gray-300 text-text">
                  <ImageIcon className="w-5 h-5 mr-2 text-text-secondary" />
                  Upload Image
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={handleChange}
                  />
                </Button>

                <Button variant="outline" className="relative w-full h-12 md:h-11 border-gray-300 text-text">
                  <FileText className="w-5 h-5 mr-2 text-text-secondary" />
                  Upload PDF
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="application/pdf"
                    onChange={handleChange}
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 md:p-20 text-center">
            {progressValue < 100 ? (
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div 
                  className="absolute inset-0 border-4 border-primary rounded-full animate-spin border-t-transparent"
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                  {Math.round(progressValue)}%
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
            )}
            
            <h3 className="text-xl md:text-2xl font-bold text-text mb-2">
              {progressValue < 100 ? 'AI Processing Engine' : 'Extraction Complete'}
            </h3>
            <p className="text-text-secondary font-medium">{progressStatus}</p>
            
            {/* Mocking the pipeline steps visually */}
            <div className="mt-12 max-w-sm mx-auto text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${progressValue > 10 ? 'bg-emerald-500' : 'bg-gray-200'} transition-colors`} />
                <span className={`text-sm font-medium ${progressValue > 10 ? 'text-text' : 'text-gray-400'}`}>Document Uploaded</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${progressValue > 40 ? 'bg-emerald-500' : 'bg-gray-200'} transition-colors`} />
                <span className={`text-sm font-medium ${progressValue > 40 ? 'text-text' : 'text-gray-400'}`}>Store Identification</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${progressValue > 80 ? 'bg-emerald-500' : 'bg-gray-200'} transition-colors`} />
                <span className={`text-sm font-medium ${progressValue > 80 ? 'text-text' : 'text-gray-400'}`}>Handwriting Recognition</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${progressValue === 100 ? 'bg-emerald-500' : 'bg-gray-200'} transition-colors`} />
                <span className={`text-sm font-medium ${progressValue === 100 ? 'text-text' : 'text-gray-400'}`}>Data Validation & Review</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
