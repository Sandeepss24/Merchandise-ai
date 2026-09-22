// Mock AI Service for simulating document extraction

export const processDocument = async (file, onProgress) => {
  const steps = [
    'Image quality check...',
    'Document detected...',
    'Perspective correction...',
    'Image enhancement...',
    'Handwriting recognition...',
    'Field identification...',
    'Data extraction...',
    'Validation...',
    'Confidence scoring...',
    'Ready for review'
  ];

  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 300)); // 300ms per step
    if (onProgress) {
      onProgress(steps[i], ((i + 1) / steps.length) * 100);
    }
  }

  // Return mock extracted data according to BRS
  return {
    auditId: `AUD-${Math.floor(Math.random() * 10000)}`,
    store: { value: 'FairPrice Tampines Mall', confidence: 96 },
    location: { value: 'Tampines', confidence: 95 },
    date: { value: new Date().toISOString().split('T')[0], confidence: 99 },
    time: { value: '10:30', confidence: 92 },
    displayArea: { value: 'Chilled Section - Aisle 5', confidence: 88 },
    products: [
      {
        id: '1',
        sku: { value: 'JV-CHS-500', confidence: 61 }, // Low confidence for demo
        name: { value: 'Johnsonville Chicken Sausage', confidence: 85 },
        qtyBefore: { value: '8', confidence: 94 },
        qtyAfter: { value: '20', confidence: 90 },
        condition: { value: 'Good', confidence: 98 }
      }
    ],
    checklist: {
      restocked: { value: true, confidence: 99 },
      cleaned: { value: true, confidence: 95 },
      priceUpdated: { value: false, confidence: 82 },
      removedExpired: { value: false, confidence: 89 }
    },
    comments: { value: 'Shelf was low on stock. Restocked 12 packs.', confidence: 75 },
    staffName: { value: 'Alex Ng', confidence: 97 }
  };
};
