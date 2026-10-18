import React from 'react';
import { SharedLabelDesigner } from './SharedLabelDesigner';

export interface ProductLabelDesignToolProps {
  theme: 'dark' | 'light';
}

/**
 * Product Label Design Tool
 * Allows users to create, customize, and print high-resolution product sticker labels entirely in browser.
 */
export const ProductLabelDesignTool: React.FC<ProductLabelDesignToolProps> = ({ theme }) => {
  return (
    <div>
      <SharedLabelDesigner
        theme={theme}
        mode="product-label"
        initialPresetId="3x2"
      />
    </div>
  );
};
