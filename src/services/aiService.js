// Mock AI Service for simulating document extraction

export const processDocument = async (file, onProgress) => {
  const isFailureDemo = file.name.toLowerCase().includes('fail');

  const steps = [
    'Analyzing merchandising form...',
    'Checking image quality...',
    'Detecting document...',
    'Perspective correction...',
    'Image enhancement...',
    'Reading handwritten fields...',
    'Extracting audit information...',
    'Validation...',
    'Calculating confidence...',
  ];

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms per step
    if (onProgress) {
      onProgress(steps[i], ((i + 1) / steps.length) * 100);
    }

    if (isFailureDemo && i === 5) {
      throw new Error('PROCESSING_FAILED');
    }
  }

  // Return mock extracted data according to BRS
  return {
    auditId: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    store: { value: 'FairPrice Tampines Mall', confidence: 96 },
    location: { value: 'Singapore, East', confidence: 95 },
    date: { value: new Date().toISOString().split('T')[0], confidence: 99 },
    time: { value: '10:30', confidence: 92 },
    displayArea: { value: 'Chilled Section - Aisle 5', confidence: 88 },
    products: [
      {
        id: '1',
        sku: { value: '8934567', confidence: 72 }, // Low confidence for demo
        name: { value: 'Coca-Cola 1.5L', confidence: 98 },
        qtyBefore: { value: '12', confidence: 95 },
        qtyAfter: { value: '24', confidence: 91 },
        condition: { value: 'Good', confidence: 98 }
      }
    ],
    checklist: {
      restocked: { value: true, confidence: 99 },
      cleaned: { value: true, confidence: 95 },
      priceUpdated: { value: false, confidence: 82 },
      removedExpired: { value: false, confidence: 89 }
    },
    comments: { value: 'Shelf was low on stock.', confidence: 75 },
    staffName: { value: 'Alex Ng', confidence: 97 }
  };
};
