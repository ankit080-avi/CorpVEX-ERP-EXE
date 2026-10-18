import React from 'react';

export type ToolCategory =
  | 'gst'
  | 'business'
  | 'barcode'
  | 'manufacturing'
  | 'utility'
  | 'pdf'
  | 'payroll'
  | 'analytics';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  title: string;
  shortTitle?: string;
  subtitle: string;
  description: string;
  category: ToolCategory;
  categoryLabel: string;
  keywords: string[];
  icon: string;
  badge?: string;
  component: React.ComponentType<{ theme: 'dark' | 'light' }>;
  seoTitle: string;
  seoDescription: string;
  formulaDescription?: string;
  formulaLatex?: string;
  howToUseSteps: string[];
  faqs: FAQItem[];
  relatedSlugs: string[];
  processingType?: 'client' | 'backend';
  status?: 'ready' | 'backend_required';
}
