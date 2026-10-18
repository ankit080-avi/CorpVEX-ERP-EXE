import type { ToolDefinition, ToolCategory } from './types';

// GST & Tax
import { GstCalculator } from './components/gst/GstCalculator';
import { GstInclusiveExclusive } from './components/gst/GstInclusiveExclusive';
import { CgstSgstIgstCalculator } from './components/gst/CgstSgstIgstCalculator';
import { GstinValidator } from './components/gst/GstinValidator';
import { HsnFinder } from './components/gst/HsnFinder';
import { TdsCalculator } from './components/gst/TdsCalculator';
import { TcsCalculator } from './components/gst/TcsCalculator';
import { GstBillingInvoiceTool } from './components/gst/GstBillingInvoiceTool';

// Business & Finance
import { AmountToWords } from './components/business/AmountToWords';
import { DiscountCalculator } from './components/business/DiscountCalculator';
import { ProfitMarginCalculator } from './components/business/ProfitMarginCalculator';
import { MarkupCalculator } from './components/business/MarkupCalculator';
import { BreakEvenCalculator } from './components/business/BreakEvenCalculator';
import { CommissionCalculator } from './components/business/CommissionCalculator';
import { SellingPriceCalculator } from './components/business/SellingPriceCalculator';
import { InvoiceTotalCalculator } from './components/business/InvoiceTotalCalculator';

// Barcode & QR
import { QrCodeGenerator } from './components/barcode/QrCodeGenerator';
import { BarcodeGenerator } from './components/barcode/BarcodeGenerator';
import { UpiQrCodeGenerator } from './components/barcode/UpiQrCodeGenerator';

// Manufacturing / ERP
import { BomCostCalculator } from './components/mfg/BomCostCalculator';
import { GsmCalculator } from './components/mfg/GsmCalculator';
import { PcsWeightCalculator } from './components/mfg/PcsWeightCalculator';
import { UnitConverter } from './components/mfg/UnitConverter';

// Utility & Interest
import { PercentageCalculator } from './components/utility/PercentageCalculator';
import { EmiCalculator } from './components/utility/EmiCalculator';
import { SimpleInterestCalculator } from './components/utility/SimpleInterestCalculator';
import { CompoundInterestCalculator } from './components/utility/CompoundInterestCalculator';

// PDF Tools (Client-Side Friendly)
import {
  PdfMergeTool,
  PdfSplitTool,
  PdfRotateTool,
  ImagesToPdfTool,
  JpgToPdfTool,
  PdfPageExtractorTool,
  PdfNumberPagesTool,
  PdfMetadataRemoverTool,
} from './components/pdf/ClientPdfTools';

// PDF Tools (Heavy / Backend-Suitable)
import {
  PdfToWordTool,
  PdfToExcelTool,
  WordToPdfTool,
  ExcelToPdfTool,
  PdfCompressTool,
  PdfUnlockTool,
  PdfProtectTool,
  PdfToJpgTool,
  PdfWatermarkTool,
  PdfSignTool,
  PdfTextExtractorTool,
  PdfOcrTool,
} from './components/pdf/BackendPdfTools';

// HR & Payroll
import { SalarySlipGenerator } from './components/payroll/SalarySlipGenerator';

// Label & Barcode Designers
import { ProductLabelDesignTool } from './components/label/ProductLabelDesignTool';
import { BarcodeLabelGenerator } from './components/label/BarcodeLabelGenerator';

// Analytics & Insights
import { FreeSalesAnalysisDashboard } from './components/analytics/FreeSalesAnalysisDashboard';
import { FreeSalesItemsAnalysis } from './components/analytics/FreeSalesItemsAnalysis';

