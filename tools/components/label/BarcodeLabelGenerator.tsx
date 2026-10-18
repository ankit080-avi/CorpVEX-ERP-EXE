import React from 'react';
import { SharedLabelDesigner } from './SharedLabelDesigner';

export interface BarcodeLabelGeneratorProps {
  theme: 'dark' | 'light';
}

/**
 * Free Barcode Label Generator
 * Quick barcode-centric label generator with thermal printer compatibility and high-DPI export.
 */
export const BarcodeLabelGenerator: React.FC<BarcodeLabelGeneratorProps> = ({ theme }) => {
  return (
    <div>
      <SharedLabelDesigner
        theme={theme}
        mode="barcode-label"
        initialPresetId="2x1"
      />
    </div>
  );
};