export const CATEGORIES: { id: ToolCategory; label: string; description: string; icon: string }[] = [
  {
    id: 'gst',
    label: 'GST & Tax',
    description: 'Indian Goods & Services Tax, HSN/SAC, GSTIN verification, TDS and TCS calculators.',
    icon: 'Receipt',
  },
  {
    id: 'business',
    label: 'Business & Pricing',
    description: 'Profit margin, markup, break-even point, invoice totals, discount, and cheque words.',
    icon: 'Briefcase',
  },
  {
    id: 'payroll',
    label: 'HR & Payroll',
    description: 'Salary slip generator, payslip printing, employee earnings, and deductions statements.',
    icon: 'Wallet',
  },
  {
    id: 'pdf',
    label: 'PDF Tools',
    description: 'Merge, split, rotate, convert, number, and sanitize PDF documents with browser privacy.',
    icon: 'FileText',
  },
  {
    id: 'barcode',
    label: 'Barcode & QR',
    description: 'Generate high-resolution printable QR codes and Code 128/39/EAN barcodes in client-side SVG/PNG.',
    icon: 'QrCode',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing / ERP',
    description: 'Bill of Materials (BOM), fabric GSM, piece-to-weight counting, and multi-unit conversions.',
    icon: 'Factory',
  },
  {
    id: 'utility',
    label: 'Financial & Utility',
    description: 'Loan EMI amortization, percentage calculations, simple and compound interest schedules.',
    icon: 'Calculator',
  },
  {
    id: 'analytics',
    label: 'Analytics & Insights',
    description: 'Interactive sales performance dashboards, monthly trends, financial year summaries, and customer RFM segmentation.',
    icon: 'TrendingUp',
  },
];

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. GST Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'gst-calculator',
    title: 'GST Calculator India (CGST, SGST, IGST)',
    shortTitle: 'GST Calculator',
    subtitle: 'Calculate GST amount, total price, and CGST/SGST split across standard 5%, 12%, 18%, 28% slabs.',
    description: 'Compute Goods & Services Tax (GST) online for any invoice value. Supports both Exclusive (add GST) and Inclusive (extract GST) tax modes with real-time CGST and SGST bifurcation.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['gst calculator', 'cgst', 'sgst', 'igst', 'gst tax slab', 'indian gst', 'exclusive gst', 'inclusive gst'],
    icon: 'Receipt',
    badge: 'Popular',
    component: GstCalculator,
    seoTitle: 'Free Online GST Calculator India - Calculate CGST, SGST & IGST',
    seoDescription: 'Calculate GST online accurately with exclusive and inclusive tax modes, CGST/SGST split, and standard 5%, 12%, 18%, 28% tax slabs. Free business tool.',
    formulaLatex: 'GST = (Amount × Rate) / 100 | Total = Amount + GST',
    formulaDescription: 'Exclusive: GST Amount = (Base Amount × GST Rate %) / 100. Net Total = Base Amount + GST Amount. Inclusive: Base Amount = Total × 100 / (100 + GST Rate %). GST Amount = Total - Base Amount.',
    howToUseSteps: [
      'Enter the base invoice amount or gross retail price.',
      'Select the standard GST slab (0%, 5%, 12%, 18%, 28%) or type a custom tax rate.',
      'Choose whether your entered amount is GST Exclusive (adding tax) or GST Inclusive (extracting tax).',
      'View the instant breakdown of Base Amount, Total GST, CGST (50%), and SGST (50%).',
    ],
    faqs: [
      {
        question: 'What is the difference between GST Exclusive and GST Inclusive?',
        answer: 'GST Exclusive means the entered amount is the pre-tax price; tax is added on top. GST Inclusive means the entered amount is the final retail price (MRP); tax is already included and mathematically backed out.',
      },
      {
        question: 'How is GST divided between Central and State governments?',
        answer: 'For intra-state sales (within the same state), GST is split equally into 50% CGST (Central GST) and 50% SGST (State GST). For inter-state sales, 100% is levied as IGST (Integrated GST).',
      },
      {
        question: 'What are the current GST tax slabs in India?',
        answer: 'The primary GST tax slabs in India are 0% (essential items/unprocessed grains), 5% (household essentials, packaged food), 12% (standard goods, processing), 18% (most manufactured goods, professional services), and 28% (luxury items, automobiles, aerated drinks).',
      },
    ],
    relatedSlugs: ['gst-inclusive-exclusive-calculator', 'cgst-sgst-igst-calculator', 'gstin-validator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. GST Inclusive vs Exclusive Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'gst-inclusive-exclusive-calculator',
    title: 'GST Inclusive vs Exclusive Calculator',
    shortTitle: 'Inclusive vs Exclusive',
    subtitle: 'Compare pre-tax cost versus MRP side-by-side or reverse-calculate base value from gross sales.',
    description: 'Easily understand whether your quotation includes or excludes GST. Perform side-by-side comparisons of gross receipts versus net supplier realizations with exact rupee breakdowns.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['gst inclusive', 'gst exclusive', 'reverse gst calculator', 'extract gst from total', 'mrp gst calculator'],
    icon: 'Percent',
    component: GstInclusiveExclusive,
    seoTitle: 'GST Inclusive vs Exclusive Calculator - Reverse Calculate Tax Base',
    seoDescription: 'Accurately convert between GST inclusive MRP and exclusive pre-tax rates. Side-by-side comparison for Indian vendors, wholesalers, and consumers.',
    formulaLatex: 'Base = Total / (1 + Rate / 100) | GST = Total - Base',
    formulaDescription: 'Reverse GST Formula: Base Amount = Total Price / (1 + (Rate / 100)). GST Collected = Total Price - Base Amount.',
    howToUseSteps: [
      'Enter your transaction amount in rupees.',
      'Select the applicable GST percentage slab.',
      'Compare Scenario A (Treating the amount as Exclusive) and Scenario B (Treating the amount as Inclusive).',
      'Use the copy button to transfer the exact values into your quotation or spreadsheet.',
    ],
    faqs: [
      {
        question: 'When should I use GST inclusive pricing?',
        answer: 'B2C retailers and ecommerce merchants selling directly to consumers typically quote MRP prices that are GST-inclusive. B2B wholesale transactions typically quote base prices that are GST-exclusive.',
      },
      {
        question: 'Can I claim Input Tax Credit (ITC) on GST inclusive purchases?',
        answer: 'Yes, provided you receive a valid GST tax invoice displaying your GSTIN and the bifurcated tax amount, you can claim ITC on the extracted tax component.',
      },
    ],
    relatedSlugs: ['gst-calculator', 'cgst-sgst-igst-calculator', 'selling-price-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. CGST / SGST / IGST Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'cgst-sgst-igst-calculator',
    title: 'CGST, SGST & IGST Tax Split Calculator',
    shortTitle: 'CGST / SGST / IGST',
    subtitle: 'Determine state tax liability for intra-state and inter-state transactions with state origin/destination selection.',
    description: 'Identify the exact tax split according to Indian GST supply rules. Select supplier state and customer state to automatically route tax as Central/State GST or Integrated GST.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['cgst calculator', 'sgst calculator', 'igst calculator', 'inter-state gst', 'intra-state gst', 'place of supply'],
    icon: 'Split',
    component: CgstSgstIgstCalculator,
    seoTitle: 'CGST SGST IGST Calculator - Intra-State vs Inter-State Tax Bifurcation',
    seoDescription: 'Calculate Central GST, State GST, and Integrated GST with state selection. Automatically identifies intra-state vs inter-state place of supply.',
    formulaLatex: 'Intra-State: CGST = Rate/2, SGST = Rate/2 | Inter-State: IGST = Rate',
    formulaDescription: 'Intra-State: CGST = (Amount × Rate/2)/100, SGST = (Amount × Rate/2)/100. Inter-State: IGST = (Amount × Rate)/100.',
    howToUseSteps: [
      'Enter the taxable supply value.',
      'Choose the applicable GST rate slab.',
      'Select Supplier State and Customer (Recipient) State.',
      'The calculator automatically determines Intra-State vs Inter-State supply and splits the tax.',
    ],
    faqs: [
      {
        question: 'What constitutes an Inter-State supply?',
        answer: 'When the location of the supplier and the place of supply are in different States or Union Territories, the transaction is treated as Inter-State and IGST is levied.',
      },
      {
        question: 'What is UTGST?',
        answer: 'Union Territory GST (UTGST) applies in place of SGST in Union Territories that do not have their own state legislature (such as Chandigarh, Lakshadweep, Ladakh).',
      },
    ],
    relatedSlugs: ['gst-calculator', 'gstin-validator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. GSTIN Validator & Structure Checker
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'gstin-validator',
    title: 'GSTIN Number Validator & Checksum Checker',
    shortTitle: 'GSTIN Validator',
    subtitle: 'Validate 15-character Indian GST numbers with Modulo 36 Luhn algorithm, state code, and PAN decoding.',
    description: 'Verify the structure of any Indian Goods and Services Tax Identification Number (GSTIN). Validates state code, decoded PAN, entity registration digit, and official checksum algorithm.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['gstin validator', 'verify gst number', 'gst number check', 'gst checksum modulo 36', 'pan from gstin'],
    icon: 'ShieldCheck',
    badge: 'Verification',
    component: GstinValidator,
    seoTitle: 'Free GSTIN Validator - Verify GST Number & Modulo-36 Checksum',
    seoDescription: 'Verify 15-character GSTIN numbers online. Instantly check state codes, PAN format, and official Modulo-36 checksum algorithm.',
    formulaLatex: 'Checksum: Modulo-36 Luhn weighted sum algorithm',
    formulaDescription: 'The 15-character GSTIN consists of: 2 digits (State Code) + 10 characters (PAN) + 1 digit (Entity Code) + "Z" (Default character) + 1 character (Modulo-36 Checksum digit).',
    howToUseSteps: [
      'Type or paste the 15-character GSTIN number (e.g., 27AABCU9603R1ZM).',
      'The validator checks length, state code validity, PAN pattern, and default 14th character Z.',
      'Calculates the official Modulo-36 checksum and flags invalid or typo numbers.',
    ],
    faqs: [
      {
        question: 'Does this tool communicate with the government GST portal?',
        answer: 'No, this tool validates mathematical syntax, state jurisdictions, and Modulo-36 Luhn checksum algorithms completely client-side in your browser for high speed and total privacy.',
      },
      {
        question: 'What do the 15 characters of a GSTIN represent?',
        answer: 'Chars 1-2: Two-digit State Code (01-38). Chars 3-12: Permanent Account Number (PAN) of taxpayer. Char 13: Entity number of the same PAN within the state. Char 14: Default letter "Z". Char 15: Modulo-36 verification checksum digit.',
      },
    ],
    relatedSlugs: ['gst-calculator', 'hsn-sac-code-finder', 'tds-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. HSN / SAC Code Finder
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'hsn-sac-code-finder',
    title: 'HSN / SAC Code Search & GST Rate Finder',
    shortTitle: 'HSN / SAC Finder',
    subtitle: 'Search 4-digit and 6-digit Harmonized System of Nomenclature codes and Service Accounting Codes with GST slabs.',
    description: 'Lookup HSN codes for goods and SAC codes for services. Search by keyword, commodity name, or chapter code to find official classification and applicable GST tax percentages.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['hsn code finder', 'sac code search', 'gst hsn code lookup', 'gst rate list', 'harmonized system nomenclature'],
    icon: 'Search',
    component: HsnFinder,
    seoTitle: 'HSN / SAC Code Finder - GST Rates & Harmonized Codes Search',
    seoDescription: 'Instant search for HSN and SAC codes under Indian GST. Find standard GST slabs, chapter classifications, and descriptions for goods and services.',
    formulaLatex: 'HSN/SAC Classification Hierarchy: Chapter (2 digits) > Heading (4 digits) > Sub-heading (6-8 digits)',
    formulaDescription: 'HSN uses standard World Customs Organization (WCO) nomenclature. Indian GST mandates 4-digit HSN for turnover up to ₹5 Cr and 6-digit HSN for turnover above ₹5 Cr.',
    howToUseSteps: [
      'Enter an item or service name (e.g., "Cotton", "Software", "Electronics", "Consulting").',
      'Filter by category (All, Goods / HSN, Services / SAC).',
      'Click on any matched code to copy the HSN code and view its standard GST slab.',
    ],
    faqs: [
      {
        question: 'Who is required to mention HSN codes on tax invoices?',
        answer: 'Businesses with aggregate turnover up to ₹5 Crore must report 4-digit HSN codes on B2B invoices. Businesses with turnover exceeding ₹5 Crore must report 6-digit HSN codes on all B2B and B2C invoices.',
      },
      {
        question: 'What is the difference between HSN and SAC?',
        answer: 'HSN (Harmonized System of Nomenclature) is used for classifying tangible goods and merchandise, whereas SAC (Services Accounting Code) is used exclusively for classifying intangible services.',
      },
    ],
    relatedSlugs: ['gst-calculator', 'gstin-validator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. TDS Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'tds-calculator',
    title: 'TDS Calculator (Tax Deducted at Source)',
    shortTitle: 'TDS Calculator',
    subtitle: 'Calculate TDS deduction and net supplier payout for 194C, 194J, 194I, 194H, and 194Q sections.',
    description: 'Calculate Tax Deducted at Source under the Indian Income Tax Act. Supports contractor payments (194C), professional/technical fees (194J), rent (194I), commission (194H), and goods purchase (194Q) with Section 206AA penalty logic.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['tds calculator', 'tax deducted at source', 'section 194c', 'section 194j', 'section 194i', 'tds without pan 206aa'],
    icon: 'FileText',
    component: TdsCalculator,
    seoTitle: 'TDS Calculator India - Section 194C, 194J, 194I, 194H Tax Rates',
    seoDescription: 'Calculate TDS on professional fees, contractor invoices, rent, and commission. Compute net payout with threshold limits and PAN/no-PAN rates.',
    formulaLatex: 'TDS = Gross Amount × (TDS Rate / 100) | Net Payout = Gross Amount - TDS',
    formulaDescription: 'If payee provides a valid PAN, standard statutory section rates apply. If payee does NOT furnish PAN, Section 206AA prescribes deduction at 20% or higher.',
    howToUseSteps: [
      'Enter the gross bill or invoice amount.',
      'Choose the relevant TDS section (194C, 194J, 194I, 194H, 194Q).',
      'Indicate payee category (Individual/HUF vs Company/Firm).',
      'Select whether PAN has been furnished to enforce Section 206AA rates if applicable.',
    ],
    faqs: [
      {
        question: 'What happens if a vendor does not provide their PAN?',
        answer: 'Under Section 206AA of the Income Tax Act, TDS must be deducted at a flat penalty rate of 20% (or higher if the applicable rate exceeds 20%) if the deductee fails to furnish a valid PAN.',
      },
      {
        question: 'When must deducted TDS be deposited with the government?',
        answer: 'TDS deducted during any month must be deposited via Challan ITNS 281 on or before the 7th of the following month (except for March deductions, which can be deposited by April 30th).',
      },
    ],
    relatedSlugs: ['tcs-calculator', 'gst-calculator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. TCS Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'tcs-calculator',
    title: 'TCS Calculator (Tax Collected at Source)',
    shortTitle: 'TCS Calculator',
    subtitle: 'Compute Tax Collected at Source under Section 206C(1H) on goods sale and 206C(1) specified commodities.',
    description: 'Calculate TCS applicable on sale of goods exceeding ₹50 Lakhs under Section 206C(1H), scrap, timber, tendu leaves, minerals, motor vehicles, and Liberalised Remittance Scheme (LRS).',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: ['tcs calculator', 'tax collected at source', 'section 206c 1h', 'tcs on sale of goods', 'tcs scrap minerals'],
    icon: 'Building',
    component: TcsCalculator,
    seoTitle: 'TCS Calculator India - Section 206C(1H) & 206C(1) Computation',
    seoDescription: 'Calculate Tax Collected at Source on commercial sales, scrap, minerals, and motor vehicles. Check ₹50 Lakh threshold rules and buyer PAN status.',
    formulaLatex: 'TCS = Taxable Consideration × TCS Rate % | Invoice Gross = Base + GST + TCS',
    formulaDescription: 'TCS is collected by the seller from the buyer over and above the invoice value and GST. Under Section 206C(1H), TCS of 0.1% applies on receipts exceeding ₹50 Lakh in a financial year.',
    howToUseSteps: [
      'Enter the gross consideration or invoice total.',
      'Select the statutory TCS section (e.g., Sale of Goods > ₹50L, Scrap, Motor Vehicles > ₹10L).',
      'Check buyer PAN compliance to determine 0.1% versus 1% (Section 206CCA).',
      'View the calculated TCS amount and the final gross billing total.',
    ],
    faqs: [
      {
        question: 'Is TCS calculated on the pre-tax amount or GST-inclusive amount?',
        answer: 'CBDT circulars clarify that for Section 206C(1H) (Sale of goods), TCS is collected on the actual receipt value, which includes GST.',
      },
      {
        question: 'Who is liable to collect TCS under Section 206C(1H)?',
        answer: 'Sellers whose total turnover in the preceding financial year exceeded ₹10 Crore are liable to collect TCS on sales to any buyer exceeding ₹50 Lakhs in the current year.',
      },
    ],
    relatedSlugs: ['tds-calculator', 'gst-calculator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // Free GST Billing & Invoicing Tool
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'free-gst-billing-and-invoicing',
    title: 'Free GST Billing & Invoice Generator Online',
    shortTitle: 'Free GST Billing & Invoicing',
    subtitle: 'Generate professional GST-compliant invoices online with automatic CGST, SGST, IGST calculations, HSN/SAC support, and instant A4 PDF printing.',
    description: 'Create professional GST tax invoices directly in your browser with automatic state-based tax detection (CGST/SGST for intrastate, IGST for interstate), dynamic itemized rows, rate-wise GST breakdown, Indian Rupee words formatting, and clean A4 print/PDF export.',
    category: 'gst',
    categoryLabel: 'GST & Tax',
    keywords: [
      'free gst billing',
      'gst invoice generator',
      'gst billing software free',
      'online invoice maker',
      'gst tax invoice pdf',
      'cgst sgst igst invoice',
      'hsn invoice generator',
      'a4 invoice print',
    ],
    icon: 'Receipt',
    badge: 'A4 Printable',
    component: GstBillingInvoiceTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free GST Billing & Invoice Generator Online - Professional PDF Invoices | CorpVEX',
    seoDescription: 'Create professional GST invoices online with automatic CGST, SGST and IGST calculations, HSN/SAC support, PDF-ready invoices and no signup.',
    formulaLatex: '\\text{Grand Total} = \\text{Taxable Value} + \\text{CGST} + \\text{SGST} + \\text{IGST}',
    formulaDescription: 'Line Taxable Amount = (Quantity × Rate) - Discount. For Intrastate: CGST = Taxable × Rate/2, SGST = Taxable × Rate/2. For Interstate: IGST = Taxable × Rate. Grand Total = Taxable Value + Total Tax.',
    howToUseSteps: [
      'Enter Supplier / Company details (name, address, optional GSTIN, state, and logo).',
      'Enter Customer / Bill To details and optional Ship To address.',
      'Specify Invoice Number, Invoice Date, and Place of Supply.',
      'Add dynamic line items with HSN/SAC, quantity, unit, unit rate, discount %, and GST slab (0%, 5%, 12%, 18%, 28%).',
      'Review automatic CGST/SGST/IGST computations, GST rate breakdown, and Grand Total.',
      'Click "Print / Save as PDF" to download or print your clean A4 GST tax invoice directly from the browser.',
    ],
    faqs: [
      {
        question: 'How does the tool decide between CGST+SGST versus IGST?',
        answer: 'The tool automatically compares your Supplier State and the Place of Supply / Customer State. If they match, Intrastate GST (50% CGST + 50% SGST) is applied. If they differ, Interstate GST (100% IGST) is applied. You can also manually override the tax model using the toggle selector.',
      },
      {
        question: 'Is any confidential invoice or customer data stored or uploaded to servers?',
        answer: 'No. All calculations, data formatting, and PDF rendering occur strictly inside your web browser. No company details, customer information, GSTINs, or monetary amounts are sent across the network or logged.',
      },
      {
        question: 'Does this tool support B2C retail invoices without a buyer GSTIN?',
        answer: 'Yes. Customer GSTIN is completely optional. If left blank, the invoice will cleanly format as a B2C retail tax invoice with "Unregistered / B2C" status.',
      },
      {
        question: 'How do I save the invoice as a PDF file?',
        answer: 'Click the "Print / Save as PDF" button. In your browser print dialog, choose "Save as PDF" as the Destination, select A4 paper size, and click Save.',
      },
    ],
    relatedSlugs: ['gst-calculator', 'cgst-sgst-igst-calculator', 'amount-to-words', 'invoice-total-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. Amount to Words (Cheque / Invoice Writer)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'number-to-words-converter',
    title: 'Amount to Words Converter (Cheques & Invoices)',
    shortTitle: 'Amount to Words',
    subtitle: 'Convert numbers into words formatted in Indian numbering (Crores, Lakhs) and International numbering (Millions, Billions).',
    description: 'Transform monetary figures and numbers into formatted English text for cheques, commercial invoices, legal contracts, receipts, and bills of exchange. Includes Rupee/Paisa formatting.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['number to words', 'amount in words', 'cheque amount in words', 'crore lakh converter', 'rupees words converter'],
    icon: 'Type',
    badge: 'Essential',
    component: AmountToWords,
    seoTitle: 'Amount to Words Converter - Cheques & Invoices (Crores & Lakhs)',
    seoDescription: 'Convert numbers and currency figures to words in Indian Lakhs/Crores and International Millions/Billions format. One-click copy for cheques and invoices.',
    formulaLatex: 'Grouping: Indian (3,2,2 digits) vs International (3,3,3 digits)',
    formulaDescription: 'Indian Format: Units, Thousands, Lakhs (10^5), Crores (10^7). International Format: Units, Thousands, Millions (10^6), Billions (10^9). Both formats accurately handle Paisa and Cents decimal fractions.',
    howToUseSteps: [
      'Enter any positive numeric amount (decimals supported for Paisa / Cents).',
      'Toggle between Indian System (Lakhs / Crores) and Western System (Millions / Billions).',
      'Choose whether to append currency suffixes like "Rupees Only" or "Paisa Only".',
      'Click the copy button to paste the result directly into your banking portal or ERP.',
    ],
    faqs: [
      {
        question: 'Why do bank cheques require the amount written in words?',
        answer: 'Writing amounts in words prevents fraudulent alterations and unauthorized additions to digits on negotiable instruments like cheques and promissory notes.',
      },
      {
        question: 'Does this handle decimals like 50 paise correctly?',
        answer: 'Yes, if you enter 12500.50, the tool outputs "Rupees Twelve Thousand Five Hundred and Fifty Paisa Only".',
      },
    ],
    relatedSlugs: ['invoice-generator-calculator', 'gst-calculator', 'discount-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 9. Discount Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator (Percentage & Stacked Offers)',
    shortTitle: 'Discount Calculator',
    subtitle: 'Calculate final prices after percentage discounts, flat rupee off, and sequential stacked promo codes.',
    description: 'Compute exact consumer savings and net invoice prices with single or multi-tier chained discounts. Perfect for wholesale trade discounts, seasonal clearances, and festival schemes.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['discount calculator', 'percent off', 'stacked discount', 'sale price calculator', 'trade discount calculator'],
    icon: 'Tag',
    component: DiscountCalculator,
    seoTitle: 'Discount Calculator - Calculate Percentage Off & Stacked Discounts',
    seoDescription: 'Find discounted sale prices and total savings quickly. Calculate flat discounts, percentage off, and multi-tier stacked discounts with step breakdown.',
    formulaLatex: 'Final = Original × (1 - D1/100) × (1 - D2/100) | Savings = Original - Final',
    formulaDescription: 'Single Discount: Savings = Original × (Discount % / 100). Final Price = Original - Savings. Stacked Discounts apply consecutively to the declining running balance.',
    howToUseSteps: [
      'Enter the original list price (MRP).',
      'Select discount type (Percentage % or Flat Rupee deduction).',
      'Optionally enable "Stacked Discount" for seasonal promotions (e.g., 20% off + extra 10% coupon).',
      'Review total rupee savings and effective total discount percentage.',
    ],
    faqs: [
      {
        question: 'What is a stacked or sequential discount?',
        answer: 'A stacked discount applies a second discount to the price after the first discount has already been deducted. For example, 50% + 10% on ₹1,000 results in ₹450 (effective 55% off), not 60% off (₹400).',
      },
      {
        question: 'What is the difference between a cash discount and trade discount?',
        answer: 'Trade discounts are offered by manufacturers to wholesalers based on order volume. Cash discounts are offered for prompt settlement within a specified credit period.',
      },
    ],
    relatedSlugs: ['profit-margin-calculator', 'markup-calculator', 'selling-price-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 10. Profit Margin Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'profit-margin-calculator',
    title: 'Profit Margin Calculator (Gross & Net Margin)',
    shortTitle: 'Profit Margin',
    subtitle: 'Determine profit margin percentage, dollar profit, and target selling price based on cost.',
    description: 'Calculate gross profit margin, markup percentage, and profit per unit. Toggle between calculating margin from cost/price or reverse-engineering selling price from desired target margin.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['profit margin calculator', 'gross margin percentage', 'target margin', 'margin vs markup', 'cost price calculator'],
    icon: 'TrendingUp',
    badge: 'Essential',
    component: ProfitMarginCalculator,
    seoTitle: 'Profit Margin Calculator - Calculate Gross Profit & Margin %',
    seoDescription: 'Calculate profit margin percentage, markup, and revenue online. Reverse calculate target selling prices based on profit goals.',
    formulaLatex: 'Margin % = (Profit / Revenue) × 100 | Markup % = (Profit / Cost) × 100',
    formulaDescription: 'Profit = Revenue - Cost. Margin % = (Profit / Revenue) × 100. Markup % = (Profit / Cost) × 100. Target Revenue = Cost / (1 - (Target Margin % / 100)).',
    howToUseSteps: [
      'Choose calculation mode (Calculate Margin from Cost & Price, or Calculate Price from Cost & Desired Margin).',
      'Enter total product cost and target revenue/selling price.',
      'Analyze the resulting Gross Profit, Margin %, and Markup %.',
    ],
    faqs: [
      {
        question: 'What is the fundamental difference between Margin and Markup?',
        answer: 'Margin is profit expressed as a percentage of the selling price (revenue). Markup is profit expressed as a percentage of the cost price. A 25% markup on ₹100 equals ₹125 selling price, yielding a 20% margin.',
      },
      {
        question: 'What is a healthy profit margin for wholesale and manufacturing?',
        answer: 'Typical gross profit margins in manufacturing range from 25% to 40%, whereas wholesale trade typically operates on tighter margins between 10% and 20% due to volume turnover.',
      },
    ],
    relatedSlugs: ['markup-calculator', 'selling-price-calculator', 'break-even-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 11. Markup Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'markup-calculator',
    title: 'Markup Calculator (Cost to Price Conversion)',
    shortTitle: 'Markup Calculator',
    subtitle: 'Convert product cost into consumer selling price with customized percentage or flat markup values.',
    description: 'Calculate your final selling price by adding a percentage or fixed markup to your unit cost. Compare effective gross profit margin side-by-side with markup percentage.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['markup calculator', 'cost markup', 'markup to margin conversion', 'price markup percentage', 'retail pricing'],
    icon: 'DollarSign',
    component: MarkupCalculator,
    seoTitle: 'Markup Calculator - Convert Cost to Retail Price Online',
    seoDescription: 'Calculate selling price and profit from cost with percentage or dollar markup. View instant markup to margin conversion table.',
    formulaLatex: 'Selling Price = Cost × (1 + Markup / 100) | Margin = Markup / (1 + Markup / 100)',
    formulaDescription: 'Selling Price = Cost + (Cost × Markup % / 100). Profit = Selling Price - Cost. Corresponding Margin % = Markup % / (1 + (Markup % / 100)).',
    howToUseSteps: [
      'Enter the raw or landed cost of your product.',
      'Enter your desired markup percentage (e.g., 35%).',
      'View the computed selling price, net profit in rupees, and the equivalent gross profit margin.',
    ],
    faqs: [
      {
        question: 'Can markup ever exceed 100%?',
        answer: 'Yes, markup can be any number above 0%. For example, a 200% markup on a ₹100 item results in a ₹300 selling price. In contrast, profit margin can never reach or exceed 100% on positive cost items.',
      },
      {
        question: 'Why do retailers prefer markup over margin when pricing products?',
        answer: 'Markup is simpler for day-to-day operations because merchants know their vendor cost directly, making it straightforward to add a fixed percentage markup across catalog categories.',
      },
    ],
    relatedSlugs: ['profit-margin-calculator', 'selling-price-calculator', 'discount-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 12. Break-Even Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Point Calculator (Units & Revenue)',
    shortTitle: 'Break-Even Point',
    subtitle: 'Find how many units you must produce and sell to cover fixed overheads and start generating profit.',
    description: 'Calculate your financial break-even point in units and sales volume. Understand contribution margin per unit and contribution margin ratio to de-risk new product lines and factory operations.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['break even calculator', 'bep analysis', 'contribution margin', 'fixed costs variable costs', 'break even units'],
    icon: 'Target',
    badge: 'Popular',
    component: BreakEvenCalculator,
    seoTitle: 'Break-Even Point Calculator - Units & Revenue Analysis',
    seoDescription: 'Calculate the break-even point in units and revenue. Discover your contribution margin and margin of safety to achieve operational profitability.',
    formulaLatex: 'BEP (Units) = Fixed Costs / (Selling Price - Variable Cost per Unit)',
    formulaDescription: 'Contribution Margin = Selling Price - Variable Cost. Contribution Margin Ratio = Contribution Margin / Selling Price. Break-Even Units = Total Fixed Costs / Contribution Margin.',
    howToUseSteps: [
      'Enter total monthly or annual Fixed Costs (rent, salaries, insurance, depreciation).',
      'Enter Variable Cost per unit (raw materials, direct labor, packaging).',
      'Enter Selling Price per unit.',
      'View Break-Even volume in units and required minimum revenue.',
    ],
    faqs: [
      {
        question: 'What are examples of Fixed vs Variable costs?',
        answer: 'Fixed costs remain constant regardless of production volume (e.g., factory lease, office staff salaries, software subscriptions). Variable costs change directly with output (e.g., raw materials, packaging boxes, electricity per unit produced).',
      },
      {
        question: 'What is the Margin of Safety?',
        answer: 'The Margin of Safety is the difference between actual (or expected) sales and break-even sales. It represents how much sales can drop before the business begins incurring net losses.',
      },
    ],
    relatedSlugs: ['bom-cost-calculator', 'profit-margin-calculator', 'selling-price-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 13. Commission Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'commission-calculator',
    title: 'Sales Commission Calculator (Tiers & Deductions)',
    shortTitle: 'Commission Calculator',
    subtitle: 'Calculate sales agent commissions, agency margins, withholding deductions, and net payouts.',
    description: 'Compute commission payouts for sales representatives, brokers, affiliate agents, and marketplace sellers. Supports tiered sales bonuses and tax deductions.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['commission calculator', 'sales commission', 'brokerage calculator', 'affiliate payout', 'agent commission'],
    icon: 'Percent',
    component: CommissionCalculator,
    seoTitle: 'Sales Commission Calculator - Agent Payout & Deductions',
    seoDescription: 'Calculate gross sales commission, deduction allowances, and net agent payout online. Supports flat rates, percentage splits, and deductions.',
    formulaLatex: 'Commission = Sales Value × Rate % | Net Payout = Commission - Deductions',
    formulaDescription: 'Gross Commission = Total Sales × (Commission Rate / 100). Net Payout = Gross Commission - Tax/TDS Deductions + Bonuses.',
    howToUseSteps: [
      'Enter the gross deal or sales transaction value.',
      'Input the commission percentage or flat fee.',
      'Optionally specify TDS or deduction percentages.',
      'Review gross commission, deductions, and net agent realization.',
    ],
    faqs: [
      {
        question: 'Is commission subject to TDS under Indian Income Tax?',
        answer: 'Yes, commission or brokerage paid to Indian resident agents is subject to TDS under Section 194H at 5% if total payments exceed ₹15,000 in a financial year.',
      },
      {
        question: 'Can commission be calculated on gross sales or net collected receipts?',
        answer: 'Contracts vary: gross commission is calculated on total invoiced billing, whereas net commission is calculated on realized cash collections after returns and discounts.',
      },
    ],
    relatedSlugs: ['tds-calculator', 'profit-margin-calculator', 'discount-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 14. Selling Price Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'selling-price-calculator',
    title: 'Selling Price Calculator (Direct Cost + Overheads + GST)',
    shortTitle: 'Selling Price',
    subtitle: 'Determine optimal consumer price by combining material costs, overheads, desired margin, and tax.',
    description: 'Build your final commercial quotation from the ground up. Combine raw material costs, direct labor, operational overheads, desired profit margin, and GST into a single retail or wholesale selling price.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['selling price calculator', 'quotation pricing', 'price determination', 'landed cost pricing', 'mrp builder'],
    icon: 'Tag',
    component: SellingPriceCalculator,
    seoTitle: 'Selling Price Calculator - Cost, Overheads, Margin & GST',
    seoDescription: 'Calculate the ideal selling price and MRP for your goods. Aggregate direct production costs, overhead allowances, desired profit margin, and GST tax.',
    formulaLatex: 'Pre-Tax Price = (Total Cost) / (1 - Margin/100) | MRP = Pre-Tax × (1 + GST/100)',
    formulaDescription: 'Total Cost = Direct Material + Direct Labor + Allocated Overheads. Selling Price (pre-tax) = Total Cost / (1 - (Desired Margin % / 100)). Final Invoice Price = Selling Price + GST.',
    howToUseSteps: [
      'Enter direct unit material and manufacturing costs.',
      'Add operational overheads and packaging expenses.',
      'Select your desired profit margin percentage.',
      'Choose the applicable GST rate to calculate the final end-customer MRP.',
    ],
    faqs: [
      {
        question: 'Why should overheads be allocated before applying profit margin?',
        answer: 'Omitting overhead costs (utilities, warehouse storage, shipping) artificially inflates perceived margins and can lead to operational cash deficits even when sales volume is high.',
      },
      {
        question: 'What is the difference between Selling Price and MRP?',
        answer: 'Selling Price is typically the pre-tax or negotiated commercial price in B2B transactions. Maximum Retail Price (MRP) is the all-inclusive ceiling price printed on consumer goods.',
      },
    ],
    relatedSlugs: ['bom-cost-calculator', 'profit-margin-calculator', 'gst-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 15. Invoice Total Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'invoice-generator-calculator',
    title: 'Invoice Total & Multi-Item Line Calculator',
    shortTitle: 'Invoice Calculator',
    subtitle: 'Create multi-row itemized invoice totals with quantity, line discounts, GST slabs, shipping, and round-off.',
    description: 'Build complete commercial invoice calculations with dynamic item lines. Add quantity, unit prices, individual item discount percentages, customizable GST tax slabs, freight charges, and automatic round-off adjustments.',
    category: 'business',
    categoryLabel: 'Business & Pricing',
    keywords: ['invoice calculator', 'invoice total calculation', 'multi-item invoice', 'gst invoice summary', 'freight and roundoff'],
    icon: 'Receipt',
    badge: 'Popular',
    component: InvoiceTotalCalculator,
    seoTitle: 'Free Invoice Total Calculator - Multi-Line GST & Discount Summary',
    seoDescription: 'Calculate itemized invoice subtotals, line discounts, mixed GST slabs, shipping freight, and rounding off. Copy ready-to-use billing summaries.',
    formulaLatex: 'Line Total = (Qty × Rate - Discount) × (1 + GST Rate / 100)',
    formulaDescription: 'Subtotal = Σ (Qty × Rate - Line Discount). Total Tax = Σ (Line Taxable Amount × GST Rate). Grand Total = Subtotal + Total Tax + Shipping/Handling ± Round-Off.',
    howToUseSteps: [
      'Add rows for each item or service line.',
      'Enter Description, Quantity, Unit Rate, and any line discount.',
      'Select the specific GST slab for each item line.',
      'Specify freight/shipping charges if applicable and view the rounded Grand Total.',
    ],
    faqs: [
      {
        question: 'Can different items on the same invoice have different GST rates?',
        answer: 'Yes, Indian GST law supports mixed invoices where different line items carry different GST rates (e.g., 5%, 12%, and 18% on a single invoice).',
      },
      {
        question: 'What is the standard rule for invoice rounding off in India?',
        answer: 'Invoices are rounded off to the nearest rupee. Fractions below 50 paise are rounded down, while fractions of 50 paise or above are rounded up to the nearest rupee.',
      },
    ],
    relatedSlugs: ['gst-calculator', 'amount-to-words-converter', 'hsn-sac-code-finder'],
  },

  // ─────────────────────────────────────────────────────────────
  // 16. QR Code Generator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'qr-code-generator',
    title: 'High-Resolution QR Code Generator (URL, UPI, WhatsApp)',
    shortTitle: 'QR Code Generator',
    subtitle: 'Generate clean, printable QR codes with instant vector SVG and high-DPI PNG export. Zero tracking.',
    description: 'Create customized QR codes directly in your browser. Supports website URLs, Indian UPI instant payment links (GPay/PhonePe/Paytm), WhatsApp direct messaging, and plain text. No server tracking or latency.',
    category: 'barcode',
    categoryLabel: 'Barcode & QR',
    keywords: ['qr code generator', 'upi qr code', 'whatsapp qr code', 'vector svg qr code', 'client side qr generator'],
    icon: 'QrCode',
    badge: 'Vector Export',
    component: QrCodeGenerator,
    seoTitle: 'Free QR Code Generator - Vector SVG & PNG Export (UPI, URL, Text)',
    seoDescription: 'Generate custom QR codes online. Create UPI payment QR codes, website links, and WhatsApp chat codes. Export crisp high-resolution SVG and PNG formats.',
    formulaLatex: 'ISO/IEC 18004 2D Matrix Symbol with Reed-Solomon Error Correction',
    formulaDescription: 'Client-side ISO/IEC 18004 QR generation with Reed-Solomon forward error correction (Levels L, M, Q, H). Data is encoded locally with zero transmission to external servers.',
    howToUseSteps: [
      'Select QR code type: Website URL, UPI Payment (VPA/Merchant), WhatsApp direct chat, or Text.',
      'Enter your content and customize pixel size and margin padding.',
      'Choose high-contrast foreground and background colors.',
      'Download as high-res PNG for digital display or sharp vector SVG for physical packaging printing.',
    ],
    faqs: [
      {
        question: 'Do these QR codes expire or have scan limits?',
        answer: 'No! These are 100% static, client-side generated QR codes. They embed your actual link or payload directly into the matrix without any intermediary redirect servers, meaning they never expire and have zero scan limits.',
      },
      {
        question: 'How do UPI QR codes work for payments?',
        answer: 'A UPI QR code encodes a standard NPCI URI string (e.g. `upi://pay?pa=merchant@upi&pn=MerchantName&am=100`). Any UPI-enabled app (Google Pay, PhonePe, Paytm, BHIM) instantly parses this format.',
      },
    ],
    relatedSlugs: ['upi-qr-code-generator', 'barcode-generator', 'invoice-generator-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // UPI QR Code Generator (Zubizi Style Merchant Standee)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'upi-qr-code-generator',
    title: 'UPI QR Code Generator (Custom Logo & Merchant Standee)',
    shortTitle: 'UPI QR Generator',
    subtitle: 'Generate professional merchant UPI payment QR codes with custom logo, fixed amounts, GPay/PhonePe/Paytm badges, and counter standee export.',
    description: 'Create custom Indian UPI payment QR codes in seconds. Enter your UPI ID (VPA), merchant name, optional fixed amount or invoice remark, upload your business logo, and download a professional printable counter standee card or high-res PNG.',
    category: 'barcode',
    categoryLabel: 'Barcode & QR',
    keywords: [
      'upi qr code generator',
      'upi payment qr',
      'gpay qr code',
      'phonepe qr maker',
      'paytm qr code',
      'upi standee maker',
      'merchant upi qr',
      'bhim upi qr generator',
    ],
    icon: 'QrCode',
    badge: 'Standee Export',
    component: UpiQrCodeGenerator,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free UPI QR Code Generator - Custom Logo & Counter Standee Card | CorpVEX',
    seoDescription: 'Generate custom UPI QR codes for payments with custom logo, fixed amount, and supported UPI apps (GPay, PhonePe, Paytm). Export high-res PNG standees.',
    formulaLatex: '\\text{UPI URI} = \\text{upi://pay?pa=VPA\\&pn=NAME\\&am=AMOUNT\\&cu=INR\\&tn=NOTE}',
    formulaDescription: 'Formats payment parameters into standard NPCI UPI intent protocol. Error correction Level M allows embedding center brand logos without degrading scanner readability.',
    howToUseSteps: [
      'Enter your Merchant UPI ID (VPA, e.g. ankit@googlepay or your mobile@upi).',
      'Enter your Payee / Business Name to display at the top of the payment card.',
      'Optionally set a fixed amount in Rupees and an invoice note or remark.',
      'Upload your business logo to embed it neatly into the center of the QR code.',
      'Toggle display options: show UPI ID, show supported app badges (GPay, PhonePe, Paytm, Amazon Pay), or amount.',
      'Click "Export as PNG" to download the ready-to-print merchant counter standee card.',
    ],
    faqs: [
      {
        question: 'Which UPI apps can scan this generated QR code?',
        answer: 'All UPI-enabled apps in India seamlessly support this standard NPCI format, including Google Pay (GPay), PhonePe, Paytm, BHIM, Amazon Pay, CRED, and mobile banking apps from SBI, HDFC, ICICI, Axis, etc.',
      },
      {
        question: 'Does scanning this QR code automatically transfer money?',
        answer: 'When a customer scans the QR code, their UPI app automatically opens with your UPI ID, Payee Name, and optional preset amount already filled in. The customer simply enters their secret UPI PIN to authorize the payment.',
      },
      {
        question: 'Can I print this QR code and put it on my shop counter or billing desk?',
        answer: 'Yes! You can either click "Export as PNG" to get a high-resolution standee graphic, or click "Print Counter Standee" to print directly to paper or photo standee format.',
      },
      {
        question: 'Is my UPI ID or bank account data stored on your server?',
        answer: 'No. The entire QR code and standee graphic are generated 100% inside your browser using client-side canvas technology. Zero information is ever sent to or stored on any server.',
      },
    ],
    relatedSlugs: ['qr-code-generator', 'free-gst-billing-and-invoicing', 'amount-to-words-converter'],
  },

  // ─────────────────────────────────────────────────────────────
  // 17. Barcode Generator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'barcode-generator',
    title: 'Barcode Generator (Code 128, Code 39, EAN-13)',
    shortTitle: 'Barcode Generator',
    subtitle: 'Generate linear 1D barcodes with adjustable bar widths, heights, human-readable text, and SVG/PNG export.',
    description: 'Create industrial and retail 1D barcodes in your browser. Supports Code 128 (high-density alphanumeric), Code 39 (industrial/military), and EAN-13 (retail GS1 products) with instant SVG and PNG downloads.',
    category: 'barcode',
    categoryLabel: 'Barcode & QR',
    keywords: ['barcode generator', 'code 128 barcode', 'code 39 generator', 'ean 13 barcode', 'inventory barcode labels'],
    icon: 'Barcode',
    badge: 'Vector Export',
    component: BarcodeGenerator,
    seoTitle: 'Free Barcode Generator - Code 128, Code 39, EAN-13 (SVG & PNG)',
    seoDescription: 'Generate printable 1D barcodes for inventory and retail packaging. Export Code 128, Code 39, and EAN-13 barcodes with crisp vector SVG and PNG.',
    formulaLatex: 'Code 128 (Mod-103 checksum) | EAN-13 (Mod-10 weighted checksum)',
    formulaDescription: 'Code 128 uses start/stop symbols and Modulo-103 check characters. EAN-13 calculates standard GS1 Modulo-10 check digits by alternating 1x and 3x position weights.',
    howToUseSteps: [
      'Select barcode standard (Code 128 for general alphanumeric, Code 39 for uppercase industrial, or EAN-13 for 12/13-digit retail products).',
      'Type your SKU, serial number, or product code.',
      'Adjust bar width, height, and toggle human-readable labels.',
      'Export high-resolution PNG or print-ready vector SVG for label printers.',
    ],
    faqs: [
      {
        question: 'Which barcode format should I choose for warehouse inventory?',
        answer: 'Code 128 is the industry standard for internal inventory, logistics, and bin labeling because it supports all 128 ASCII characters with high data density.',
      },
      {
        question: 'Can I use EAN-13 barcodes for retail stores?',
        answer: 'Yes, EAN-13 is the universal 13-digit barcode used for consumer retail products at point-of-sale checkout scanners across India and globally.',
      },
    ],
    relatedSlugs: ['qr-code-generator', 'pieces-to-weight-calculator', 'bom-cost-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 18. BOM Cost Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'bom-cost-calculator',
    title: 'Bill of Materials (BOM) & Manufacturing Cost Calculator',
    shortTitle: 'BOM Cost Calculator',
    subtitle: 'Compute finished goods cost by aggregating multi-item raw materials, scrap wastage, labor, and machine overheads.',
    description: 'Calculate manufacturing product costs from your Bill of Materials. Add raw materials with scrap/scrap allowances, direct labor hours, machine overhead rates, and determine exact per-unit production cost.',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing / ERP',
    keywords: ['bom cost calculator', 'bill of materials cost', 'manufacturing cost calculator', 'cost of goods manufactured', 'scrap wastage'],
    icon: 'Factory',
    badge: 'Popular',
    component: BomCostCalculator,
    seoTitle: 'BOM Cost Calculator - Bill of Materials & Production Costing',
    seoDescription: 'Calculate Bill of Materials (BOM) cost and unit manufacturing cost. Combine raw materials with scrap wastage, labor rates, and overhead allocations.',
    formulaLatex: 'Unit Cost = (Total Materials + Scrap + Labor + Overheads) / Batch Size',
    formulaDescription: 'Material Cost = Σ [Qty × Unit Rate × (1 + Scrap% / 100)]. Total Batch Cost = Material Cost + Labor Hours × Hourly Rate + Overhead Costs. Unit Cost = Total Batch Cost / Batch Quantity.',
    howToUseSteps: [
      'Enter your planned batch production quantity.',
      'Add rows for each raw material with quantity, unit rate, and expected scrap wastage percentage.',
      'Enter direct labor hours, hourly wage rates, and machine overhead allocations.',
      'Review total batch cost, unit manufacturing cost, and percentage cost breakdown.',
    ],
    faqs: [
      {
        question: 'What is scrap allowance in manufacturing BOMs?',
        answer: 'Scrap allowance accounts for inevitable raw material losses during cutting, machining, trimming, or tooling setup. Factoring in scrap ensures accurate job costing.',
      },
      {
        question: 'How do overhead allocations affect unit cost?',
        answer: 'Overheads cover indirect manufacturing expenses like factory rent, electricity, maintenance, and machine depreciation distributed across the production batch.',
      },
    ],
    relatedSlugs: ['selling-price-calculator', 'break-even-calculator', 'fabric-gsm-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 19. Fabric GSM Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'fabric-gsm-calculator',
    title: 'Fabric GSM Calculator (Textile Weight & Construction)',
    shortTitle: 'Fabric GSM Calculator',
    subtitle: 'Calculate fabric weight in Grams per Square Meter (GSM) and oz/yd² using swatch sample or yarn construction.',
    description: 'Calculate textile fabric weight in Grams per Square Meter (GSM) and Ounces per Square Yard (oz/yd²). Features two calculation modes: Sample Swatch Weight method and Woven Fabric Construction method (EPI, PPI, Warp/Weft yarn counts, and crimp %).',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing / ERP',
    keywords: ['fabric gsm calculator', 'grams per square meter', 'textile gsm calculator', 'warp weft count', 'oz per sq yard'],
    icon: 'Layers',
    component: GsmCalculator,
    seoTitle: 'Fabric GSM Calculator - Textile Weight & Woven Construction',
    seoDescription: 'Calculate fabric Grams per Square Meter (GSM) and oz/yd². Supports physical swatch sample weighing and technical woven construction methods.',
    formulaLatex: 'GSM = (Sample Weight in g × 10,000) / (Length in cm × Width in cm)',
    formulaDescription: 'Swatch Method: GSM = (Weight in grams × 10,000) / (Length cm × Width cm). Construction Method: GSM = (EPI / Warp Count × (1 + Crimp%/100) + PPI / Weft Count × (1 + Crimp%/100)) × 25.6.',
    howToUseSteps: [
      'Select Method: "Swatch Sample Weight" (physical test) or "Woven Construction" (yarn specifications).',
      'For Swatch: Enter swatch length, width in centimeters, and measured weight in grams.',
      'For Construction: Enter EPI (Ends per Inch), PPI (Picks per Inch), Warp count, Weft count, and yarn crimp percentage.',
      'View calculated GSM, category classification (Light/Medium/Heavy), and imperial oz/yd² weight.',
    ],
    faqs: [
      {
        question: 'What is a typical GSM range for cotton t-shirts and shirts?',
        answer: 'Lightweight summer t-shirts are typically 140-160 GSM, standard premium tees are 180-220 GSM, dress shirts range from 110-140 GSM, and denim typically ranges from 350-450 GSM (10-14 oz).',
      },
      {
        question: 'How do you convert GSM to oz/yd²?',
        answer: 'Divide GSM by 33.906 to get Ounces per Square Yard (oz/yd²). Alternatively, multiply oz/yd² by 33.906 to obtain GSM.',
      },
    ],
    relatedSlugs: ['pieces-to-weight-calculator', 'unit-converter', 'bom-cost-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 20. Pieces to Weight Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pieces-to-weight-calculator',
    title: 'Pieces to Weight & Counting Scale Calculator',
    shortTitle: 'Pieces to Weight',
    subtitle: 'Count bulk inventory units by weight or estimate total gross weight from quantity with tare deduction.',
    description: 'Calculate inventory item counts from bulk scale weight, or estimate total batch packaging weight from unit count. Features automatic tare weight container deduction and piece tolerance checking.',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing / ERP',
    keywords: ['pieces to weight calculator', 'counting scale calculator', 'weight to pieces', 'tare weight calculation', 'inventory weight counting'],
    icon: 'Scale',
    component: PcsWeightCalculator,
    seoTitle: 'Pieces to Weight Calculator - Bulk Counting & Tare Deduction',
    seoDescription: 'Convert bulk scale weight to exact piece counts and vice versa. Includes container tare weight deduction for hardware, fasteners, and packaging.',
    formulaLatex: 'Pieces = (Gross Weight - Container Tare) / Average Piece Weight',
    formulaDescription: 'Net Material Weight = Gross Weight - Container Tare Weight. Piece Count = Net Material Weight / Unit Piece Weight. Total Weight = Tare + (Piece Count × Unit Weight).',
    howToUseSteps: [
      'Select Mode: "Weight to Pieces" (count items on a scale) or "Pieces to Weight" (estimate dispatch weight).',
      'Enter known Average Piece Weight (APW) or sample weight for 10/100 pieces.',
      'Enter Gross measured weight and any container/pallet tare weight.',
      'Instantly view calculated piece count and net material weight.',
    ],
    faqs: [
      {
        question: 'Why is sample size important for piece counting?',
        answer: 'Weighing a batch of 10 or 50 sample units gives a far more accurate Average Piece Weight (APW) than weighing a single piece, minimizing minor manufacturing variance errors.',
      },
      {
        question: 'What is Tare Weight?',
        answer: 'Tare weight is the empty weight of the box, pallet, container, or drum holding the items. It must be subtracted from the gross weight to measure only net product weight.',
      },
    ],
    relatedSlugs: ['unit-converter', 'fabric-gsm-calculator', 'bom-cost-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 21. Multi-Unit Converter
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'unit-converter',
    title: 'Industrial & Regional Unit Converter (Length, Weight, Area, Volume)',
    shortTitle: 'Unit Converter',
    subtitle: 'Convert units across Metric, Imperial, and Indian regional measures including Gaj, Gunta, Acres, and Quintals.',
    description: 'A versatile engineering and commercial unit converter. Supports Length (m, ft, inch, yard), Weight (kg, g, lbs, quintal, metric ton), Area (sq ft, sq meter, Gaj, Gunta, Bigha, Acre), and Volume (liters, gallons, cubic meters).',
    category: 'manufacturing',
    categoryLabel: 'Manufacturing / ERP',
    keywords: ['unit converter', 'gaj to sq ft', 'gunta to acre', 'quintal to kg', 'metric to imperial conversion'],
    icon: 'RefreshCw',
    badge: 'Indian Units',
    component: UnitConverter,
    seoTitle: 'Industrial Unit Converter - Metric, Imperial & Indian Land Units',
    seoDescription: 'Convert length, weight, area, and volume online. Full support for Indian commercial units like Gaj, Gunta, Bigha, Quintal, and Metric Tons.',
    formulaLatex: 'Base Conversion: Input × (From Unit Factor) / (To Unit Factor)',
    formulaDescription: 'Calculations utilize double-precision conversion factors mapped to standard SI base units (meters, kilograms, square meters, liters) for exact multi-step conversions.',
    howToUseSteps: [
      'Select category: Length, Weight / Mass, Area / Land, or Volume.',
      'Enter the numerical value you want to convert.',
      'Select the source unit and destination target unit.',
      'View the converted result alongside common equivalent units.',
    ],
    faqs: [
      {
        question: 'How many Square Feet are in 1 Gaj?',
        answer: '1 Gaj (Square Yard) is equal to exactly 9 Square Feet (approx. 0.8361 Square Meters).',
      },
      {
        question: 'What is the relationship between Quintal, Metric Ton, and Kilograms?',
        answer: '1 Quintal = 100 Kilograms. 1 Metric Ton = 10 Quintals = 1,000 Kilograms.',
      },
    ],
    relatedSlugs: ['fabric-gsm-calculator', 'pieces-to-weight-calculator', 'bom-cost-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 22. Percentage Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator (4-in-1 Business Modes)',
    shortTitle: 'Percentage Calculator',
    subtitle: 'Compute percentage of numbers, percentage increases/decreases, percentage differences, and ratio fractions.',
    description: 'All-in-one percentage calculation suite for financial analysis and daily commerce. Calculate: What is X% of Y, What percentage is X of Y, Percentage Increase/Decrease from X to Y, and Reverse Percentage base.',
    category: 'utility',
    categoryLabel: 'Financial & Utility',
    keywords: ['percentage calculator', 'percent increase decrease', 'percentage of a number', 'percent difference', 'percentage formula'],
    icon: 'Percent',
    badge: 'Popular',
    component: PercentageCalculator,
    seoTitle: 'Percentage Calculator - Calculate Percent of Number & Percent Change',
    seoDescription: '4-in-1 percentage calculator for business. Calculate percentage of value, percentage increase/decrease, percentage difference, and reverse ratios.',
    formulaLatex: 'Change % = ((Final - Initial) / Initial) × 100',
    formulaDescription: 'Percent of: (X / 100) × Y. Percentage Ratio: (X / Y) × 100. Percentage Growth/Decline: ((New - Old) / Old) × 100.',
    howToUseSteps: [
      'Choose the percentage calculation mode matching your business question.',
      'Enter input values in the corresponding fields.',
      'View the exact percentage result with formatted rupee and step explanations.',
    ],
    faqs: [
      {
        question: 'How do you calculate percentage increase or growth rate?',
        answer: 'Subtract the original number from the new number, divide that difference by the original number, and multiply by 100.',
      },
      {
        question: 'What is the difference between percentage change and percentage point change?',
        answer: 'If an interest rate moves from 10% to 12%, that is a 2 percentage point increase, but a 20% relative percentage increase.',
      },
    ],
    relatedSlugs: ['discount-calculator', 'profit-margin-calculator', 'simple-interest-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 23. Loan EMI Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'loan-emi-calculator',
    title: 'Loan EMI Calculator & Amortization Schedule',
    shortTitle: 'Loan EMI Calculator',
    subtitle: 'Calculate Equated Monthly Installments (EMI), total interest payable, and yearly principal payoff schedule.',
    description: 'Compute monthly EMI for business machinery loans, commercial vehicle financing, personal loans, and mortgages. Displays total loan cost, principal-to-interest ratio, and year-by-year amortization balance.',
    category: 'utility',
    categoryLabel: 'Financial & Utility',
    keywords: ['emi calculator', 'loan emi calculator', 'amortization schedule', 'business loan emi', 'interest payable calculator'],
    icon: 'CreditCard',
    badge: 'Amortization',
    component: EmiCalculator,
    seoTitle: 'Loan EMI Calculator - Monthly Payments & Amortization Schedule',
    seoDescription: 'Calculate loan EMI, total interest, and total payment for business loans, car loans, and mortgages. Includes full yearly amortization table.',
    formulaLatex: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
    formulaDescription: 'P = Principal loan amount. r = Monthly interest rate (Annual Rate / 12 / 100). n = Loan duration in months. Total Payment = EMI × n. Total Interest = Total Payment - P.',
    howToUseSteps: [
      'Enter the loan Principal amount in rupees.',
      'Enter the annual interest rate (% p.a.).',
      'Select loan tenure in Years or Months.',
      'Review your Monthly EMI, Total Interest Payable, and review the year-by-year payoff table.',
    ],
    faqs: [
      {
        question: 'What is an EMI?',
        answer: 'An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month, comprising both principal repayment and interest.',
      },
      {
        question: 'Why is the interest component higher in the early years of a loan?',
        answer: 'Because interest is calculated on the remaining outstanding principal. As you pay off principal each month, future monthly interest charges decrease.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'simple-interest-calculator', 'break-even-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 24. Simple Interest Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator (Years, Months & Days)',
    shortTitle: 'Simple Interest',
    subtitle: 'Calculate linear interest and final maturity amounts for private loans, supplier credit, and fixed deposits.',
    description: 'Calculate simple interest earnings or debt costs quickly. Flexible time inputs in years, months, or days with instant rupee results and summary copy.',
    category: 'utility',
    categoryLabel: 'Financial & Utility',
    keywords: ['simple interest calculator', 'si calculator', 'pnr 100 formula', 'supplier credit interest', 'maturity amount calculator'],
    icon: 'Calculator',
    component: SimpleInterestCalculator,
    seoTitle: 'Simple Interest Calculator - Calculate SI & Maturity Online',
    seoDescription: 'Calculate simple interest and maturity value with customizable periods in years, months, or days. Free business interest tool.',
    formulaLatex: 'SI = (P × R × T) / 100 | Maturity = P + SI',
    formulaDescription: 'P = Principal Amount, R = Annual Rate of Interest in %, T = Time period in years (converted from months or days). Total Maturity Amount = Principal + Simple Interest.',
    howToUseSteps: [
      'Enter the principal amount invested or borrowed.',
      'Enter the annual interest rate percentage.',
      'Choose the time duration and select unit (Years, Months, or Days).',
      'View simple interest earned and final maturity value.',
    ],
    faqs: [
      {
        question: 'What is the key difference between Simple and Compound interest?',
        answer: 'Simple interest is calculated exclusively on the original principal amount. Compound interest is calculated on the principal plus all accumulated interest from prior compounding periods.',
      },
      {
        question: 'When is simple interest typically used in business?',
        answer: 'Simple interest is standard for short-term promissory notes, vendor late payment penalties, working capital overdrafts, and car loan flat rates.',
      },
    ],
    relatedSlugs: ['compound-interest-calculator', 'loan-emi-calculator', 'percentage-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 25. Compound Interest Calculator
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator (Annual, Monthly & Daily)',
    shortTitle: 'Compound Interest',
    subtitle: 'Calculate compound growth and future maturity value with customizable compounding frequency and annual schedule.',
    description: 'Calculate compound interest on corporate investments, fixed deposits (FD), mutual funds, and commercial loans. Supports Annually, Semi-Annually, Quarterly, Monthly, and Daily compounding with year-by-year wealth schedule.',
    category: 'utility',
    categoryLabel: 'Financial & Utility',
    keywords: ['compound interest calculator', 'ci calculator', 'future value calculator', 'monthly compounding', 'wealth growth calculator'],
    icon: 'TrendingUp',
    badge: 'Wealth & Growth',
    component: CompoundInterestCalculator,
    seoTitle: 'Compound Interest Calculator - Future Value & Growth Schedule',
    seoDescription: 'Calculate compound interest online with annual, quarterly, and monthly compounding. Discover your final maturity value and annual balance breakdown.',
    formulaLatex: 'A = P × (1 + r / n)^(n × t) | CI = A - P',
    formulaDescription: 'A = Final Maturity Amount. P = Principal Investment. r = Annual Interest Rate (decimal). n = Number of times compounded per year. t = Investment tenure in years. Compound Interest = A - P.',
    howToUseSteps: [
      'Enter your initial principal capital.',
      'Enter expected annual interest rate (% p.a.).',
      'Specify investment horizon in years.',
      'Select compounding frequency (Annually, Semi-Annually, Quarterly, Monthly, or Daily).',
      'Analyze the maturity value, total return percentage, and annual growth table.',
    ],
    faqs: [
      {
        question: 'How does compounding frequency impact returns?',
        answer: 'The more frequently interest compounds (e.g., monthly vs annually), the faster your balance grows, because earned interest begins earning additional interest sooner.',
      },
      {
        question: 'What is the Rule of 72?',
        answer: 'The Rule of 72 is a quick financial estimation shortcut: divide 72 by your annual interest rate to find approximately how many years it will take for your money to double.',
      },
    ],
    relatedSlugs: ['simple-interest-calculator', 'loan-emi-calculator', 'percentage-calculator'],
  },

  // ─────────────────────────────────────────────────────────────
  // 26. PDF to Word
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-word',
    title: 'PDF to Word Converter (.docx)',
    shortTitle: 'PDF to Word',
    subtitle: 'Convert PDF documents into fully editable Microsoft Word (.docx) documents with intact layout and typography.',
    description: 'Transform read-only PDF agreements, letters, and reports into editable Microsoft Word documents. Preserves tables, bullet points, font styles, and layout geometry.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc', 'editable word', 'pdf word converter'],
    icon: 'FileText',
    badge: 'Microservice',
    component: PdfToWordTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF to Word Converter - Free Document Conversion Online',
    seoDescription: 'Convert PDF files to editable Microsoft Word (.docx) format online with preserved layout and styling. Ready for microservice worker integration.',
    formulaLatex: 'PDF DOM AST Parser -> WordProcessingML OpenXML Transcoder',
    formulaDescription: 'Parses PDF content streams and layout bounding boxes into WordProcessingML XML document packages.',
    howToUseSteps: [
      'Drag and drop or select your PDF document.',
      'Review document size and page count.',
      'Connects to the CorpVEX Document Transcoder Microservice for conversion.',
      'Download your editable .docx Word document.',
    ],
    faqs: [
      {
        question: 'Can scanned image PDFs be converted to editable Word text?',
        answer: 'Scanned image PDFs require Optical Character Recognition (OCR) first. For scanned PDFs, run them through our PDF OCR tool to extract editable text layers.',
      },
      {
        question: 'Does this keep the original fonts and formatting?',
        answer: 'Yes, the conversion engine maps standard PostScript and TrueType font metrics directly into corresponding Word typography.',
      },
    ],
    relatedSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-text-extractor', 'pdf-merge'],
  },

  // ─────────────────────────────────────────────────────────────
  // 27. PDF to Excel
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-excel',
    title: 'PDF to Excel Converter (.xlsx)',
    shortTitle: 'PDF to Excel',
    subtitle: 'Extract accounting ledgers, bank statements, and structured tables from PDF into native Excel spreadsheets.',
    description: 'Extract tabular accounting data from bank e-statements, vendor bills, and financial statements into clean, formula-ready Microsoft Excel (.xlsx) workbooks.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf to excel', 'pdf to xlsx', 'extract table from pdf', 'bank statement to excel', 'pdf spreadsheet'],
    icon: 'FileText',
    badge: 'Microservice',
    component: PdfToExcelTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF to Excel Converter - Extract Tables & Bank Statements to XLSX',
    seoDescription: 'Convert PDF tables and bank statements to Excel (.xlsx) spreadsheets online. Perfect for accountants and audit reconciliation.',
    formulaLatex: 'Lattice & Stream Table Detection -> OpenPyXL Spreadsheet Packaging',
    formulaDescription: 'Uses rule-based cell bounding box detection (Lattice and Stream algorithms) to reconstruct table cells, rows, and columns without data corruption.',
    howToUseSteps: [
      'Upload the PDF containing tabular data or bank statements.',
      'The engine detects grid lines and column boundaries.',
      'Processes cells into structured worksheet rows.',
      'Download your clean Excel (.xlsx) spreadsheet.',
    ],
    faqs: [
      {
        question: 'How accurate is table extraction on scanned bank statements?',
        answer: 'Computer-generated bank PDFs achieve near 100% accuracy. For physical paper scans, OCR preprocessing is applied prior to table coordinate detection.',
      },
      {
        question: 'Will numbers be formatted as numbers or text in Excel?',
        answer: 'The extractor automatically parses currency symbols (₹, $), dates, and numbers so you can immediately perform SUM and mathematical formulas in Excel.',
      },
    ],
    relatedSlugs: ['excel-to-pdf', 'pdf-to-word', 'pdf-text-extractor', 'pdf-merge'],
  },

  // ─────────────────────────────────────────────────────────────
  // 28. Word to PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'word-to-pdf',
    title: 'Word to PDF Converter (.docx to .pdf)',
    shortTitle: 'Word to PDF',
    subtitle: 'Convert DOC and DOCX Word documents into professional, print-ready PDF files with embedded fonts.',
    description: 'Convert Microsoft Word files (.docx, .doc) into high-fidelity PDF documents. Locks formatting and margins across all devices, phones, and operating systems.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['word to pdf', 'docx to pdf', 'doc to pdf converter', 'save word as pdf', 'office to pdf'],
    icon: 'FileText',
    badge: 'Microservice',
    component: WordToPdfTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'Word to PDF Converter - Convert DOC & DOCX to PDF Online',
    seoDescription: 'Convert Word documents to professional PDF files online. Preserves font styles, tables, and page margins identically.',
    formulaLatex: 'OOXML Word DOM -> Cairo/HarfBuzz Layout Engine -> PDF 1.7 Stream',
    formulaDescription: 'Renders OpenXML formatting instructions into vector PDF objects with embedded font subsets for universal fidelity.',
    howToUseSteps: [
      'Select or drop your .docx or .doc file.',
      'Check file name and upload status.',
      'Converts via the headless document virtualization service.',
      'Download the secure, unalterable PDF document.',
    ],
    faqs: [
      {
        question: 'Why should I convert Word documents to PDF before sharing?',
        answer: 'Word documents can shift margins or lose fonts when opened on different computers. PDF locks the visual representation exactly as designed.',
      },
      {
        question: 'Are embedded images compressed during conversion?',
        answer: 'Images are preserved at high DPI suitable for commercial office printing.',
      },
    ],
    relatedSlugs: ['pdf-to-word', 'excel-to-pdf', 'pdf-merge', 'pdf-protect'],
  },

  // ─────────────────────────────────────────────────────────────
  // 29. Excel to PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'excel-to-pdf',
    title: 'Excel to PDF Converter (.xlsx to .pdf)',
    shortTitle: 'Excel to PDF',
    subtitle: 'Convert Microsoft Excel spreadsheets and workbooks into cleanly formatted, paginated PDF documents.',
    description: 'Turn wide financial reports, balance sheets, and inventory sheets from Excel (.xlsx, .xls) into properly scaled, professional PDF documents.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['excel to pdf', 'xlsx to pdf', 'xls to pdf converter', 'spreadsheet to pdf', 'print excel to pdf'],
    icon: 'FileText',
    badge: 'Microservice',
    component: ExcelToPdfTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'Excel to PDF Converter - Convert Spreadsheets to PDF Online',
    seoDescription: 'Convert Excel workbooks (.xlsx, .xls) into cleanly paginated PDF files online. Fit all columns to page cleanly.',
    formulaLatex: 'Spreadsheet Sheet Partitioning -> Page Fit Scaling -> Vector PDF Output',
    formulaDescription: 'Calculates cell grid column widths and page break rules to fit data gracefully on A4 / Letter pages.',
    howToUseSteps: [
      'Upload your Excel spreadsheet (.xlsx, .xls).',
      'The engine partitions sheets and column widths.',
      'Generates a standardized PDF output.',
      'Download the formatted PDF document.',
    ],
    faqs: [
      {
        question: 'Can wide Excel sheets fit on a single page width in PDF?',
        answer: 'Yes, the layout engine applies automatic column fit scaling so wide accounting tables do not get cut off across pages.',
      },
      {
        question: 'Are all worksheet tabs included in the PDF?',
        answer: 'Yes, all active sheets in the workbook are rendered sequentially with page numbers.',
      },
    ],
    relatedSlugs: ['pdf-to-excel', 'word-to-pdf', 'pdf-merge'],
  },

  // ─────────────────────────────────────────────────────────────
  // 30. PDF Merge
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-merge',
    title: 'PDF Merge - Combine Multiple PDF Files Online',
    shortTitle: 'PDF Merge',
    subtitle: 'Combine multiple PDF documents into a single organized file in any sequence you choose. 100% private browser processing.',
    description: 'Merge multiple PDF files into one clean document directly in your browser. Rearrange files with intuitive up/down ordering controls. Completely client-side with zero data transmission.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf merge', 'combine pdf', 'merge pdf files', 'join pdf documents', 'client side pdf merge'],
    icon: 'Combine',
    badge: 'Client-Side Pure',
    component: PdfMergeTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free PDF Merge Online - Combine Multiple PDF Files Privately',
    seoDescription: 'Merge and join multiple PDF files into one single document online. 100% private client-side processing with zero server uploads.',
    formulaLatex: 'Merged Document = Σ (CopyPages(Document_i, 0..N_i))',
    formulaDescription: 'Utilizes client-side ISO 32000-1 cross-reference table copying and object tree aggregation via pdf-lib in browser memory.',
    howToUseSteps: [
      'Drag and drop two or more PDF documents into the upload zone.',
      'Use the Up and Down arrow buttons to reorder files into your desired page order.',
      'Click "Merge All PDFs".',
      'Download your unified PDF document immediately.',
    ],
    faqs: [
      {
        question: 'Are my confidential business files uploaded to any server?',
        answer: 'No! The merge operation executes 100% locally inside your web browser using WebAssembly and memory streams. Your documents never leave your computer.',
      },
      {
        question: 'Is there a limit on how many PDF files I can merge?',
        answer: 'You can merge up to 25 files at once up to 80 MB total size without any slowdowns.',
      },
      {
        question: 'Will bookmarks and table of contents be preserved?',
        answer: 'Page content and orientation are preserved exactly. Merging creates a clean, continuous page sequence.',
      },
    ],
    relatedSlugs: ['pdf-split', 'pdf-rotate', 'pdf-page-extractor', 'images-to-pdf'],
  },

  // ─────────────────────────────────────────────────────────────
  // 31. PDF Split
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-split',
    title: 'PDF Split - Separate & Extract Pages Online',
    shortTitle: 'PDF Split',
    subtitle: 'Split a PDF into individual single-page documents or extract specific page ranges (e.g. 1-3, 5-8).',
    description: 'Divide large PDF files into smaller documents. Choose between splitting every page into its own individual file or extracting custom page ranges with instant client-side downloads.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf split', 'split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf'],
    icon: 'Split',
    badge: 'Client-Side Pure',
    component: PdfSplitTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free PDF Split Online - Separate Pages & Extract Custom Ranges',
    seoDescription: 'Split PDF documents online into individual pages or custom ranges. 100% private, client-side browser execution with zero uploads.',
    formulaLatex: 'Split_k = CopyPages(SourceDoc, Range_k)',
    formulaDescription: 'Extracts targeted object references and page dictionaries from the source PDF cross-reference table without re-compressing imagery.',
    howToUseSteps: [
      'Upload the PDF document you want to split.',
      'Select your split mode: "Split all pages" (1 file per page) or "Split by custom page ranges" (e.g., 1-2, 3-5).',
      'Click "Split PDF".',
      'Download the generated separate PDF files individually.',
    ],
    faqs: [
      {
        question: 'How do I specify multiple page ranges?',
        answer: 'Separate ranges with commas, for example: "1-3, 5, 7-10". Each range will be generated as a separate downloadable PDF file.',
      },
      {
        question: 'Does splitting a PDF reduce document quality?',
        answer: 'Not at all! Page content streams, vectors, and embedded images are copied losslessly without re-encoding.',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-page-extractor', 'pdf-rotate'],
  },

  // ─────────────────────────────────────────────────────────────
  // 32. PDF Compress
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-compress',
    title: 'PDF Compress & Size Reducer',
    shortTitle: 'PDF Compress',
    subtitle: 'Reduce PDF file size without sacrificing readability using advanced raster image downsampling and font subsetting.',
    description: 'Compress heavy PDF invoices, presentations, and contracts down to lightweight files suitable for email attachments, MCA filings, and government portals.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf compress', 'reduce pdf size', 'compress pdf online', 'shrink pdf', 'pdf optimizer'],
    icon: 'FileText',
    badge: 'Microservice',
    component: PdfCompressTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Compress - Reduce PDF File Size Online for Email & Portals',
    seoDescription: 'Compress PDF documents online while preserving text sharpness. Optimize documents for email attachments and portal uploads.',
    formulaLatex: 'DCT / Flate Stream Re-compression + Font Subset De-duplication',
    formulaDescription: 'Applies DCT discrete cosine transform quantization to embedded bitmaps and strips unreferenced metadata streams.',
    howToUseSteps: [
      'Upload the heavy PDF document.',
      'Review original file size.',
      'Connects to the CorpVEX Stream Optimizer Microservice to compress raster streams.',
      'Download the optimized, lightweight PDF.',
    ],
    faqs: [
      {
        question: 'Will text become blurry after compression?',
        answer: 'No. Vector text and fonts are preserved losslessly. Compression specifically targets high-resolution photographic bitmaps and uncompressed stream overhead.',
      },
      {
        question: 'What is the typical compression ratio?',
        answer: 'Scanned image PDFs typically shrink by 50% to 80%, while digital text PDFs typically compress by 20% to 40%.',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-split', 'pdf-protect'],
  },

  // ─────────────────────────────────────────────────────────────
  // 33. PDF Rotate
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-rotate',
    title: 'PDF Rotate - Rotate Pages 90°, 180°, 270° Clockwise',
    shortTitle: 'PDF Rotate',
    subtitle: 'Permanently rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees. 100% private browser processing.',
    description: 'Fix improperly oriented document scans in seconds. Rotate all pages or target only odd or even pages clockwise. Permanent vector orientation changes without quality loss.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf rotate', 'rotate pdf pages', 'turn pdf clockwise', 'fix upside down pdf', 'pdf orientation'],
    icon: 'RotateCw',
    badge: 'Client-Side Pure',
    component: PdfRotateTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free PDF Rotate Online - Rotate PDF Pages 90, 180, 270 Degrees',
    seoDescription: 'Permanently rotate PDF pages clockwise online. Choose all pages, odd pages, or even pages. 100% private client-side processing.',
    formulaLatex: 'PageRotationAngle = (CurrentAngle + DeltaAngle) mod 360',
    formulaDescription: 'Updates the /Rotate attribute in the PDF Page dictionary without recalculating or rasterizing page contents.',
    howToUseSteps: [
      'Upload your PDF file.',
      'Select rotation angle (+90°, +180°, or +270°).',
      'Optionally target All Pages, Odd Pages only, or Even Pages only.',
      'Click "Rotate PDF" and download your corrected document.',
    ],
    faqs: [
      {
        question: 'Is the rotation permanent when I open the PDF on another computer?',
        answer: 'Yes! The rotation angle is written directly into the PDF specification header, ensuring it renders upright on all PDF viewers and printers.',
      },
      {
        question: 'Can I rotate just one upside-down page?',
        answer: 'You can extract that page using the PDF Page Extractor tool, rotate it, and merge it back using PDF Merge.',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-split', 'pdf-page-extractor'],
  },

  // ─────────────────────────────────────────────────────────────
  // 34. PDF Unlock
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-unlock',
    title: 'PDF Unlock - Remove Permissions & Print Locks',
    shortTitle: 'PDF Unlock',
    subtitle: 'Remove owner restrictions and print permissions passwords from authorized PDF files.',
    description: 'Eliminate printing, copying, and editing restrictions on secured PDF documents. Restore full access to your business documents.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf unlock', 'remove pdf password', 'unlock secured pdf', 'decrypt pdf permissions'],
    icon: 'Unlock',
    badge: 'Microservice',
    component: PdfUnlockTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Unlock - Remove Permissions & Passwords Online',
    seoDescription: 'Remove owner restrictions and print security locks from authorized PDF files online. Fast, secure document unlocking.',
    formulaLatex: 'Standard Security Handler Decryption -> Unencrypted Cross-Reference Stream',
    formulaDescription: 'Parses the PDF /Encrypt dictionary and rewrites document object streams without restriction flags.',
    howToUseSteps: [
      'Upload the restricted PDF file.',
      'Provide authorization credentials if prompt appears.',
      'Processes via the CorpVEX Decryption Microservice.',
      'Download your fully accessible, uninhibited PDF.',
    ],
    faqs: [
      {
        question: 'Can this unlock user-encrypted passwords that prevent opening the file?',
        answer: 'If a PDF requires a password to open, the authorized open password must be provided to decrypt the encryption key.',
      },
      {
        question: 'Is this legal for business documents?',
        answer: 'Yes, provided you are the authorized owner or recipient of the document authorized to access its contents.',
      },
    ],
    relatedSlugs: ['pdf-protect', 'pdf-merge', 'pdf-split'],
  },

  // ─────────────────────────────────────────────────────────────
  // 35. PDF Protect
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-protect',
    title: 'PDF Protect - Password & 256-Bit AES Encryption',
    shortTitle: 'PDF Protect',
    subtitle: 'Secure sensitive commercial agreements and payroll documents with enterprise-grade 256-bit AES encryption.',
    description: 'Add military-grade password protection and encryption to PDF documents. Restrict unauthorized viewing, printing, and copying.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf protect', 'encrypt pdf', 'password protect pdf', 'aes 256 pdf encryption', 'secure pdf'],
    icon: 'Lock',
    badge: 'Microservice',
    component: PdfProtectTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Protect - Password Protect & Encrypt PDF Online',
    seoDescription: 'Encrypt sensitive business contracts and invoices with 256-bit AES encryption online. Prevent unauthorized access and printing.',
    formulaLatex: 'AES-256-CBC Cipher + PBKDF2 Key Derivation -> /Encrypt Dictionary',
    formulaDescription: 'Generates ISO 32000-2 compliant 256-bit AES cipher encryption with distinct owner and user cryptographic keys.',
    howToUseSteps: [
      'Upload the PDF document you want to secure.',
      'Set an open password and optional permissions restrictions.',
      'Processes through the CorpVEX Security Cipher Microservice.',
      'Download your encrypted, tamper-resistant PDF.',
    ],
    faqs: [
      {
        question: 'How secure is 256-bit AES encryption for PDFs?',
        answer: '256-bit AES is the global gold standard for bank-grade and government classified security. It cannot be brute-forced with modern computing.',
      },
      {
        question: 'Will recipients need special software to open the protected PDF?',
        answer: 'No. Any standard browser (Chrome, Edge, Safari) or PDF viewer (Adobe Acrobat) will prompt for the password natively.',
      },
    ],
    relatedSlugs: ['pdf-unlock', 'pdf-sign', 'pdf-watermark'],
  },

  // ─────────────────────────────────────────────────────────────
  // 36. Images to PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'images-to-pdf',
    title: 'Images to PDF Converter (PNG, JPG, JPEG)',
    shortTitle: 'Images to PDF',
    subtitle: 'Convert PNG, JPG, and JPEG images into a single paginated PDF document. Reorder images with drag-and-drop ease.',
    description: 'Convert multiple image files into a single, clean PDF document. Reorder pages using up/down arrow buttons. Runs 100% client-side in your browser for absolute confidentiality.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['images to pdf', 'convert pictures to pdf', 'photos to pdf', 'png to pdf', 'multi image pdf'],
    icon: 'Image',
    badge: 'Client-Side Pure',
    component: ImagesToPdfTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Images to PDF Converter Online - Turn Pictures & PNGs into PDF',
    seoDescription: 'Convert PNG, JPG, and JPEG images to a single PDF document online. Client-side browser processing with drag-and-drop page ordering.',
    formulaLatex: 'PDFPage_i = DrawImage(Embed(Image_i), width, height)',
    formulaDescription: 'Directly embeds image binary streams into PDF /XObject dictionaries without downsampling loss.',
    howToUseSteps: [
      'Upload one or more JPG, JPEG, or PNG images.',
      'Arrange the images in your desired page order using the Up and Down buttons.',
      'Click "Convert Images to PDF".',
      'Download the compiled, multi-page PDF document immediately.',
    ],
    faqs: [
      {
        question: 'Can I mix both PNG and JPG images in the same PDF?',
        answer: 'Yes! Our client-side engine embeds both JPEG and PNG image formats interchangeably.',
      },
      {
        question: 'Does this resize my photos or blur text?',
        answer: 'No, each image is embedded at its native full pixel resolution into an identically sized PDF page.',
      },
    ],
    relatedSlugs: ['jpg-to-pdf', 'pdf-merge', 'pdf-rotate'],
  },

  // ─────────────────────────────────────────────────────────────
  // 37. PDF to JPG
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-to-jpg',
    title: 'PDF to JPG Image Converter',
    shortTitle: 'PDF to JPG',
    subtitle: 'Render every page of your PDF document into high-resolution JPG images suitable for web publishing and presentations.',
    description: 'Convert PDF pages into standalone high-quality JPG image files. Perfect for embedding catalog pages, marketing leaflets, and receipts into presentations and web pages.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf to jpg', 'convert pdf to image', 'pdf to picture', 'render pdf pages as jpg'],
    icon: 'Image',
    badge: 'Microservice',
    component: PdfToJpgTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF to JPG Converter - Render PDF Pages as Images Online',
    seoDescription: 'Convert PDF pages to high-resolution JPG pictures online. Crisp rendering of fonts, vectors, and layouts.',
    formulaLatex: 'PDF Vector Rasterizer -> 300-DPI JPEG Image Stream',
    formulaDescription: 'Renders vector paths, TrueType fonts, and bitmap layers at 300 DPI into standard baseline JPEG files.',
    howToUseSteps: [
      'Select or drop your PDF file.',
      'Review document page count.',
      'Connects to the CorpVEX Raster Microservice to render high-DPI pages.',
      'Download your generated JPG images.',
    ],
    faqs: [
      {
        question: 'What image resolution (DPI) are the converted JPGs?',
        answer: 'Pages are rendered at 300 DPI for high-definition print and digital clarity.',
      },
      {
        question: 'Can I convert a multi-page PDF into images?',
        answer: 'Yes, multi-page PDFs are rendered page-by-page into individual numbered JPG image files.',
      },
    ],
    relatedSlugs: ['jpg-to-pdf', 'images-to-pdf', 'pdf-to-word'],
  },

  // ─────────────────────────────────────────────────────────────
  // 38. JPG to PDF
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'jpg-to-pdf',
    title: 'JPG to PDF Converter Online',
    shortTitle: 'JPG to PDF',
    subtitle: 'Fast client-side converter to combine JPG photos, receipts, or document scans into a high-resolution PDF.',
    description: 'Convert your JPG/JPEG photos, document scans, and bill receipts into an organized PDF. Reorder pages with one click. 100% private, client-side browser processing.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['jpg to pdf', 'jpeg to pdf', 'convert jpg to pdf', 'photo to pdf document', 'scanned jpg to pdf'],
    icon: 'Image',
    badge: 'Client-Side Pure',
    component: JpgToPdfTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free JPG to PDF Converter Online - Convert JPEG Photos to PDF',
    seoDescription: 'Convert JPG images and photo scans into high-quality PDF files online. Instant, private client-side browser conversion with zero server uploads.',
    formulaLatex: 'PDF Image Wrapper -> DCTDecode JPEG Stream',
    formulaDescription: 'Wraps raw JPEG bytes into standard PDF /Filter /DCTDecode objects without re-compressing or degrading photo pixels.',
    howToUseSteps: [
      'Upload one or more JPG or JPEG photos.',
      'Review file order and rearrange using up/down buttons.',
      'Click "Convert JPG to PDF".',
      'Download your unified PDF immediately.',
    ],
    faqs: [
      {
        question: 'Can I upload photos taken with a smartphone camera?',
        answer: 'Yes! Any standard JPG or JPEG photo taken from an iPhone or Android phone converts cleanly into a multi-page PDF.',
      },
      {
        question: 'Are my personal pictures sent to any third-party server?',
        answer: 'No! All processing occurs inside your web browser. Your images never leave your local device.',
      },
    ],
    relatedSlugs: ['images-to-pdf', 'pdf-to-jpg', 'pdf-merge'],
  },

  // ─────────────────────────────────────────────────────────────
  // 39. PDF Page Extractor
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-page-extractor',
    title: 'PDF Page Extractor - Select & Save Specific Pages',
    shortTitle: 'Page Extractor',
    subtitle: 'Extract specific pages from your PDF into a brand-new concise PDF file with zero server uploads.',
    description: 'Select and save only the pages you need from a large PDF document. Enter individual page numbers or ranges (e.g. 1, 3, 5-8) to generate an instant streamlined PDF.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf page extractor', 'extract pages from pdf', 'save specific pages pdf', 'filter pdf pages'],
    icon: 'Split',
    badge: 'Client-Side Pure',
    component: PdfPageExtractorTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free PDF Page Extractor Online - Extract Custom Pages from PDF',
    seoDescription: 'Extract specific pages or page ranges from any PDF into a single compact document online. 100% private browser processing.',
    formulaLatex: 'ExtractedDoc = CopyPages(SourceDoc, PageList)',
    formulaDescription: 'Selectively copies specific page dictionary nodes from the source page tree into a clean new document tree.',
    howToUseSteps: [
      'Upload your PDF document.',
      'Enter the specific page numbers or ranges you want to extract (e.g., "1, 3, 5-7").',
      'Click "Extract Selected Pages".',
      'Download your new streamlined PDF immediately.',
    ],
    faqs: [
      {
        question: 'Can I extract non-consecutive pages (e.g. page 1 and page 5)?',
        answer: 'Yes! Simply enter comma-separated numbers like "1, 5, 8". The resulting PDF will contain only those selected pages.',
      },
      {
        question: 'Does extracting pages modify the original PDF on my computer?',
        answer: 'No, your original file remains untouched. A new PDF containing only the selected pages is generated for download.',
      },
    ],
    relatedSlugs: ['pdf-split', 'pdf-merge', 'pdf-rotate'],
  },

  // ─────────────────────────────────────────────────────────────
  // 40. PDF Watermark
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-watermark',
    title: 'PDF Watermark Tool (Text & Stamp)',
    shortTitle: 'PDF Watermark',
    subtitle: 'Apply custom text stamps (Confidential, Draft, Approved) or company logo watermarks diagonally across all pages.',
    description: 'Protect confidential intellectual property, draft proposals, and internal accounting records by branding them with customizable diagonal text or logo watermarks.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf watermark', 'add watermark to pdf', 'stamp pdf', 'confidential watermark', 'diagonal pdf stamp'],
    icon: 'FileText',
    badge: 'Microservice',
    component: PdfWatermarkTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Watermark - Add Text & Logo Stamps to PDF Online',
    seoDescription: 'Apply custom diagonal text watermarks and company stamps across PDF pages online. Protect confidential documents.',
    formulaLatex: 'Alpha Transparency Layer + 45° Affine Matrix Transformation',
    formulaDescription: 'Renders semi-transparent vector text using affine rotation transformation matrices overlaid on the page content stream.',
    howToUseSteps: [
      'Upload your PDF document.',
      'Specify watermark text (e.g. "CONFIDENTIAL" or "DRAFT").',
      'Connects to the CorpVEX Stamping Microservice.',
      'Download your watermarked PDF document.',
    ],
    faqs: [
      {
        question: 'Can the watermark be placed behind or in front of the text?',
        answer: 'Watermarks can be configured as a background underlay or a semi-transparent foreground overlay.',
      },
      {
        question: 'Can someone easily remove a watermark from a PDF?',
        answer: 'Once rendered into the page content stream, removing watermarks requires specialized vector editing tools.',
      },
    ],
    relatedSlugs: ['pdf-protect', 'pdf-sign', 'pdf-number-pages'],
  },

  // ─────────────────────────────────────────────────────────────
  // 41. PDF Metadata Remover
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-metadata-remover',
    title: 'PDF Metadata Remover & Sanitizer',
    shortTitle: 'Metadata Remover',
    subtitle: 'Sanitize sensitive PDF metadata including author names, editing software, creation timestamps, and hidden history.',
    description: 'Protect business privacy before sharing legal documents or bids. Strips author name, company affiliation, editing software, camera details, and creation timestamps directly in your browser.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf metadata remover', 'sanitize pdf', 'clean pdf metadata', 'remove author from pdf', 'pdf privacy tool'],
    icon: 'FileText',
    badge: 'Client-Side Pure',
    component: PdfMetadataRemoverTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free PDF Metadata Remover Online - Strip Author & Hidden Data',
    seoDescription: 'Clean and sanitize sensitive metadata from PDF files online. Remove author names, creation dates, and software stamps with 100% browser privacy.',
    formulaLatex: 'Sanitize: InfoDictionary[Title, Author, Subject, Creator, Producer] = null',
    formulaDescription: 'Locates the document /Info dictionary and XMP metadata stream, replacing all personal attribution tags with sanitized null values.',
    howToUseSteps: [
      'Upload the PDF document you wish to sanitize.',
      'Click "Remove All Metadata".',
      'The browser engine cleans author names, producer tags, and creation dates.',
      'Download your privacy-safe, sanitized PDF file.',
    ],
    faqs: [
      {
        question: 'What metadata is typically hidden inside a PDF document?',
        answer: 'PDFs often contain the author username, exact operating system, computer name, editing software, GPS coordinates (if from a mobile scan), and revision history.',
      },
      {
        question: 'Does metadata removal change the visual appearance of the document?',
        answer: 'No! The visual pages, text, images, and layout remain completely identical; only the invisible background identity tags are stripped.',
      },
    ],
    relatedSlugs: ['pdf-protect', 'pdf-merge', 'pdf-number-pages'],
  },

  // ─────────────────────────────────────────────────────────────
  // 42. PDF Number Pages
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-number-pages',
    title: 'PDF Number Pages - Header & Footer Pagination',
    shortTitle: 'Number Pages',
    subtitle: 'Insert clean, standardized page numbers into the header or footer of every page in your PDF document.',
    description: 'Add professional page numbering to legal briefs, corporate reports, and multi-page invoices. Choose position (Bottom Center, Bottom Right, Top Right) and numbering format ("Page X of Y", "Page X", or numbers only).',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf number pages', 'add page numbers to pdf', 'pdf pagination', 'page numbering tool', 'bates numbering'],
    icon: 'FileText',
    badge: 'Client-Side Pure',
    component: PdfNumberPagesTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Add Page Numbers to PDF Online - Header & Footer Pagination Tool',
    seoDescription: 'Add page numbers to PDF documents online. Select header/footer positions and format ("Page X of Y"). 100% private client-side browser processing.',
    formulaLatex: 'PageNumberLabel = Format(Index + StartNumber, TotalPages)',
    formulaDescription: 'Calculates page boundary dimensions and draws text elements using embedded standard Helvetica font metrics.',
    howToUseSteps: [
      'Upload the PDF document.',
      'Select numbering position: Bottom Center (Footer), Bottom Right (Footer), or Top Right (Header).',
      'Choose numbering format (e.g. "Page X of Y", "Page X", or "1").',
      'Click "Apply Page Numbers" and download your paginated PDF.',
    ],
    faqs: [
      {
        question: 'Can I start numbering from a number other than 1?',
        answer: 'Yes! You can specify any starting number (e.g., start at page 15 for an appendix).',
      },
      {
        question: 'Will page numbers overlap existing page content?',
        answer: 'Page numbers are drawn within standard 20pt margin boundaries. For tight margins, you can toggle between bottom and top positions.',
      },
    ],
    relatedSlugs: ['pdf-merge', 'pdf-watermark', 'pdf-page-extractor'],
  },

  // ─────────────────────────────────────────────────────────────
  // 43. PDF Sign
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-sign',
    title: 'PDF Sign & Digital Signature Stamp',
    shortTitle: 'PDF Sign',
    subtitle: 'Place cryptographic PKI digital signatures or drawn signature stamps onto agreements, purchase orders, and invoices.',
    description: 'Sign commercial contracts, NDAs, and purchase orders electronically. Secure documents with visual signature stamps or cryptographic DSC token verification.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf sign', 'sign pdf online', 'digital signature pdf', 'dsc token pdf', 'pki signature'],
    icon: 'PenTool',
    badge: 'Microservice',
    component: PdfSignTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Sign - Digital Signature & Electronic Signatures Online',
    seoDescription: 'Sign PDF contracts and invoices electronically online. Cryptographic X.509 PKI signing and visual signature stamps.',
    formulaLatex: 'SHA-256 Digest + RSA / ECDSA Private Key Encryption -> /ByteRange Signature',
    formulaDescription: 'Computes cryptographic SHA-256 message digests over document byte ranges and embeds X.509 certificates.',
    howToUseSteps: [
      'Upload the PDF contract or invoice to be signed.',
      'Choose signature method (Cryptographic DSC Token or Visual Signature).',
      'Processes via the CorpVEX Digital Signature Service.',
      'Download your legally validated, signed PDF document.',
    ],
    faqs: [
      {
        question: 'Are digital signatures on PDFs legally valid in India?',
        answer: 'Yes, digital signatures backed by Class-3 Digital Signature Certificates (DSC) are recognized under the Information Technology Act, 2000.',
      },
      {
        question: 'What is the difference between an electronic signature and a digital signature?',
        answer: 'An electronic signature is a visual representation of a handwritten signature. A digital signature uses cryptographic encryption to prove the document has not been tampered with.',
      },
    ],
    relatedSlugs: ['pdf-protect', 'pdf-watermark', 'pdf-merge'],
  },

  // ─────────────────────────────────────────────────────────────
  // 44. PDF Text Extractor
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-text-extractor',
    title: 'PDF Text Extractor - Extract Plain Text from PDF',
    shortTitle: 'Text Extractor',
    subtitle: 'Extract raw ASCII and Unicode text strings and paragraphs from searchable PDF documents without loading images.',
    description: 'Extract text paragraphs, raw numbers, and strings from PDF documents into clean, copyable plain text for analysis, search indexing, or archiving.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf text extractor', 'extract text from pdf', 'pdf to txt', 'copy text from pdf', 'pdf text parser'],
    icon: 'FileText',
    badge: 'Microservice',
    component: PdfTextExtractorTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF Text Extractor - Extract Plain Text from PDF Files Online',
    seoDescription: 'Extract raw plain text and paragraphs from PDF documents online into copyable text format. Quick and clean text parsing.',
    formulaLatex: 'PDF Text Matrix Decoding -> UTF-8 Character Normalization',
    formulaDescription: 'Parses font encoding tables (ToUnicode CMaps) and positional text matrices into clean UTF-8 text strings.',
    howToUseSteps: [
      'Upload your searchable PDF document.',
      'The engine reads text object streams across all pages.',
      'Processes via the CorpVEX Text Parser Microservice.',
      'Download or copy your extracted plain text.',
    ],
    faqs: [
      {
        question: 'Can this tool extract text from scanned images without a text layer?',
        answer: 'No. For image-only scans or receipts, please use our PDF OCR tool which uses optical character recognition.',
      },
      {
        question: 'Does this tool preserve paragraph line breaks?',
        answer: 'Yes, vertical coordinate offsets are analyzed to preserve logical paragraph and sentence breaks.',
      },
    ],
    relatedSlugs: ['pdf-ocr', 'pdf-to-word', 'pdf-to-excel'],
  },

  // ─────────────────────────────────────────────────────────────
  // 45. PDF OCR
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'pdf-ocr',
    title: 'PDF OCR (Optical Character Recognition)',
    shortTitle: 'PDF OCR',
    subtitle: 'Convert scanned image-only PDFs and physical receipts into fully searchable, selectable text documents.',
    description: 'Transform non-searchable scanned PDFs and photographed documents into searchable PDF/A files. Employs neural optical character recognition supporting English and Indian languages.',
    category: 'pdf',
    categoryLabel: 'PDF Tools',
    keywords: ['pdf ocr', 'optical character recognition', 'searchable pdf', 'scanned pdf to text', 'ocr converter'],
    icon: 'Search',
    badge: 'Microservice',
    component: PdfOcrTool,
    processingType: 'backend',
    status: 'backend_required',
    seoTitle: 'PDF OCR - Convert Scanned PDFs to Searchable Documents Online',
    seoDescription: 'Convert scanned image PDFs into searchable, selectable PDF/A documents online using neural optical character recognition.',
    formulaLatex: 'Binarization -> Neural LSTM Character Classification -> PDF/A Text Layer',
    formulaDescription: 'Applies image deskewing, binarization, and deep learning LSTM models to recognize glyphs and inject invisible selectable text layers.',
    howToUseSteps: [
      'Upload your scanned PDF document.',
      'Select OCR language model.',
      'Processes through the CorpVEX Neural OCR Microservice.',
      'Download your searchable, selectable PDF document.',
    ],
    faqs: [
      {
        question: 'What is a searchable PDF?',
        answer: 'A searchable PDF looks identical to your original scan, but contains an invisible layer of text beneath the image so you can select, copy, and search words with Ctrl+F.',
      },
      {
        question: 'Does OCR support Indian languages?',
        answer: 'Yes, the engine supports English, Hindi, and Gujarati character sets.',
      },
    ],
    relatedSlugs: ['pdf-text-extractor', 'pdf-to-word', 'pdf-to-excel'],
  },
  // ─────────────────────────────────────────────────────────────
  // HR & Payroll Tools
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'salary-slip-generator',
    title: 'Salary Slip Generator (Payslip Maker & PDF Print)',
    shortTitle: 'Salary Slip Generator',
    subtitle: 'Generate professional, customizable monthly employee salary slips with itemized allowances, deductions, and print/PDF export.',
    description: 'Create professional monthly employee payslips with company branding, employee info, itemized earnings and deductions, automatic Gross and Net calculation, and Indian Rupee words. Ready for instant A4 printing and PDF saving.',
    category: 'payroll',
    categoryLabel: 'HR & Payroll',
    keywords: [
      'salary slip generator',
      'payslip maker',
      'salary slip format',
      'employee payslip pdf',
      'salary voucher',
      'monthly salary slip',
      'free salary slip maker',
      'net pay calculator',
      'earnings and deductions',
    ],
    icon: 'Wallet',
    badge: 'A4 Printable',
    component: SalarySlipGenerator,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Salary Slip Generator - Create & Download Employee Payslips Online',
    seoDescription: 'Generate professional employee salary slips online. Add company branding, custom earnings, deductions, auto-calculated net pay in words, and export/print to A4 PDF.',
    formulaLatex: '\\text{Net Salary} = \\sum \\text{Earnings} - \\sum \\text{Deductions}',
    formulaDescription: 'Gross Salary is the sum of all allowance items (Basic, HRA, DA, etc.). Total Deductions is the sum of all deduction items (PF, PT, TDS, Insurance, etc.). Net Salary = Gross Salary - Total Deductions.',
    howToUseSteps: [
      'Enter your Company Details (name, address, optional GSTIN, and company logo).',
      'Fill in the Employee Details (name, ID, designation, department, pay period, and bank/PAN info).',
      'Customize Earnings items (Basic, HRA, allowances) and Deduction items (PF, PT, TDS, etc.).',
      'Review the live summary cards for Gross Salary, Total Deductions, and Net Salary Payable.',
      'Click "Switch to Payslip Preview" or "Print / Save as PDF" to generate clean A4 payslips (single copy or duplicate copy).',
    ],
    faqs: [
      {
        question: 'Is any employee salary data sent to your servers?',
        answer: 'No. All salary calculations, logo uploads, and PDF print previews are performed 100% locally in your browser. No employee names, PAN numbers, bank accounts, or financial figures are transmitted or stored.',
      },
      {
        question: 'Does this tool automatically compute statutory PF, PT, or TDS rates?',
        answer: 'No. Because statutory compliance rules vary widely by state, employee tax regime, and company thresholds, you enter your actual deduction figures. The tool guarantees mathematical consistency (Gross - Deductions = Net Pay) without making assumptions about statutory slabs.',
      },
      {
        question: 'Can I print duplicate copies on a single page for employee and employer records?',
        answer: 'Yes. You can select the "2 Copies (Employee + Employer Copy)" layout option to print both on a single A4 page separated by a tear-off divider line.',
      },
      {
        question: 'How do I download the generated salary slip as a PDF?',
        answer: 'Click the "Print / Save as PDF" button. In your browser print dialog, select "Save as PDF" as the Destination and ensure the paper size is set to A4.',
      },
    ],
    relatedSlugs: ['amount-to-words', 'tds-calculator', 'invoice-total-calculator'],
  },
  // ─────────────────────────────────────────────────────────────
  // Free Sales Analysis Dashboard (Analytics & Insights)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'free-sales-analysis-dashboard',
    title: 'Free Sales Analysis Dashboard (Excel & CSV)',
    shortTitle: 'Sales Dashboard',
    subtitle: 'Upload any sales spreadsheet to instantly visualize revenue trends, Indian FY performance, and customer RFM segmentation.',
    description: 'Analyze Excel and CSV sales ledgers directly in your browser. Get instant Indian Financial Year (April-March) summaries, chronological monthly seasonality, product breakdowns, customer RFM tiers, and data hygiene audits with zero server uploads.',
    category: 'analytics',
    categoryLabel: 'Analytics & Insights',
    keywords: [
      'sales dashboard',
      'sales analysis',
      'excel sales dashboard',
      'csv sales analytics',
      'financial year sales',
      'indian fy revenue',
      'rfm analysis',
      'customer segmentation',
      'monthly sales trends',
      'sales bi tool'
    ],
    icon: 'TrendingUp',
    badge: 'Interactive BI',
    component: FreeSalesAnalysisDashboard,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Sales Analysis Dashboard - Analyze Excel & CSV Sales Online',
    seoDescription: 'Turn your raw sales spreadsheet (CSV or Excel) into interactive revenue charts, Indian FY growth summaries, monthly seasonality trends, and RFM customer segmentation. 100% browser-based & private.',
    formulaLatex: '\\text{YoY Growth \\%} = \\frac{\\text{Revenue}_{\\text{Current FY}} - \\text{Revenue}_{\\text{Previous FY}}}{\\text{Revenue}_{\\text{Previous FY}}} \\times 100',
    formulaDescription: 'Total Revenue is the sum of invoice row amounts. Distinct Orders counts unique invoice IDs (or row counts if no invoice column mapped). Average Order Value (AOV) = Total Revenue / Distinct Invoices. Customer RFM Score combines Monetary value (45%), Order Frequency (35%), and Recency (20%) normalized on a 1-5 scale.',
    howToUseSteps: [
      'Upload your sales spreadsheet in .csv, .xlsx, or .xls format (drag & drop or browse).',
      'If using a multi-sheet Excel file, select the specific worksheet containing your sales data.',
      'Verify or adjust the smart column mappings (Required: Date, Customer, Amount; Optional: Invoice No, Product, Salesperson, etc.).',
      'Click "Analyze Sales Data" to generate instant KPIs, data hygiene audit checks, and interactive charts.',
      'Explore Financial Year (Apr-Mar) summaries, monthly seasonality, customer RFM tiers, and export filtered reports as CSV.',
    ],
    faqs: [
      {
        question: 'Are my sales spreadsheets uploaded to CorpVEX servers?',
        answer: 'No. 100% of the parsing, hygiene auditing, calculations, and chart visualizations happen entirely in your browser using client-side JavaScript. None of your business data, customer names, or invoice figures ever leave your device.',
      },
      {
        question: 'What column names should my Excel or CSV file have?',
        answer: 'Our auto-detection engine automatically recognizes standard headers like Date, Customer Name, Net Amount, Invoice No, Product, and Salesperson. If your headers differ, you can easily map them manually using the dropdown selectors before analysis.',
      },
      {
        question: 'How does the Indian Financial Year (FY) calculation work?',
        answer: 'The tool uses the Indian fiscal calendar running from April 1 to March 31. For example, a transaction on 15 May 2024 is grouped under FY 2024-25, whereas 10 February 2025 is also FY 2024-25. Monthly trends are plotted chronologically from April through March.',
      },
      {
        question: 'What is Customer RFM Segmentation?',
        answer: 'RFM analyzes customer purchasing behavior across Recency (how recently they bought), Frequency (how often they buy), and Monetary value (total spend). The tool scores each customer to categorize them into VIP, Regular, At-Risk, or New buyer tiers.',
      },
      {
        question: 'Can I export the calculated analytics and customer reports?',
        answer: 'Yes. You can export the filtered KPI summary, the customer RFM classification table, or the Financial Year performance breakdown directly as clean CSV spreadsheets with a single click.',
      },
    ],
    relatedSlugs: ['gst-billing-and-invoicing', 'invoice-total-calculator', 'profit-margin-calculator'],
  },
  // ─────────────────────────────────────────────────────────────
  // Product Label Design Tool (Barcode & QR)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'product-label-generator',
    title: 'Product Label Design Tool',
    shortTitle: 'Product Label Designer',
    subtitle: 'Design printable custom product stickers and labels with barcodes, prices, MRP, and logos directly in your browser.',
    description: 'Create custom product label stickers online with product details, prices, barcodes and custom layouts. Download PNG or PDF and print directly.',
    category: 'barcode',
    categoryLabel: 'Barcode & QR',
    keywords: [
      'product label designer',
      'product label maker',
      'barcode sticker designer',
      'mrp sticker generator',
      'price tag maker',
      'retail label design',
      'custom sticker print'
    ],
    icon: 'Tag',
    badge: 'New',
    component: ProductLabelDesignTool,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Product Label Design Tool | Create & Print Product Stickers',
    seoDescription: 'Create custom product label stickers online with product details, prices, barcodes and custom layouts. Download PNG or PDF and print directly.',
    formulaLatex: '\\text{Physical Size (pt)} = \\text{Inches} \\times 72 \\quad | \\quad \\text{Export Pixels} = \\text{Inches} \\times 300\\text{ DPI}',
    formulaDescription: 'Labels are scaled using exact physical point coordinates (72 points per inch) for PDF vector output and 300 DPI high-resolution bitmap rendering for thermal stickers.',
    howToUseSteps: [
      'Select a standard label preset (e.g., 2"x1", 2.25"x1.25", 3"x2", 4"x6") or enter custom width & height in inches or mm.',
      'Use the left tool shelf to add Product Name, Selling Price, MRP, SKU, Barcode, Batch No, Size, or custom text.',
      'Drag elements around the canvas, resize them, or use the alignment tools (Left, Center, Right, Middle).',
      'Upload a brand logo or company badge (processed 100% locally in your browser).',
      'Download high-resolution 300 DPI PNG, single-label PDF for thermal rolls, or multi-label A4 sheet PDF for laser printers.'
    ],
    faqs: [
      {
        question: 'Is my label and product pricing data uploaded to any server?',
        answer: 'No. All canvas rendering, image handling, barcode generation, and PDF export happen 100% locally inside your web browser. No product names, prices, or barcodes leave your device.'
      },
      {
        question: 'Can I print these labels on thermal roll printers (Zebra, TSC, TVS)?',
        answer: 'Yes. Single-label PDF and 300 DPI PNG exports preserve exact physical dimensions (e.g. 2"x1" or 50mm x 25mm), making them directly compatible with thermal printer drivers.'
      },
      {
        question: 'Can I print multiple stickers on a standard A4 sheet?',
        answer: 'Yes. Click "Export PDF & Print" and select "Multi-Label A4 Sheet PDF" to automatically tile your labels across standard A4 pages with configurable copy counts.'
      }
    ],
    relatedSlugs: ['free-barcode-label-generator', 'barcode-generator', 'gst-billing-and-invoicing']
  },
  // ─────────────────────────────────────────────────────────────
  // Free Barcode Label Generator (Barcode & QR)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'free-barcode-label-generator',
    title: 'Free Barcode Label Generator Online',
    shortTitle: 'Barcode Label Generator',
    subtitle: 'Generate printable barcode stickers with product names, MRP, SKU, and barcode symbologies for retail and warehouse tagging.',
    description: 'Create printable barcode labels with product name, price, MRP, SKU and barcode. Customize label size and download as PNG or PDF.',
    category: 'barcode',
    categoryLabel: 'Barcode & QR',
    keywords: [
      'barcode label generator',
      'print barcode stickers',
      'barcode price tag',
      'zebra label generator',
      'sku barcode sticker',
      'code 128 label',
      'ean 13 label print'
    ],
    icon: 'Barcode',
    badge: 'New',
    component: BarcodeLabelGenerator,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Barcode Label Generator Online | Design & Print Labels',
    seoDescription: 'Create printable barcode labels with product name, price, MRP, SKU and barcode. Customize label size and download as PNG or PDF.',
    formulaLatex: '\\text{Dots} = \\text{Inches} \\times \\text{Printer DPI (203 / 300)}',
    formulaDescription: 'Barcode widths and dimensions are computed to match 203 DPI and 300 DPI thermal print heads without barcode bar distortion or scanning degradation.',
    howToUseSteps: [
      'Choose your label size (2"x1", 2.25"x1.25", 3"x2", 4"x2", 4"x6", or custom dimensions).',
      'Select your barcode symbology (Code 128 alphanumeric, Code 39, or EAN-13 retail).',
      'Enter product name, SKU, MRP, and selling price using the quick field templates.',
      'Preview the high-contrast barcode layout and consult the Thermal Guide tab for printer driver advice.',
      'Download exact-size single label PDF, high-DPI PNG, or tiled A4 sheet PDF.'
    ],
    faqs: [
      {
        question: 'What barcode symbologies are supported?',
        answer: 'The generator supports Code 128 (high-density alphanumeric for SKUs and serials), Code 39, and EAN-13 (standard 13-digit retail barcode with auto-calculated checksum).'
      },
      {
        question: 'Will the generated barcodes scan reliably?',
        answer: 'Yes. Barcode bars are rendered with integer bar widths and high optical contrast (#000000 on #ffffff) with human-readable text below for maximum scanner readability.'
      },
      {
        question: 'How do I print on thermal label rolls?',
        answer: 'Set your thermal printer driver page size to the physical label dimension (e.g. 2.0" x 1.0"), disable page scaling in your PDF reader, and print.'
      }
    ],
    relatedSlugs: ['product-label-generator', 'barcode-generator', 'bulk-barcode-generator']
  },
  // ─────────────────────────────────────────────────────────────
  // Free Sales Items Analysis (Analytics & Insights)
  // ─────────────────────────────────────────────────────────────
  {
    slug: 'free-sales-items-analysis',
    title: 'Free Sales Items Analysis Tool',
    shortTitle: 'Sales Items Analysis',
    subtitle: 'Analyze product & item performance, variants, sales share, Indian FY trends, and monthly seasonality from CSV or Excel.',
    description: 'Analyze product sales from CSV or Excel with top-selling products, variants, financial year trends, monthly performance and customer insights.',
    category: 'analytics',
    categoryLabel: 'Analytics & Insights',
    keywords: [
      'sales items analysis',
      'product sales report',
      'item level sales analysis',
      'product performance bi',
      'variant sales analysis',
      'top selling products excel',
      'sku performance dashboard'
    ],
    icon: 'Boxes',
    badge: 'Product BI',
    component: FreeSalesItemsAnalysis,
    processingType: 'client',
    status: 'ready',
    seoTitle: 'Free Sales Items Analysis Tool | Product Sales Insights',
    seoDescription: 'Analyze product sales from CSV or Excel with top-selling products, variants, financial year trends, monthly performance and customer insights.',
    formulaLatex: '\\text{Sales Share \\%} = \\frac{\\text{Product Sales}}{\\sum \\text{Catalog Sales}} \\times 100 \\quad | \\quad \\text{ASP} = \\frac{\\text{Net Revenue}}{\\text{Units Sold}}',
    formulaDescription: 'Calculates distinct SKU sales volume, Average Selling Price (ASP), sales share percentage, and classifies catalog items into Star, Growth, Stable, and Low Performer performance tiers.',
    howToUseSteps: [
      'Upload your sales spreadsheet in .csv, .xlsx, or .xls format, or click "Load Demo Product Sales Data" for an instant preview.',
      'Map Date, Product/Item Name, and Sales Amount (optionally map Variant/Size, Quantity, Unit Rate, Brand, and Category).',
      'Click "Analyze Sales Items" to generate product KPIs, ranking tables, and interactive Recharts visualizations.',
      'Explore Product + Variant matrices, Indian Financial Year trends (April-March), and monthly product seasonality.',
      'Export filtered reports as CSV spreadsheets with a single click.'
    ],
    faqs: [
      {
        question: 'How are product variants and sizes handled?',
        answer: 'When you map a Variant or Size column (e.g., S, M, L, XL), the tool offers both catalog-level product aggregation and a detailed Product + Variant breakdown matrix so individual sizes are not merged blindly.'
      },
      {
        question: 'Is any of my sales or product data uploaded to CorpVEX servers?',
        answer: 'No. All spreadsheet reading, column normalization, and analytics are performed 100% locally in your browser memory using SheetJS. Zero data leaves your machine.'
      },
      {
        question: 'How does the product performance classification work?',
        answer: 'Products are ranked based on relative revenue share and quantity velocity into four transparent analytical tiers: Star (top 15% / ≥12% share), Growth (15-45%), Stable (45-75%), and Low Performer (bottom 25%).'
      }
    ],
    relatedSlugs: ['free-sales-analysis-dashboard', 'gst-billing-and-invoicing', 'profit-margin-calculator']
  },
];

// Helper query functions
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory | 'all'): ToolDefinition[] {
  if (category === 'all') return TOOLS_REGISTRY;
  return TOOLS_REGISTRY.filter((t) => t.category === category);
}

export function searchTools(query: string, category: ToolCategory | 'all' = 'all'): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  let list = category === 'all' ? TOOLS_REGISTRY : TOOLS_REGISTRY.filter((t) => t.category === category);
  if (!q) return list;

  return list.filter((t) => {
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}

export function getRelatedTools(currentSlug: string, count: number = 3): ToolDefinition[] {
  const current = getToolBySlug(currentSlug);
  if (!current) return [];

  const explicitRelated = (current.relatedSlugs || [])
    .map((s) => getToolBySlug(s))
    .filter((t): t is ToolDefinition => Boolean(t) && t?.slug !== currentSlug);

  if (explicitRelated.length >= count) {
    return explicitRelated.slice(0, count);
  }

  // Fill up with other tools from the same category
  const sameCategory = TOOLS_REGISTRY.filter(
    (t) => t.category === current.category && t.slug !== currentSlug && !explicitRelated.some((er) => er.slug === t.slug)
  );

  return [...explicitRelated, ...sameCategory].slice(0, count);
}
