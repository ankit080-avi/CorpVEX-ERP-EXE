import React, { useState, useEffect, useMemo } from 'react';
import { LandingTopbar } from './common/LandingTopbar';
import {
  Building2, ArrowRight, CheckCircle2, Zap, Sun, Moon, QrCode,
  ChevronDown, Calculator, Package, Factory, UserCheck,
  Smartphone, TrendingUp, Shield, Menu, X, Check,
  Info, Sparkles, RefreshCw, Globe, ChevronRight, LayoutDashboard,
  FileSpreadsheet, FileText, Search, Filter, Download, Plus,
  Trash2, Printer, Eye, ArrowUpRight, ArrowDownRight,
  TrendingDown, Layers, ShoppingBag, PieChart, BarChart3,
  Sliders, Calendar, Clock, DollarSign, ExternalLink,
  MessageSquare, Award, Lock, Quote, Users, ShieldCheck,
  Send, CheckCheck, Landmark, Phone
} from 'lucide-react';

interface LandingPageViewProps {
  theme: 'dark' | 'light';
  setTheme: React.Dispatch<React.SetStateAction<'dark' | 'light'>>;
  onLogin: () => void;
  onRegister: () => void;
  onPricing?: () => void;
  onNavigateTools?: () => void;
}

/* ── Rich Dummy Data Structures for Interactive Sandbox ── */
interface DemoInvoiceRow {
  id: string;
  date: string;
  party: string;
  gstin: string;
  city: string;
  itemsCount: number;
  taxable: number;
  tax: number;
  total: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
}

interface DemoStockRow {
  itemCode: string;
  itemName: string;
  category: string;
  godown: string;
  stockQty: number;
  unit: string;
  avgRate: number;
  totalValue: number;
  reorderLevel: number;
}

interface DemoTrialBalanceRow {
  accountName: string;
  group: string;
  debit: number;
  credit: number;
}

interface DemoLineItem {
  id: number;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  gstRate: number;
}

const initialInvoices: DemoInvoiceRow[] = [
  { id: 'INV-2026-0891', date: '19 Aug 2026', party: 'Shree Krishna Textiles Ltd', gstin: '27AABCS1429B1ZB', city: 'Surat, GJ', itemsCount: 4, taxable: 245000.00, tax: 12250.00, total: 257250.00, status: 'PAID' },
  { id: 'INV-2026-0892', date: '18 Aug 2026', party: 'Apex Garments & Exports', gstin: '33AAACA5678G1Z2', city: 'Tirupur, TN', itemsCount: 6, taxable: 393142.86, tax: 19657.14, total: 412800.00, status: 'PENDING' },
  { id: 'INV-2026-0893', date: '17 Aug 2026', party: 'Balaji Traders & Distributors', gstin: '24AABCB9012H1Z5', city: 'Ahmedabad, GJ', itemsCount: 3, taxable: 122285.71, tax: 6114.29, total: 128400.00, status: 'PAID' },
  { id: 'INV-2026-0894', date: '16 Aug 2026', party: 'Mahaveer Cotton Mills Pvt Ltd', gstin: '08AAACM3456J1Z1', city: 'Bhilwara, RJ', itemsCount: 8, taxable: 533333.33, tax: 26666.67, total: 560000.00, status: 'OVERDUE' },
  { id: 'INV-2026-0895', date: '15 Aug 2026', party: 'Jaipur Weaves & Handlooms LLP', gstin: '08AABCJ7890K1Z8', city: 'Jaipur, RJ', itemsCount: 2, taxable: 90000.00, tax: 4500.00, total: 94500.00, status: 'PAID' },
  { id: 'INV-2026-0896', date: '14 Aug 2026', party: 'Krishna Hosiery & Knitwear', gstin: '03AAACK2345L1Z4', city: 'Ludhiana, PB', itemsCount: 5, taxable: 300000.00, tax: 15000.00, total: 315000.00, status: 'PENDING' },
  { id: 'INV-2026-0897', date: '13 Aug 2026', party: 'Vardhman Fabrics Pvt Ltd', gstin: '03AABCV6789M1Z7', city: 'Indore, MP', itemsCount: 7, taxable: 800000.00, tax: 40000.00, total: 840000.00, status: 'PAID' },
  { id: 'INV-2026-0898', date: '12 Aug 2026', party: 'Omkar Silk Industries', gstin: '27AABCO4567N1Z9', city: 'Mumbai, MH', itemsCount: 3, taxable: 175000.00, tax: 8750.00, total: 183750.00, status: 'PAID' },
  { id: 'INV-2026-0899', date: '11 Aug 2026', party: 'Zenith Apparel Sourcing LLP', gstin: '29AABCZ1234P1Z3', city: 'Bengaluru, KA', itemsCount: 4, taxable: 460000.00, tax: 23000.00, total: 483000.00, status: 'PENDING' },
];

const initialStockItems: DemoStockRow[] = [
  { itemCode: 'FAB-CTN-001', itemName: 'Premium 60s Combed Cotton Fabric', category: 'Raw Materials', godown: 'Surat Central Godown', stockQty: 4850, unit: 'MTR', avgRate: 420, totalValue: 2037000, reorderLevel: 1500 },
  { itemCode: 'FAB-RAY-004', itemName: '100% Viscose Rayon Slub 30x30', category: 'Raw Materials', godown: 'Surat Central Godown', stockQty: 3200, unit: 'MTR', avgRate: 260, totalValue: 832000, reorderLevel: 1000 },
  { itemCode: 'THD-PLY-012', itemName: 'Industrial Poly-Core Sewing Spools', category: 'Accessories', godown: 'Tirupur Finishing Unit', stockQty: 840, unit: 'BOX', avgRate: 580, totalValue: 487200, reorderLevel: 250 },
  { itemCode: 'BTN-MET-008', itemName: 'Laser Engraved Metallic Buttons', category: 'Accessories', godown: 'Ahmedabad Hub', stockQty: 210, unit: 'PKT', avgRate: 1250, totalValue: 262500, reorderLevel: 80 },
  { itemCode: 'GAR-POL-101', itemName: 'Men Classic Pique Polo (Finished)', category: 'Finished Goods', godown: 'Surat Dispatch Godown', stockQty: 1450, unit: 'PCS', avgRate: 680, totalValue: 986000, reorderLevel: 400 },
  { itemCode: 'GAR-SRT-204', itemName: 'Oxford Formal Cotton Shirts (Finished)', category: 'Finished Goods', godown: 'Surat Dispatch Godown', stockQty: 920, unit: 'PCS', avgRate: 850, totalValue: 782000, reorderLevel: 300 },
];

const initialTrialBalance: DemoTrialBalanceRow[] = [
  { accountName: 'Capital Account (Rajesh Singhania)', group: 'Capital Account', debit: 0, credit: 5000000 },
  { accountName: 'HDFC Current Account (A/c 502000...)', group: 'Bank Accounts', debit: 3215800, credit: 0 },
  { accountName: 'ICICI Working Capital CC Account', group: 'Bank OD/CC A/c', debit: 0, credit: 1420000 },
  { accountName: 'Shree Krishna Textiles Ltd', group: 'Sundry Debtors', debit: 257250, credit: 0 },
  { accountName: 'Apex Garments & Exports', group: 'Sundry Debtors', debit: 412800, credit: 0 },
  { accountName: 'Mahaveer Cotton Mills Pvt Ltd', group: 'Sundry Debtors', debit: 560000, credit: 0 },
  { accountName: 'Gujarat Dyeing & Printing Works', group: 'Sundry Creditors', debit: 0, credit: 890000 },
  { accountName: 'Surat Yarns & Fibres Ltd', group: 'Sundry Creditors', debit: 0, credit: 1240000 },
  { accountName: 'GST Input Tax Credit (ITC - CGST+SGST)', group: 'Duties & Taxes', debit: 384120, credit: 0 },
  { accountName: 'GST Output Tax Payable', group: 'Duties & Taxes', debit: 0, credit: 215400 },
  { accountName: 'Sales Account (Domestic GST 5%)', group: 'Sales Accounts', debit: 0, credit: 4892400 },
  { accountName: 'Purchase Account (Raw Materials 5%)', group: 'Purchase Accounts', debit: 2840000, credit: 0 },
  { accountName: 'Power & Fuel Charges', group: 'Direct Expenses', debit: 185000, credit: 0 },
  { accountName: 'Factory Worker Wages & Jobwork', group: 'Direct Expenses', debit: 420000, credit: 0 },
];

const initialDemoFormItems: DemoLineItem[] = [
  { id: 1, name: 'Premium Cotton Twill Fabric (100% Combed)', hsn: '5208', qty: 250, unit: 'MTR', rate: 420, gstRate: 5 },
  { id: 2, name: 'Rayon Slub Printed Weave Material', hsn: '5407', qty: 180, unit: 'MTR', rate: 260, gstRate: 5 },
  { id: 3, name: 'Industrial Poly-Core Sewing Thread (Spool)', hsn: '5401', qty: 50, unit: 'BOX', rate: 580, gstRate: 12 },
  { id: 4, name: 'Laser Engraved Metallic Buttons (1000 Pack)', hsn: '9606', qty: 15, unit: 'PKT', rate: 1250, gstRate: 18 }
];

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  theme, setTheme, onLogin, onRegister, onPricing, onNavigateTools
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [navScrolled, setNavScrolled] = useState(false);
  const [activeHeroTab, setActiveHeroTab] = useState<'financials' | 'invoicing' | 'inventory' | 'whatsapp'>('financials');
  const [statsVisible, setStatsVisible] = useState(false);
  const [stats, setStats] = useState([0, 0, 0, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [moduleSearch, setModuleSearch] = useState('');
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const [activePipelineStep, setActivePipelineStep] = useState(0);
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  /* ── Interactive ROI Calculator State ── */
  const [roiInvoices, setRoiInvoices] = useState(3200);
  const [roiStaff, setRoiStaff] = useState(25);
  const [roiGodowns, setRoiGodowns] = useState(4);

  /* ── WhatsApp Instant Settlement Simulator State ── */
  const [waPaid, setWaPaid] = useState(false);
  const [waProcessing, setWaProcessing] = useState(false);

  /* ── Comparison Filter State ── */
  const [comparisonCategory, setComparisonCategory] = useState<'all' | 'compliance' | 'finance' | 'manufacturing'>('all');

  /* ── Interactive Demo States ── */
  const [demoMode, setDemoMode] = useState(false);
  const [demoSection, setDemoSection] = useState<'dashboard' | 'form' | 'reporting' | 'stock'>('dashboard');
  const [reportSubTab, setReportSubTab] = useState<'invoices' | 'stock' | 'trial'>('invoices');
  
  // Demo Search, Sort & Filters
  const [gridSearch, setGridSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [sortCol, setSortCol] = useState<string>('date');
  const [sortAsc, setSortAsc] = useState(false);
  
  // Interactive Form State
  const [formVoucherNo, setFormVoucherNo] = useState('INV-2026-0900');
  const [formDate, setFormDate] = useState('2026-08-19');
  const [formCustomer, setFormCustomer] = useState('Shree Krishna Textiles Ltd');
  const [formGstin, setFormGstin] = useState('27AABCS1429B1ZB');
  const [formCity, setFormCity] = useState('Surat, GJ');
  const [formItems, setFormItems] = useState<DemoLineItem[]>(initialDemoFormItems);
  const [invoicesList, setInvoicesList] = useState<DemoInvoiceRow[]>(initialInvoices);
  const [demoToast, setDemoToast] = useState<string | null>(null);
  const [viewInvoiceModal, setViewInvoiceModal] = useState<DemoInvoiceRow | null>(null);
  const [printPreviewInvoice, setPrintPreviewInvoice] = useState<DemoInvoiceRow | null>(null);

  /* ── Platform Architecture State ── */
  const [activePlatformTab, setActivePlatformTab] = useState<'pillars' | 'rollout' | 'playground'>('pillars');
  const [activeConfigTab, setActiveConfigTab] = useState<'fields' | 'grid' | 'pdf' | 'audit'>('fields');
  const [simulatedCustomFields, setSimulatedCustomFields] = useState<string[]>(['Loom Machine No', 'Grey Quality Grade', 'Challan Delivery Boy']);
  const [newFieldName, setNewFieldName] = useState('');


  const dk = theme === 'dark';

  const targets = [500, 25, 99.9, 10];
  const suffixes = ['+', '+', '%', 'Lakh+'];
  const statLabels = ['Enterprises Scaled', 'Industry Blueprints', 'Cloud Uptime SLA', 'Vouchers Processed'];

  const triggerToast = (msg: string) => {
    setDemoToast(msg);
    setTimeout(() => setDemoToast(null), 3200);
  };

  /* ── One-Time Modules Progress Bar Trigger ── */
  const [modulesProgressTriggered, setModulesProgressTriggered] = useState(false);

  useEffect(() => {
    const modulesEl = document.getElementById('modules');
    if (!modulesEl) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setModulesProgressTriggered(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });

    observer.observe(modulesEl);
    return () => observer.disconnect();
  }, []);

  // Scroll tracking for navbar styling & stats trigger
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 30);
      if (window.scrollY > 200) setStatsVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    if (!statsVisible) return;
    let f = 0;
    const id = setInterval(() => {
      f++;
      const p = Math.min(f / 45, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setStats(targets.map(t => Math.round(t * e * 10) / 10));
      if (f >= 45) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [statsVisible]);

  // Lock body scroll when mobile menu or sandbox or print preview is open

// Unlock full page scroll for Landing Page & lock only when modal/sandbox is open
  useEffect(() => {
    const rootEl = document.getElementById('root');
    if (mobileMenuOpen || demoMode || printPreviewInvoice) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.style.height = 'auto';
      if (rootEl) {
        rootEl.style.overflowY = 'visible';
        rootEl.style.height = 'auto';
      }
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, demoMode, printPreviewInvoice]);

  // useEffect(() => {
  //   if (mobileMenuOpen || demoMode || printPreviewInvoice) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  //   return () => { document.body.style.overflow = 'auto'; };
  // }, [mobileMenuOpen, demoMode, printPreviewInvoice]);

  const scrollToSection = (id: string) => {
    if (id === 'pricing') {
      if (onPricing) onPricing();
      return;
    }
    setDemoMode(false);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Dynamic Palette supporting both Dark & Light Themes seamlessly
  const bg = dk ? '#070e1b' : '#f8fafc';
  const bgSection = dk ? '#060c18' : '#f1f5f9';
  const bgCard = dk ? 'rgba(13, 23, 40, 0.88)' : 'rgba(255, 255, 255, 0.95)';
  const fg = dk ? '#f8fafc' : '#0f172a';
  const fg2 = dk ? '#94a3b8' : '#475569';
  const bdr = dk ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
  const bdrHover = dk ? 'rgba(232, 168, 56, 0.45)' : 'rgba(217, 119, 6, 0.45)';
  const acc = dk ? '#e8a838' : '#d97706'; // CorpVEX Amber Gold
  const accTeal = '#00c49f';
  const accBlue = '#38bdf8';

  // Dynamic Form Calculations
  const formTaxable = formItems.reduce((sum, it) => sum + (it.qty * it.rate), 0);
  const formTax = formItems.reduce((sum, it) => sum + ((it.qty * it.rate * it.gstRate) / 100), 0);
  const formGrandTotal = formTaxable + formTax;

  const handleUpdateItemQty = (id: number, newQty: number) => {
    setFormItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, newQty) } : item));
  };

  const handleUpdateItemRate = (id: number, newRate: number) => {
    setFormItems(prev => prev.map(item => item.id === id ? { ...item, rate: Math.max(1, newRate) } : item));
  };

  const handleAddLineItem = () => {
    const nextId = formItems.length ? Math.max(...formItems.map(i => i.id)) + 1 : 1;
    setFormItems(prev => [
      ...prev,
      { id: nextId, name: 'New Custom Fabric / Jobwork Item', hsn: '5208', qty: 100, unit: 'MTR', rate: 350, gstRate: 5 }
    ]);
    triggerToast('Added new line item to invoice form');
  };

  const handleDeleteLineItem = (id: number) => {
    if (formItems.length <= 1) {
      triggerToast('Invoice must contain at least 1 line item');
      return;
    }
    setFormItems(prev => prev.filter(item => item.id !== id));
    triggerToast('Line item removed');
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: DemoInvoiceRow = {
      id: formVoucherNo,
      date: '19 Aug 2026',
      party: formCustomer,
      gstin: formGstin,
      city: formCity,
      itemsCount: formItems.length,
      taxable: formTaxable,
      tax: formTax,
      total: formGrandTotal,
      status: 'PAID'
    };
    setInvoicesList(prev => [newInv, ...prev]);
    triggerToast(`Voucher ${formVoucherNo} saved & posted to ledger successfully!`);
    // increment voucher number
    setFormVoucherNo(prev => `INV-2026-0${Number(prev.split('-')[2]) + 1}`);
  };

  // Filtered and Sorted Invoices
  const processedInvoices = useMemo(() => {
    let list = invoicesList.filter(r => {
      const matchSearch = r.party.toLowerCase().includes(gridSearch.toLowerCase()) ||
                          r.id.toLowerCase().includes(gridSearch.toLowerCase()) ||
                          r.city.toLowerCase().includes(gridSearch.toLowerCase()) ||
                          r.gstin.toLowerCase().includes(gridSearch.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });

    list.sort((a: any, b: any) => {
      const valA = a[sortCol];
      const valB = b[sortCol];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    return list;
  }, [invoicesList, gridSearch, statusFilter, sortCol, sortAsc]);

  const handleSort = (colKey: string) => {
    if (sortCol === colKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colKey);
      setSortAsc(true);
    }
  };

  const modules = [
    {
      id: '01',
      category: 'PRODUCTION',
      title: 'Yarn Dyeing',
      desc: 'Run dyeing programs lot by lot, with full visibility of yarn as it moves between godown, dye house and delivery.',
      bullets: [
        'Lot-wise dyeing programs with shade and quality tracking',
        'Job work challans, receipts and billing',
        'Yarn stock across every process stage',
        'Shortage and wastage accounting per lot'
      ],
      widget: {
        headerLeft: 'DYEING PROGRAM • LOT 87',
        headerRight: 'IN PROCESS',
        headerRightColor: '#e8a838',
        rows: [
          { label: 'Shade NAVY-04 • 2/60s', value: '1,450 kg', highlight: true },
          { label: 'Issued to dye house', value: '1,450 kg' },
          { label: 'Received', value: '1,322 kg' }
        ],
        progressLabel: 'COMPLETION',
        progressPct: 91,
        progressColor: '#e8a838'
      }
    },
    {
      id: '02',
      category: 'PRODUCTION',
      title: 'Grey Manufacturing',
      desc: 'Track weaving from beam to taka, whether on your own looms or spread across job workers.',
      bullets: [
        'Weaving programs with beam and loom allocation',
        'Taka-level production entry and delivery',
        'Yarn consumption vs. standard comparison',
        'Job worker ledgers and rate management'
      ],
      widget: {
        headerLeft: 'WEAVING • PROGRAM W-231',
        headerRight: 'LIVE',
        headerRightColor: '#10b981',
        rows: [
          { label: 'Beams issued', value: '14' },
          { label: 'Taka produced', value: '612' },
          { label: 'Avg. mtr / taka', value: '118.4 mtr', highlight: true }
        ],
        progressLabel: 'PROGRAM PROGRESS',
        progressPct: 68,
        progressColor: '#e8a838'
      }
    },
    {
      id: '03',
      category: 'FINANCIALS',
      title: 'Double-Entry Accounting & BRS',
      desc: 'Enterprise ledger engine with automated sales, purchase, and journal posting, real-time Trial Balance, and AI Bank Reconciliation.',
      bullets: [
        'Automated voucher posting with MCA-compliant audit logs',
        'AI Bank Reconciliation (BRS) with 99.4% auto-matching',
        'Instant Trial Balance, Profit & Loss, and Balance Sheet',
        'Party aging, bill-by-bill settlement, and interest calculation'
      ],
      widget: {
        headerLeft: 'JOURNAL POSTING • INV-2026-0891',
        headerRight: 'BALANCED',
        headerRightColor: '#10b981',
        rows: [
          { label: 'Sales Account (Credit)', value: '₹2,45,000.00' },
          { label: 'GST Output CGST+SGST 5%', value: '₹12,250.00' },
          { label: 'Shree Krishna Textiles (Debit)', value: '₹2,57,250.00', highlight: true }
        ],
        progressLabel: 'BRS RECONCILIATION',
        progressPct: 100,
        progressColor: '#10b981'
      }
    },
    {
      id: '04',
      category: 'INVENTORY',
      title: 'Multi-Godown Stock & Barcodes',
      desc: 'Real-time stock valuation across multiple warehouses, batch and lot tracking, barcode thermal printing, and automated low-stock reorder triggers.',
      bullets: [
        'Multi-location godown balances with FIFO valuation',
        'Barcode label generation and instant scanner input',
        'Material transfer challans and physical stock verification',
        'Lot-wise wastage, shrinkage, and profit margin analytics'
      ],
      widget: {
        headerLeft: 'STOCK ALLOCATION • LOT #FAB-992',
        headerRight: 'IN TRANSIT',
        headerRightColor: '#0284c7',
        rows: [
          { label: 'Surat Central Godown', value: '-4,850 MTR' },
          { label: 'Tirupur Finishing Unit', value: '+4,850 MTR' },
          { label: 'Valuation (60s Cotton)', value: '₹20,37,000', highlight: true }
        ],
        progressLabel: 'TRANSFER STATUS',
        progressPct: 85,
        progressColor: '#0284c7'
      }
    },
    {
      id: '05',
      category: 'COMPLIANCE',
      title: '1-Click GST Returns & e-Invoicing',
      desc: 'Say goodbye to manual JSON exports. Auto-compile GSTR-1 & 3B, verify party GSTINs in real time, and generate government IRP e-Invoices with QR codes.',
      bullets: [
        'Real-time GSTR-1 and GSTR-3B summary compilation',
        'Direct government IRP portal e-Invoice generation with QR',
        'Live online GSTIN verification & tax rate validation',
        'e-Way bill JSON export with distance & pin calculations'
      ],
      widget: {
        headerLeft: 'IRP PORTAL SYNC • GSTR-1',
        headerRight: 'VERIFIED',
        headerRightColor: '#e8a838',
        rows: [
          { label: 'B2B Tax Invoices (IRP Signed)', value: '1,280 docs' },
          { label: 'Total Taxable Turnover', value: '₹4,89,24,000', highlight: true },
          { label: 'Net ITC Claimed (2B Mapped)', value: '₹38,41,200' }
        ],
        progressLabel: 'FILING READINESS',
        progressPct: 100,
        progressColor: '#e8a838'
      }
    },
    {
      id: '06',
      category: 'COMMERCE',
      title: 'Sales Orders & WhatsApp Billing',
      desc: 'Accelerate collections by 35%. Dispatch PDF tax invoices and account statements with embedded dynamic UPI payment QR codes straight to client WhatsApp.',
      bullets: [
        '1-Click WhatsApp invoice & payment link dispatch',
        'Embedded dynamic UPI QR codes for instant settlement',
        'Customer credit limit enforcement & outstanding tracking',
        'Automated payment reminders with receipt voucher generation'
      ],
      widget: {
        headerLeft: 'DISPATCH & COLLECTION • INV-0891',
        headerRight: 'DELIVERED',
        headerRightColor: '#25d366',
        rows: [
          { label: 'Party: Apex Garments & Exports', value: 'Surat, GJ' },
          { label: 'Invoice Total (Incl. 5% GST)', value: '₹4,12,800.00', highlight: true },
          { label: 'WhatsApp Dispatch Status', value: 'Delivered & Read' }
        ],
        progressLabel: 'COLLECTION SETTLEMENT',
        progressPct: 100,
        progressColor: '#25d366'
      }
    },
    {
      id: '07',
      category: 'INTELLIGENCE',
      title: 'Live BI Studio & SQL Reports',
      desc: 'Interactive 3D cash-flow visualizations, trend graphs, drag-and-drop report customization, and direct SQL query runner for deep enterprise analytics.',
      bullets: [
        'Interactive 3D cash-flow donuts and financial area charts',
        'Custom Report Designer with multi-level groupings',
        'Direct SQL Query Runner with instant Excel / PDF export',
        'Role-based rights matrix for fine-grained report privacy'
      ],
      widget: {
        headerLeft: 'BI STUDIO • LIVE TELEMETRY',
        headerRight: 'OPTIMAL',
        headerRightColor: '#a855f7',
        rows: [
          { label: 'Gross Operating Margin', value: '24.8%', highlight: true },
          { label: 'Cash Inflow vs Outflow', value: '+₹24.85 L' },
          { label: 'Top Item: Combed Twill', value: '₹84.20 Lakhs' }
        ],
        progressLabel: 'SYSTEM HEALTH & UPTIME',
        progressPct: 99.9,
        progressColor: '#a855f7'
      }
    },
    {
      id: '08',
      category: 'WORKFORCE',
      title: 'Piece-Rate Payroll & Jobwork',
      desc: 'Complete wage tracking for cutting, stitching, checking, and packing workers with piece-rate calculators, jobwork challans, and automatic TDS / PF deductions.',
      bullets: [
        'Operation-wise piece rate wage calculation & attendance',
        'Job worker rate contract management & TDS deduction',
        'Instant PDF payslip generation and WhatsApp dispatch',
        'Departmental labor cost allocation per garment batch'
      ],
      widget: {
        headerLeft: 'PAYROLL CYCLE • AUG 2026',
        headerRight: 'POSTED',
        headerRightColor: '#6366f1',
        rows: [
          { label: 'Active Floor Workers', value: '148 Staff' },
          { label: 'Piece-Rate Wages Calculated', value: '₹4,20,000', highlight: true },
          { label: 'TDS & Statutory Deductions', value: '₹18,500' }
        ],
        progressLabel: 'PAYSLIP DISPATCH',
        progressPct: 100,
        progressColor: '#6366f1'
      }
    }
  ];

  const pipelineStages = [
    {
      id: 'bom',
      stepNum: '01',
      phase: 'PRODUCTION & BOM',
      shortLabel: 'BOM & Shop Floor',
      icon: Factory,
      title: 'Multi-Level BOM & Garment Shop Floor Jobwork',
      desc: 'Track raw fabric issues, jobwork cutting challans, piece-rate worker payroll, and finished goods inward with exact batch costing and real-time wastage analytics across multi-unit processing mills.',
      metricHighlight: '< 0.8% Wastage',
      metricSub: 'Batch yield guaranteed',
      bullets: [
        'Multi-level Bill of Materials (BOM) with shrinkage & wastage allowance',
        'Job work cutting challans, dyeing program tracking, and worker rate masters',
        'Finished garment batch costing with overhead and jobworker expense allocation',
        'Real-time floor stock visibility across every intermediate processing stage'
      ],
      widget: {
        headerLeft: 'JOBWORK LOT • PROGRAM #409',
        headerRight: 'IN PROCESS',
        headerRightColor: '#f59e0b',
        rows: [
          { label: 'Grey Fabric Issued', value: '12,500 MTR', highlight: true },
          { label: 'Cutting & Stitching Received', value: '4,200 PCS' },
          { label: 'Shortage & Wastage Per Lot', value: '0.8% (STANDARD)' },
          { label: 'Piece-Rate Wage Calculated', value: '₹1,48,500' }
        ],
        progressLabel: 'BATCH YIELD',
        progressPct: 98.6,
        progressColor: '#f59e0b'
      }
    },
    {
      id: 'gst',
      stepNum: '02',
      phase: 'TAX & BILLING',
      shortLabel: '1-Click GST & IRP',
      icon: Shield,
      title: 'Autonomous 1-Click GST Returns & IRP Invoicing',
      desc: 'Say goodbye to manual JSON exports and reconciliations. Corpvex automatically verifies party GSTINs, calculates exact multi-tier HSN tax rates, prepares GSTR-1 & GSTR-3B, and pushes digital signed e-Invoices to the government IRP portal in real time.',
      metricHighlight: '1.2s IRP Sync',
      metricSub: 'Direct NIC IRP Gateway',
      bullets: [
        'Direct API integration with NIC IRP portal for signed QR e-Invoices',
        'Automatic GSTR-1 & 3B table preparation with zero reconciliation mismatch',
        'Automated party GSTIN active validation and multi-tier HSN tax split',
        'Multi-branch consolidated GST ledger and instant ITC reconciliation'
      ],
      widget: {
        headerLeft: 'GSTR-1 & IRP DISPATCH • Q2',
        headerRight: 'ACTIVE & SIGNED',
        headerRightColor: '#10b981',
        rows: [
          { label: 'Verified Tax Invoices', value: '4,902 VOUCHERS', highlight: true },
          { label: 'Taxable Turnover', value: '₹ 8,42,90,000' },
          { label: 'Output IGST / CGST', value: '₹ 42,14,500' },
          { label: 'IRN e-Invoice QR Code', value: 'NIC GENERATED' }
        ],
        progressLabel: 'FILING READINESS',
        progressPct: 100,
        progressColor: '#10b981'
      }
    },
    {
      id: 'whatsapp',
      stepNum: '03',
      phase: 'DISPATCH & COLLECTIONS',
      shortLabel: 'WhatsApp & UPI Pay',
      icon: Smartphone,
      title: 'WhatsApp Auto-Reminders & UPI Pay',
      desc: 'Slash overdue receivable cycles by 35%. Dispatch ledger statements, tax invoices, and instant dynamic UPI payment links directly to customer WhatsApp with automated reconciliation.',
      metricHighlight: '-35% DSO Cycle',
      metricSub: 'Automated 1-tap UPI',
      bullets: [
        'Automated overdue ledger statement delivery with clickable PDF links',
        'Dynamic UPI QR codes embedded directly in invoices for 1-tap settlement',
        'Granular credit limit controls with automated dispatch hold on overdue parties',
        'Daily WhatsApp collection summary digest for sales executives and promoters'
      ],
      widget: {
        headerLeft: 'RECEIVABLE RECOVERY • DISPATCH BOT',
        headerRight: 'DELIVERED',
        headerRightColor: '#25d366',
        rows: [
          { label: 'Overdue Statements Dispatched', value: '842 CLIENTS', highlight: true },
          { label: 'Avg Collection Cycle (DSO)', value: '-35% FASTER' },
          { label: 'Instant UPI Settlements', value: '100% 24/7' },
          { label: 'Payment Receipt Synced', value: 'AUTOMATIC' }
        ],
        progressLabel: 'DELIVERY RATE',
        progressPct: 98.8,
        progressColor: '#25d366'
      }
    },
    {
      id: 'brs',
      stepNum: '04',
      phase: 'TREASURY & SETTLEMENT',
      shortLabel: 'AI Bank Reco (BRS)',
      icon: Zap,
      title: 'AI Bank Reconciliation (BRS)',
      desc: 'Upload any Indian bank statement PDF/Excel (HDFC, ICICI, SBI, Axis) to auto-match contra, receipt, and payment vouchers instantly without manual checking or missed transactions.',
      metricHighlight: '99.4% Match Rate',
      metricSub: 'Zero manual ticking',
      bullets: [
        'Auto-parse multi-page PDF & Excel bank statements with high AI precision',
        'Intelligent narration matching for party receipts and RTGS/NEFT payments',
        'Real-time uncleared cheque tracking and automated book balance reconciliation',
        '1-click ledger contra voucher generation for bank interest & charges'
      ],
      widget: {
        headerLeft: 'AUTO-BRS • HDFC & ICICI & SBI',
        headerRight: 'RECONCILED',
        headerRightColor: '#0284c7',
        rows: [
          { label: 'Statement Lines Imported', value: '4,902 ENTRIES' },
          { label: 'Contra & Receipt Vouchers', value: '4,872 MATCHED', highlight: true },
          { label: 'Unmatched Exception Queue', value: '0 PENDING' },
          { label: 'Variance Difference', value: '₹0.00 (BALANCED)' }
        ],
        progressLabel: 'MATCH ACCURACY',
        progressPct: 99.4,
        progressColor: '#0284c7'
      }
    }
  ];

  const industries = [
    { name: 'Garments & Textiles', icon: Factory, color: '#a855f7', desc: 'Size/Color matrix, fabric consumption BOM, cutting worker piece-rate wages & jobwork challans.' },
    { name: 'FMCG & Wholesale', icon: Package, color: '#0284c7', desc: 'Multi-godown stock, batch/expiry alerts, sales rep routing, bulk pricing slabs & fast billing.' },
    { name: 'Manufacturing & Engineering', icon: Shield, color: '#00c49f', desc: 'Multi-level BOM, machine downtime logs, scrap tracking, jobwork DC & cost variance.' },
    { name: 'Retail & Multi-Store POS', icon: Smartphone, color: '#f59e0b', desc: 'Quick barcode POS billing, unified customer loyalty, centralized pricing & multi-store sync.' },
    { name: 'Pharma & Chemical', icon: Shield, color: '#ec4899', desc: 'Drug license checks, batch testing reports, cold chain logistics, Schedule H1 registers.' },
    { name: 'Logistics & Distribution', icon: Globe, color: '#38bdf8', desc: 'Fleet vehicle allocation, trip LR generation, driver advances, freight billing & e-Way sync.' }
  ];

  const faqs = [
    {
      q: 'How fast can our team migrate from Tally, Busy, or legacy accounting software?',
      a: 'Migration is seamless. Corpvex includes automated Excel/CSV import wizards for chart of accounts, party ledgers, historical balances, item masters with HSN codes, and opening stock with godowns. Most enterprises go live within 24 to 48 hours.'
    },
    {
      q: 'Is our financial data secure and compliant with Indian statutory standards?',
      a: 'Yes, absolutely. Corpvex operates on ISO 27001-certified cloud infrastructure with 256-bit TLS encryption in transit and AES-256 at rest. Automated daily snapshots, full immutable audit logs (MCA compliant), and granular role permissions ensure complete data sovereignty.'
    },
    {
      q: 'Can multiple accountants and branch managers work simultaneously?',
      a: 'Yes, Corpvex is built on a scalable cloud architecture that supports unlimited concurrent users. You can grant granular permissions so billing operators, warehouse staff, and chartered accountants see only what they need.'
    },
    {
      q: 'Does Corpvex support automated GST return filing and e-Invoicing?',
      a: 'Yes. Corpvex auto-compiles GSTR-1 and GSTR-3B summaries directly from voucher entries with 1-click IRP e-invoicing and e-Way bill JSON export.'
    },
    {
      q: 'How does WhatsApp automation work for payments and collections?',
      a: 'You can send GST-compliant PDF tax invoices and account statements with embedded dynamic UPI payment QR codes directly to customers via WhatsApp in one click.'
    }
  ];


  return (
    <div
      onMouseMove={(e) => setMouseCoords({ x: e.clientX, y: e.clientY })}
      style={{
        background: bg,
        color: fg,
        minHeight: '100vh',
        width: '100%',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        position: 'relative'
      }}
    >
      {/* ── Global Styles & Responsive Media Queries ── */}
      <style>{`
      html, body, #root {
          height: auto !important;
          min-height: 100vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          scroll-behavior: smooth;
        }
        html { scroll-behavior: smooth; }
        ::selection { background: ${acc}40; color: #ffffff; }

        @keyframes meshFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(25px, -35px) scale(1.08); }
        }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .lp-shimmer-text {
          background: ${dk
            ? 'linear-gradient(135deg, #ffffff 0%, #e8a838 45%, #38bdf8 80%, #ffffff 100%)'
            : 'linear-gradient(135deg, #0f172a 0%, #d97706 45%, #0284c7 80%, #0f172a 100%)'};
          background-size: 250% 250%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 6s ease infinite;
        }

        .lp-glass-card {
          background: ${bgCard};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${bdr};
          border-radius: 20px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: ${dk ? '0 10px 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'};
        }
        .lp-glass-card:hover {
          border-color: ${bdrHover};
          box-shadow: ${dk ? '0 18px 42px rgba(0, 0, 0, 0.55), 0 0 24px rgba(232, 168, 56, 0.12)' : '0 12px 32px rgba(0, 0, 0, 0.08), 0 0 16px rgba(217, 119, 6, 0.12)'};
          transform: translateY(-4px);
        }

        .lp-btn-primary {
          background: ${acc};
          color: ${dk ? '#080e1a' : '#ffffff'};
          font-weight: 800;
          border-radius: 10px;
          padding: 12px 26px;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px ${acc}40;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-decoration: none;
          white-space: nowrap;
        }
        .lp-btn-primary:hover {
          background: ${dk ? '#f5b342' : '#b45309'};
          transform: translateY(-2px);
          box-shadow: 0 12px 32px ${acc}60;
        }

        .lp-btn-secondary {
          background: ${dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
          color: ${fg};
          font-weight: 700;
          border-radius: 10px;
          padding: 12px 24px;
          border: 1px solid ${bdr};
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }
        .lp-btn-secondary:hover {
          background: ${dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
          border-color: ${bdrHover};
          transform: translateY(-2px);
        }

        /* Marquee Tickers */
        @keyframes marqueeLeft { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .lp-marquee-row { display: flex; gap: 16px; white-space: nowrap; width: max-content; }
        .lp-marquee-row.left { animation: marqueeLeft 42s linear infinite; }
        .lp-marquee-row.left:hover { animation-play-state: paused; }

        .lp-marquee-pill {
          padding: 9px 20px; border-radius: 50px; font-size: 11.5px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: ${dk ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)'};
          border: 1px solid ${bdr};
          color: ${fg2}; display: inline-flex; align-items: center; gap: 9px;
          backdrop-filter: blur(10px);
        }

        /* Responsive Breakpoints */
        .lp-desktop-nav { display: flex; }
        .lp-mobile-menu-btn { display: none; }
        .lp-bento-card-span2 { grid-column: span 2; }

        @media (max-width: 1024px) {
          .lp-desktop-nav { display: none !important; }
          .lp-mobile-menu-btn { display: flex !important; }
        }

        @media (max-width: 820px) {
          .lp-bento-card-span2 { grid-column: span 1 !important; }
          .lp-hero-action-group { width: 100%; flex-direction: column; }
          .lp-hero-action-group button { width: 100%; }
        }

        .lp-hide-scrollbar::-webkit-scrollbar { display: none; }
        .lp-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* ── Floating Hero Micro Badges ── */
        @keyframes floatSlow1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-0.5deg); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(8px) rotate(0.5deg); }
        }
        .lp-hero-chip {
          position: absolute;
          background: ${dk ? 'rgba(10, 18, 32, 0.94)' : 'rgba(255, 255, 255, 0.96)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${bdr};
          border-radius: 12px;
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: ${dk ? '0 16px 36px rgba(0,0,0,0.6), 0 0 20px rgba(232, 168, 56, 0.1)' : '0 12px 28px rgba(0,0,0,0.1)'};
          z-index: 10;
          font-size: 12px;
          font-weight: 700;
          pointer-events: auto;
          transition: all 0.3s ease;
        }
        .lp-hero-chip:hover {
          transform: scale(1.05) translateY(-4px) !important;
          border-color: ${acc};
          box-shadow: 0 20px 45px rgba(0,0,0,0.7), 0 0 25px ${acc}30;
        }
        @media(max-width: 1100px) {
          .lp-hero-chip { display: none !important; }
        }

        /* ── Custom Range Slider for ROI Calculator ── */
        .lp-range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 4px;
          background: ${dk ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'};
          outline: none;
          transition: background 0.2s;
        }
        .lp-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${acc};
          cursor: pointer;
          border: 3px solid ${dk ? '#070e1b' : '#ffffff'};
          box-shadow: 0 0 12px ${acc};
          transition: transform 0.15s ease;
        }
        .lp-range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        /* ── Comparison Table Styles ── */
        .lp-comp-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.2fr;
          gap: 20px;
          padding: 18px 24px;
          border-bottom: 1px solid ${bdr};
          align-items: center;
          transition: background 0.2s ease;
        }
        .lp-comp-row:hover {
          background: ${dk ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'};
        }
        @media(max-width: 860px) {
          .lp-comp-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }

        /* ── Module Hub Card Grid Styles (Premium) ── */
        @keyframes moduleCardFadeIn {
          0% { opacity: 0; transform: translateY(30px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes moduleIconPulse {
          0%, 100% { box-shadow: 0 0 0 0px var(--mod-color, ${acc})30; }
          50% { box-shadow: 0 0 0 8px var(--mod-color, ${acc})00; }
        }

        .lp-module-card {
          background: ${dk ? 'rgba(10, 18, 32, 0.85)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${dk ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
          border-radius: 24px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          animation: moduleCardFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }
        .lp-module-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--mod-color, ${acc}), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          border-radius: 24px 24px 0 0;
        }
        .lp-module-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          background: radial-gradient(ellipse at 20% -20%, var(--mod-color, ${acc})08 0%, transparent 65%);
        }
        .lp-module-card:hover {
          transform: translateY(-8px) scale(1.01);
          border-color: var(--mod-color, ${acc})40;
          box-shadow:
            0 24px 56px rgba(0, 0, 0, ${dk ? '0.5' : '0.12'}),
            0 0 0 1px var(--mod-color, ${acc})20,
            0 0 40px var(--mod-color, ${acc})10;
        }
        .lp-module-card:hover::before { opacity: 1; }
        .lp-module-card:hover::after { opacity: 1; }

        .lp-module-icon-badge {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .lp-module-card:hover .lp-module-icon-badge {
          transform: scale(1.12) rotate(-5deg);
          box-shadow: 0 10px 24px var(--mod-color, ${acc})35;
          animation: moduleIconPulse 2s ease-in-out infinite;
        }

        .lp-module-quick-link {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 11.5px;
          font-weight: 700;
          border: 1px solid ${dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
          background: ${dk ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
          color: ${fg2};
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.02em;
        }
        .lp-module-quick-link:hover {
          background: var(--mod-color, ${acc})18;
          color: var(--mod-color, ${acc});
          border-color: var(--mod-color, ${acc})40;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--mod-color, ${acc})15;
        }

        .lp-module-feature-check {
          display: flex; align-items: center; gap: 7px;
          font-size: 12.5px; font-weight: 600; color: ${fg2};
          line-height: 1.4;
        }

        .lp-modules-search-input {
          width: 100%;
          max-width: 480px;
          padding: 14px 20px 14px 48px;
          border-radius: 16px;
          border: 1px solid ${dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
          background: ${dk ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.95)'};
          backdrop-filter: blur(12px);
          color: ${fg};
          font-size: 14.5px;
          font-weight: 500;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
          box-shadow: 0 4px 16px rgba(0,0,0,${dk ? '0.2' : '0.04'});
        }
        .lp-modules-search-input::placeholder {
          color: ${fg2};
          opacity: 0.5;
        }
        .lp-modules-search-input:focus {
          border-color: ${acc};
          box-shadow: 0 0 0 4px ${acc}15, 0 8px 24px rgba(0,0,0,${dk ? '0.3' : '0.08'});
        }

        @media (max-width: 1100px) {
          .lp-modules-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 650px) {
          .lp-modules-grid { grid-template-columns: 1fr !important; }
          .lp-module-card { padding: 24px !important; }
        }

        .lp-module-card:hover .lp-module-arrow {
          opacity: 1 !important;
          transform: translateX(0px) !important;
        }

        /* ── CorpVEX Alternating Showcase Styles ── */
        .lp-serif-title {
          font-family: 'Playfair Display', 'Merriweather', 'Georgia', serif;
          letter-spacing: -0.02em;
        }
        .lp-mono-tag {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .lp-module-showcase-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 5vw, 84px);
          align-items: center;
          padding: clamp(50px, 7vh, 80px) 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .lp-module-showcase-row:last-child {
          border-bottom: none;
        }
        @media (max-width: 960px) {
          .lp-module-showcase-row {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            padding: 44px 0 !important;
          }
          .lp-module-showcase-row .lp-showcase-text-col {
            order: 1 !important;
          }
          .lp-module-showcase-row .lp-showcase-widget-col {
            order: 2 !important;
          }
        }

        .lp-showcase-widget {
          background: ${dk ? 'rgba(13, 23, 40, 0.95)' : 'rgba(255, 255, 255, 0.98)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${bdr};
          border-radius: 20px;
          padding: 28px 32px;
          box-shadow: ${dk ? '0 24px 56px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.06)' : '0 18px 45px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.9)'};
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .lp-showcase-widget::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(circle at 80% 20%, ${acc}15 0%, transparent 60%);
          pointer-events: none;
          opacity: 0.6;
          transition: opacity 0.4s ease;
        }
        .lp-showcase-widget:hover,
        .lp-showcase-widget.active {
          border-color: ${acc}80;
          box-shadow: ${dk
            ? `0 28px 65px rgba(0, 0, 0, 0.7), 0 0 32px ${acc}25`
            : `0 20px 48px rgba(15, 23, 42, 0.1), 0 0 22px ${acc}20`};
        }
        .lp-showcase-widget:hover::before,
        .lp-showcase-widget.active::before {
          opacity: 1;
        }

        .lp-widget-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 10px;
          border-radius: 8px;
          border-bottom: 1px solid ${dk ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.05)'};
          font-size: 13.5px;
          transition: background 0.25s ease;
        }
        .lp-widget-row:hover {
          background: ${acc}15;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.85; filter: drop-shadow(0 0 6px ${acc}80); }
        }
        .lp-live-badge {
          animation: badgePulse 2.4s ease-in-out infinite;
        }

        .lp-progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        /* ── Platform Section Styles (CorpVEX Architecture & Rollout Timeline) ── */
        .lp-plat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 36px 40px;
          margin-top: 40px;
        }
        .lp-plat-card {
          border-left: 2.5px solid ${acc}70;
          padding: 12px 0 12px 24px;
          background: transparent;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .lp-plat-card:hover {
          border-left-color: ${acc};
          transform: translateX(8px);
        }
        .lp-plat-timeline {
          margin-top: 40px;
          position: relative;
          padding-left: 36px;
        }
        .lp-plat-timeline::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: linear-gradient(to bottom, ${acc}, ${bdr});
        }
        .lp-t-item {
          position: relative;
          padding-bottom: 44px;
        }
        .lp-t-item:last-child {
          padding-bottom: 0;
        }
        .lp-t-item::before {
          content: '';
          position: absolute;
          left: -32px;
          top: 6px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${bg};
          border: 3px solid ${acc};
          box-shadow: 0 0 10px ${acc}50;
        }

        /* ── Modern Bento Grid Card Styles (Superpowers Architecture) ── */
        .lp-modern-bento-card {
          position: relative;
          background: ${dk ? 'linear-gradient(145deg, rgba(13, 23, 40, 0.9) 0%, rgba(8, 14, 26, 0.96) 100%)' : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'};
          border: 1px solid ${bdr};
          border-radius: 20px;
          padding: clamp(24px, 3.2vw, 36px);
          backdrop-filter: blur(16px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          box-shadow: ${dk ? '0 16px 40px rgba(0,0,0,0.45)' : '0 12px 32px rgba(15,23,42,0.05)'};
        }
        .lp-modern-bento-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--card-acc, ${acc}), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .lp-modern-bento-card:hover {
          transform: translateY(-5px);
          border-color: var(--card-acc, ${acc});
          box-shadow: ${dk ? '0 24px 60px rgba(0,0,0,0.65), 0 0 35px var(--card-glow, rgba(232,168,56,0.14))' : '0 20px 48px rgba(15,23,42,0.09), 0 0 25px var(--card-glow, rgba(217,119,6,0.12))'};
        }
        .lp-modern-bento-card:hover::before {
          opacity: 1;
        }
        .lp-bento-preview-box {
          margin-top: 22px;
          background: ${dk ? 'rgba(0,0,0,0.4)' : 'rgba(241, 245, 249, 0.75)'};
          border: 1px solid ${bdr};
          border-radius: 12px;
          padding: 14px 16px;
        }

        /* ── Book a Demo Section ── */
        .lp-demo-section {
          background: transparent;
          position: relative;
          overflow: hidden;
        }
        .lp-demo-section::before {
          content: '';
          position: absolute;
          top: -40%; right: -15%;
          width: 650px; height: 650px;
          background: radial-gradient(circle, ${acc}15 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-demo-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'};
          background: ${dk ? '#0f1c30' : '#ffffff'};
          color: ${fg};
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: all 0.25s ease;
          box-shadow: ${dk ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'};
        }
        .lp-demo-input::placeholder {
          color: ${fg2};
          opacity: 0.5;
        }
        .lp-demo-input:focus {
          border-color: ${acc};
          box-shadow: 0 0 0 3px ${acc}20;
        }
        .lp-demo-select {
          width: 100%;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'};
          background: ${dk ? '#0f1c30' : '#ffffff'};
          color: ${fg};
          font-size: 14px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: ${dk ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'};
        }
        .lp-demo-select:focus {
          border-color: ${acc};
          box-shadow: 0 0 0 3px ${acc}20;
        }
        .lp-demo-select option {
          background: ${dk ? '#0d1828' : '#ffffff'};
          color: ${fg};
        }
        .lp-demo-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.14)'};
          background: ${dk ? '#0f1c30' : '#ffffff'};
          color: ${fg};
          font-size: 14px;
          font-family: inherit;
          outline: none;
          resize: vertical;
          min-height: 95px;
          transition: all 0.25s ease;
          box-shadow: ${dk ? 'none' : '0 2px 6px rgba(0,0,0,0.03)'};
        }
        .lp-demo-textarea::placeholder {
          color: ${fg2};
          opacity: 0.5;
        }
        .lp-demo-textarea:focus {
          border-color: ${acc};
          box-shadow: 0 0 0 3px ${acc}20;
        }
        .lp-demo-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: ${dk ? 'rgba(255,255,255,0.6)' : '#64748b'};
          margin-bottom: 8px;
          display: block;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
        }
        .lp-demo-info-label {
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${acc};
          margin-bottom: 6px;
          display: block;
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
        }
        .lp-demo-submit-btn {
          background: ${acc};
          color: ${dk ? '#080e1a' : '#ffffff'};
          font-weight: 800;
          font-size: 14.5px;
          border-radius: 8px;
          padding: 14px 32px;
          border: none;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px ${acc}40;
        }
        .lp-demo-submit-btn:hover {
          background: ${dk ? '#f5b342' : '#b45309'};
          transform: translateY(-2px);
          box-shadow: 0 12px 32px ${acc}60;
        }

        /* Simulated AG Grid Header & Cell Style */
        .ag-sim-header {
          background: ${dk ? '#14202c' : '#244b5f'};
          color: #ffffff;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.02em;
          user-select: none;
        }
        .ag-sim-header th {
          padding: 10px 14px;
          border-right: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
        }
        .ag-sim-header th:hover {
          background: rgba(255,255,255,0.08);
        }
        .ag-sim-row {
          border-bottom: 1px solid ${bdr};
          font-size: 12.5px;
          transition: background 0.15s ease;
        }
        .ag-sim-row:hover {
          background: ${dk ? 'rgba(0, 196, 159, 0.06)' : 'rgba(0, 196, 159, 0.04)'};
        }
        .ag-sim-row td {
          padding: 9px 14px;
          border-right: 1px solid ${bdr};
        }

        /* Printable Invoice Styles */
        .tax-inv-table th, .tax-inv-table td {
          border: 1px solid #334155;
          padding: 6px 8px;
          font-size: 11px;
        }
      `}</style>

      {/* ── Ambient Mesh Gradient Spotlights ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '15%', width: 'clamp(300px, 50vw, 700px)', height: 'clamp(300px, 50vw, 700px)',
          background: `radial-gradient(circle, ${acc}15 0%, transparent 65%)`,
          filter: 'blur(90px)', animation: 'meshFloat 18s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', top: '35%', right: '-5%', width: 'clamp(280px, 45vw, 650px)', height: 'clamp(280px, 45vw, 650px)',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 65%)',
          filter: 'blur(100px)', animation: 'meshFloat 22s ease-in-out infinite reverse'
        }} />
      </div>

      {/* ── Single Unified Fixed Blueprint Grid (100% Aligned, Zero Double Gridlines) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: dk
          ? 'linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)'
          : 'linear-gradient(rgba(0, 0, 0, 0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.045) 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* ── Interactive Blueprint Grid Hover Spotlight (Same Fixed Coordinates) ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: dk
          ? 'linear-gradient(rgba(232, 168, 56, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 168, 56, 0.25) 1px, transparent 1px)'
          : 'linear-gradient(rgba(217, 119, 6, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(217, 119, 6, 0.25) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        maskImage: `radial-gradient(380px circle at ${mouseCoords.x}px ${mouseCoords.y}px, black 15%, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(380px circle at ${mouseCoords.x}px ${mouseCoords.y}px, black 15%, transparent 80%)`,
        opacity: 0.95,
        transition: 'opacity 0.25s ease'
      }} />

      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        background: `radial-gradient(650px circle at ${mouseCoords.x}px ${mouseCoords.y}px, ${dk ? 'rgba(232, 168, 56, 0.08)' : 'rgba(217, 119, 6, 0.07)'} 0%, transparent 70%)`
      }} />

      {/* ═══════════════════════════════════════════════════════════════════════
          1. RESPONSIVE GLASSMORPHIC HEADER / NAVIGATION (SHARED)
      ═══════════════════════════════════════════════════════════════════════ */}
      <LandingTopbar
        theme={theme}
        setTheme={setTheme}
        activePage="home"
        onNavigateHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigatePlatform={() => scrollToSection('platform')}
        onNavigateFeatures={() => scrollToSection('features')}
        onNavigateModules={() => scrollToSection('modules')}
        onNavigatePricing={() => onPricing && onPricing()}
        onNavigateTools={onNavigateTools}
        onNavigatePortal={() => scrollToSection('telemetry')}
        onNavigateSignup={onRegister}
        onNavigateLogin={onLogin}
        onLaunchDemo={() => setDemoMode(true)}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          2. HIGH-IMPACT HERO SECTION & INTERACTIVE LIVE ERP MOCKUP
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position: 'relative', zIndex: 1,
        paddingTop: 'clamp(40px, 8vh, 90px)',
        paddingBottom: 'clamp(50px, 8vh, 90px)',
        paddingLeft: 'clamp(16px, 4vw, 64px)',
        paddingRight: 'clamp(16px, 4vw, 64px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        {/* Top Announcement Pill */}
        <div
          onClick={() => scrollToSection('features')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 50,
            background: dk ? 'rgba(232, 168, 56, 0.1)' : 'rgba(217, 119, 6, 0.08)',
            border: `1px solid ${acc}40`,
            marginBottom: 24,
            fontSize: 12.5,
            fontWeight: 700,
            color: acc,
            cursor: 'pointer',
            boxShadow: `0 4px 18px ${acc}20`,
            transition: 'all 0.25s ease'
          }}
        >
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          <span>✨ <strong>CORPVEX 2.0 LIVE</strong>: Autonomous MCA Audit Trail & AI Bank Statement Parser</span>
          <ChevronRight size={14} />
        </div>

        {/* Main Hero Headline */}
        <h1 style={{
          fontSize: 'clamp(28px, 5.2vw, 66px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          maxWidth: 1200,
          marginBottom: 18
        }}>
          Run Your Entire Enterprise with{' '}
          <span className="lp-shimmer-text">Autonomous Intelligence</span> & GST Precision.
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(14px, 1.8vw, 18px)',
          color: fg2,
          maxWidth: 880,
          lineHeight: 1.6,
          marginBottom: 32
        }}>
          Unify double-entry accounting, multi-godown stock, automated 1-click GST returns,
          e-invoicing, WhatsApp collections, and live executive BI in one lightning-fast cloud suite.
        </p>

        {/* Hero CTA Group */}
        <div className="lp-hero-action-group" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
          <a 
            href="https://drive.google.com/uc?export=download&id=1aPSjcxZtgJy3R1Aw6M_WhYi5oYIGLMdz" 
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-primary"
            style={{ padding: '13px 30px', fontSize: 14.5, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Download 14-Day Free Trial (.EXE)</span>
            <Download size={14} />
          </a>

          <button onClick={() => setDemoMode(true)} className="lp-btn-secondary" style={{ padding: '13px 26px', fontSize: 14.5 }}>
            <Zap size={16} color={acc} />
            <span>Launch Live Browser Sandbox</span>
          </button>
        </div>


        {/* Trust Points */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px 24px', flexWrap: 'wrap', justifyContent: 'center', fontSize: 12, color: fg2, marginBottom: 44 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={14} color={acc} /> 100% GST & e-Way Compliant</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={14} color={acc} /> Instant 24-Hour Migration</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={14} color={acc} /> 256-Bit TLS Security</span>
        </div>

        {/* ── Relative Wrapper with 4 Floating Telemetry Badges ── */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 1680 }}>
          {/* Floating Badge 1: Top Left */}
          <div className="lp-hero-chip" style={{ top: -18, left: 24, animation: 'floatSlow1 6s ease-in-out infinite' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span>🟢 GSTIN Verified: 24AAACC1206...</span>
          </div>

          {/* Floating Badge 2: Top Right */}
          <div className="lp-hero-chip" style={{ top: -18, right: 24, animation: 'floatSlow2 7s ease-in-out infinite' }}>
            <Zap size={14} color={acc} />
            <span>⚡ 1.2s IRP E-Invoice Signed</span>
          </div>

          {/* Floating Badge 3: Bottom Left */}
          <div className="lp-hero-chip" style={{ bottom: -16, left: 40, animation: 'floatSlow2 8s ease-in-out infinite' }}>
            <Smartphone size={14} color="#10b981" />
            <span>💬 WhatsApp PDF Dispatched</span>
          </div>

          {/* Floating Badge 4: Bottom Right */}
          <div className="lp-hero-chip" style={{ bottom: -16, right: 40, animation: 'floatSlow1 7.5s ease-in-out infinite' }}>
            <TrendingUp size={14} color="#38bdf8" />
            <span>💸 ₹1,48,500 UPI Auto-Reconciled</span>
          </div>

          {/* ── Interactive Live ERP Dashboard Mockup Preview ── */}
          <div className="lp-glass-card" style={{
            width: '100%', overflow: 'hidden', padding: 0,
            boxShadow: '0 25px 60px rgba(0,0,0,0.45)', border: `1px solid ${bdr}`
          }}>
          {/* Mockup Window Header */}
          <div style={{
            padding: '12px 16px', borderBottom: `1px solid ${bdr}`,
            background: dk ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
          }}>
            {/* Traffic Light Window Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: fg2, marginLeft: 6 }}>
                app.corpvex.com / live-telemetry
              </span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="lp-hide-scrollbar" style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: dk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              padding: 3, borderRadius: 10, overflowX: 'auto', maxWidth: '100%'
            }}>
              <button
                onClick={() => setActiveHeroTab('financials')}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                  background: activeHeroTab === 'financials' ? acc : 'transparent',
                  color: activeHeroTab === 'financials' ? '#061118' : fg2,
                  whiteSpace: 'nowrap'
                }}
              >
                Financial BI
              </button>
              <button
                onClick={() => setActiveHeroTab('invoicing')}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                  background: activeHeroTab === 'invoicing' ? acc : 'transparent',
                  color: activeHeroTab === 'invoicing' ? '#061118' : fg2,
                  whiteSpace: 'nowrap'
                }}
              >
                E-Invoicing & GST
              </button>
              <button
                onClick={() => setActiveHeroTab('inventory')}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                  background: activeHeroTab === 'inventory' ? acc : 'transparent',
                  color: activeHeroTab === 'inventory' ? '#061118' : fg2,
                  whiteSpace: 'nowrap'
                }}
              >
                Multi-Godown Stock
              </button>
              <button
                onClick={() => setActiveHeroTab('whatsapp')}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                  background: activeHeroTab === 'whatsapp' ? acc : 'transparent',
                  color: activeHeroTab === 'whatsapp' ? '#061118' : fg2,
                  whiteSpace: 'nowrap'
                }}
              >
                WhatsApp Pay
              </button>
            </div>
          </div>

          {/* Mockup Body Content */}
          <div style={{ padding: 'clamp(16px, 3vw, 32px)', textAlign: 'left' }}>
            {activeHeroTab === 'financials' && (
              <div>
                {/* 4 Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
                  <div className="lp-glass-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Total Revenue (MTD)</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: fg, marginTop: 4 }}>₹48,92,400</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <TrendingUp size={13} /> +18.4% vs last month
                    </div>
                  </div>
                  <div className="lp-glass-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Receivables Due (&lt;30D)</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: fg, marginTop: 4 }}>₹14,28,650</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: acc, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <CheckCircle2 size={13} /> 94% on-time collection
                    </div>
                  </div>
                  <div className="lp-glass-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>GST Input Credit (ITC)</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: fg, marginTop: 4 }}>₹3,84,120</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <Shield size={13} /> 100% 2B matched
                    </div>
                  </div>
                  <div className="lp-glass-card" style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Bank Balance (BRS Sync)</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: fg, marginTop: 4 }}>₹32,15,800</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#a855f7', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <RefreshCw size={13} /> Auto-reconciled
                    </div>
                  </div>
                </div>

                {/* Live Recent Transactions */}
                <div style={{ borderRadius: 12, border: `1px solid ${bdr}`, overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: 540, borderCollapse: 'collapse', fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: dk ? 'rgba(255,255,255,0.03)' : '#f1f5f9', borderBottom: `1px solid ${bdr}` }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: fg2 }}>Invoice #</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: fg2 }}>Customer / Entity</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: fg2 }}>Location</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, color: fg2 }}>Amount (INR)</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700, color: fg2 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoicesList.slice(0, 3).map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: `1px solid ${bdr}` }}>
                          <td style={{ padding: '11px 14px', fontWeight: 800, color: acc }}>{row.id}</td>
                          <td style={{ padding: '11px 14px', fontWeight: 700 }}>{row.party}</td>
                          <td style={{ padding: '11px 14px', color: fg2 }}>{row.city}</td>
                          <td style={{ padding: '11px 14px', textAlign: 'right', fontWeight: 800 }}>₹{row.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                            <span style={{
                              padding: '3px 8px', borderRadius: 50, fontSize: 10.5, fontWeight: 800,
                              background: row.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: row.status === 'PAID' ? '#10b981' : '#f59e0b'
                            }}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeHeroTab === 'invoicing' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                <div className="lp-glass-card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: acc, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Shield size={17} /> Direct IRP Portal Integration
                  </div>
                  <div style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, marginBottom: 14 }}>
                    Generate IRN (Invoice Reference Number) and signed QR code in &lt;200ms directly from voucher approval.
                  </div>
                  <div style={{ background: dk ? 'rgba(0,0,0,0.3)' : '#f1f5f9', padding: 10, borderRadius: 8, fontSize: 11.5, fontFamily: 'monospace', color: acc, wordBreak: 'break-all' }}>
                    IRN: 8a4f9b2c...7e1a (VERIFIED)
                  </div>
                </div>
                <div className="lp-glass-card" style={{ padding: 20 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Globe size={17} /> e-Way Bill Automatic Sync
                  </div>
                  <div style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, marginBottom: 14 }}>
                    Auto-calculates road distance based on pickup & delivery pincodes, vehicle verification, and validity.
                  </div>
                  <div style={{ background: dk ? 'rgba(0,0,0,0.3)' : '#f1f5f9', padding: 10, borderRadius: 8, fontSize: 11.5, fontFamily: 'monospace', color: '#38bdf8' }}>
                    EWB # 2410 8892 4110 (ACTIVE)
                  </div>
                </div>
              </div>
            )}

            {activeHeroTab === 'inventory' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div className="lp-glass-card" style={{ padding: 18 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: fg2 }}>Surat Main Godown</div>
                  <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>1,420 Rolls</div>
                  <div style={{ fontSize: 11.5, color: acc, marginTop: 4 }}>Value: ₹84.5 Lakhs</div>
                </div>
                <div className="lp-glass-card" style={{ padding: 18 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: fg2 }}>Tirupur Finishing Mill</div>
                  <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>890 Rolls</div>
                  <div style={{ fontSize: 11.5, color: '#38bdf8', marginTop: 4 }}>Value: ₹42.1 Lakhs</div>
                </div>
                <div className="lp-glass-card" style={{ padding: 18 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: fg2 }}>Ahmedabad Hub</div>
                  <div style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>650 Rolls</div>
                  <div style={{ fontSize: 11.5, color: '#a855f7', marginTop: 4 }}>Value: ₹29.8 Lakhs</div>
                </div>
              </div>
            )}

            {activeHeroTab === 'whatsapp' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#25d366', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Smartphone size={18} /> Instant WhatsApp Settlement
                  </div>
                  <div style={{ fontSize: 13, color: fg2, lineHeight: 1.5 }}>
                    Customer receives PDF invoice on WhatsApp with direct UPI QR code. Auto-records receipt voucher upon settlement!
                  </div>
                </div>
                <div className="lp-glass-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 70, height: 70, background: '#ffffff', borderRadius: 8, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={60} color="#0a0f18" />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: fg2 }}>Scan & Pay via UPI</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: acc }}>₹2,57,250.00</div>
                    <div style={{ fontSize: 10.5, color: '#10b981', fontWeight: 700 }}>Auto-BRS Verified</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. ENTERPRISE STATS TICKER & MARQUEE
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="telemetry" style={{
        padding: '44px clamp(16px, 4vw, 64px)',
        borderTop: `1px solid ${bdr}`,
        borderBottom: `1px solid ${bdr}`,
        background: dk ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)'
      }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, textAlign: 'center', marginBottom: 36 }}>
            {statLabels.map((lbl, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(30px, 3.8vw, 48px)', fontWeight: 900, color: acc, lineHeight: 1 }}>
                  {statsVisible ? stats[i] : 0}{suffixes[i]}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: fg2, marginTop: 8 }}>
                  {lbl}
                </div>
              </div>
            ))}
          </div>

          {/* Marquee Ticker */}
          <div style={{ overflow: 'hidden', position: 'relative' }}>
            <div className="lp-marquee-row left">
              {[
                'GST e-Invoicing (IRP API)', 'Multi-Godown Stock Valuation', 'Double-Entry Accounting Engine',
                'Automated BRS Bank Sync', 'WhatsApp Invoice Dispatch', 'BOM & Shop Floor Jobwork',
                'Role-Based Rights Matrix', 'MCA Immutable Audit Logs', 'P&L, Balance Sheet & Trial Balance'
              ].concat([
                'GST e-Invoicing (IRP API)', 'Multi-Godown Stock Valuation', 'Double-Entry Accounting Engine',
                'Automated BRS Bank Sync', 'WhatsApp Invoice Dispatch', 'BOM & Shop Floor Jobwork'
              ]).map((tag, idx) => (
                <div key={idx} className="lp-marquee-pill">
                  <Sparkles size={12} color={acc} />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3.5. PLATFORM CONFIGURATION ENGINE & ROLLOUT BLUEPRINT (#platform)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="platform" style={{
        padding: 'clamp(65px, 9vh, 115px) clamp(16px, 4vw, 64px)',
        maxWidth: 1680, margin: '0 auto', position: 'relative'
      }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.18em', marginBottom: 10 }}>
            PLATFORM ARCHITECTURE · CONFIG-DRIVEN
          </div>
          <h2 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 4.2vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 16 }}>
            Configured, <span style={{ color: acc, fontStyle: 'italic' }}>not customized.</span>
          </h2>
          <p style={{ fontSize: 'clamp(14.5px, 1.8vw, 17.5px)', color: fg2, maxWidth: 860, margin: '0 auto 30px', lineHeight: 1.65 }}>
            Most ERPs bend your business to fit the software. Corpvex is engineered the other way: an autonomous configuration engine that shapes forms, fields, validation grids, and registers around how your enterprise actually works.
          </p>

          {/* Interactive Navigation Switcher */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: dk ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            padding: 5, borderRadius: 50, border: `1px solid ${bdr}`,
            backdropFilter: 'blur(12px)', flexWrap: 'wrap', justifyContent: 'center'
          }}>
            {[
              { id: 'pillars', label: 'Why It Matters (6 Core Pillars)' },
              { id: 'rollout', label: 'How a Rollout Works (Timeline)' },
              { id: 'playground', label: 'Live Schema Configurator' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePlatformTab(tab.id as any)}
                style={{
                  padding: '8px 22px', borderRadius: 50, border: 'none',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  background: activePlatformTab === tab.id ? acc : 'transparent',
                  color: activePlatformTab === tab.id ? (dk ? '#080e1a' : '#ffffff') : fg2,
                  transition: 'all 0.25s ease',
                  boxShadow: activePlatformTab === tab.id ? `0 4px 14px ${acc}40` : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB 1: 6 CORE PLATFORM PILLARS (MIND-FORGE STYLE GRID) ── */}
        {activePlatformTab === 'pillars' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 38 }}>
              <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
                Change in days, not development cycles.
              </h3>
              <p style={{ fontSize: 14.5, color: fg2, maxWidth: 720, margin: '0 auto' }}>
                When a new register, custom field, or statutory report is a dynamic configuration change instead of a software project, your ERP keeps up with your business — season after season.
              </p>
            </div>

            <div className="lp-plat-grid">
              {[
                {
                  tag: 'CONFIG-DRIVEN',
                  title: 'Your forms, your fields',
                  desc: 'Screens are assembled dynamically from declarative configuration schemas. Adding a custom field, a GST validation rule, or an entirely new register is fast and safe — no rebuild, no database migration drama.',
                  color: acc
                },
                {
                  tag: 'MULTI-TENANT',
                  title: 'Group-ready by design',
                  desc: 'Multiple companies, mill divisions, processing units, and financial years under one centralized login. Data is cleanly separated per entity, consolidated instantly when you need the group view.',
                  color: '#38bdf8'
                },
                {
                  tag: 'AUDITED & IMMUTABLE',
                  title: 'Every change accountable',
                  desc: 'All updates are recorded with before-and-after values and a cryptographic audit trail. MCA-compliant ledger integrity ensures your books stay 100% trustworthy and mistakes are reversible.',
                  color: '#10b981'
                },
                {
                  tag: 'REPORTING ENGINE',
                  title: 'Grids, PDFs, barcodes & thermal',
                  desc: 'High-speed filterable AG Grid reports with saved templates, pixel-perfect PDF formats designed to your exact corporate letterhead, and automated barcode/QR printing for godown tagging and dispatch.',
                  color: '#a855f7'
                },
                {
                  tag: 'AI-ASSISTED INTELLIGENCE',
                  title: 'Faster answers, faster fixes',
                  desc: 'An internal enterprise AI knowledge neural system trained on thousands of resolved transactions helps your accounts team resolve discrepancies and ship custom reports in hours, not weeks.',
                  color: '#f59e0b'
                },
                {
                  tag: 'PROVEN MILL SCALE',
                  title: 'Running real mills daily',
                  desc: 'Engineered for high-volume enterprise throughput. Deployed across textile conglomerates and manufacturing hubs handling lakhs of meters, multi-mill jobwork, and real-time bank reconciliation daily.',
                  color: '#06b6d4'
                }
              ].map((item, idx) => (
                <div key={idx} className="lp-plat-card">
                  <div className="lp-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: item.color, marginBottom: 10 }}>
                    {item.tag}
                  </div>
                  <h4 className="lp-serif-title" style={{ fontSize: 22, fontWeight: 700, color: fg, marginBottom: 10, lineHeight: 1.25 }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.65, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: HOW A ROLLOUT WORKS TIMELINE ── */}
        {activePlatformTab === 'rollout' && (
          <div style={{ maxWidth: 1040, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
                From first meeting to month-end close.
              </h3>
              <p style={{ fontSize: 14.5, color: fg2, maxWidth: 660, margin: '0 auto' }}>
                A proven 4-stage implementation methodology designed specifically for Indian manufacturing and trading enterprises.
              </p>
            </div>

            <div className="lp-plat-timeline">
              {[
                {
                  period: 'Week 0',
                  title: 'Understand the business',
                  desc: 'We sit with your operational teams — accounts, dispatch, godown masters, production jobworkers — and map how material and cash flow actually happen, not just how the org chart says it does.',
                  badge: 'Discovery & Mapping'
                },
                {
                  period: 'Weeks 1–3',
                  title: 'Configure & migrate',
                  desc: 'Item masters, opening stock balances, GST tax rules, and corporate print formats are configured. Your legacy data from Tally, Busy, or Excel is imported — cleaned, verified, and reconciled.',
                  badge: 'Automated Migration'
                },
                {
                  period: 'Weeks 3–6',
                  title: 'Parallel run & verification',
                  desc: 'Your team operates in Corpvex with our dedicated solution architects on standby. Daily registers and GST return numbers are matched against your legacy software until complete 100% confidence is reached.',
                  badge: 'Risk-Free Verification'
                },
                {
                  period: 'Go-Live',
                  title: 'Cutover & ongoing support',
                  desc: 'Corpvex takes over primary operations seamlessly. Dedicated phone and WhatsApp support continues through your first month-end close, first quarterly GST filing, annual statutory audit, and beyond.',
                  badge: 'Full Production Handholding'
                }
              ].map((step, idx) => (
                <div key={idx} className="lp-t-item">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="lp-mono-tag" style={{ fontSize: 12, fontWeight: 800, color: acc, background: `${acc}18`, padding: '4px 10px', borderRadius: 6 }}>
                        {step.period}
                      </span>
                      <h4 className="lp-serif-title" style={{ fontSize: 20, fontWeight: 700, margin: 0, color: fg }}>
                        {step.title}
                      </h4>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: fg2, border: `1px solid ${bdr}`, padding: '3px 10px', borderRadius: 50, background: dk ? 'rgba(255,255,255,0.03)' : '#f1f5f9' }}>
                      {step.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: fg2, lineHeight: 1.65, margin: 0, paddingLeft: 2 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: LIVE SCHEMA CONFIGURATOR & REPORT ENGINE PLAYGROUND ── */}
        {activePlatformTab === 'playground' && (
          <div className="lp-glass-card" style={{ padding: 'clamp(24px, 3.5vw, 40px)', borderRadius: 20, maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24, borderBottom: `1px solid ${bdr}`, paddingBottom: 16 }}>
              <div>
                <h3 className="lp-serif-title" style={{ fontSize: 22, fontWeight: 700, color: fg, margin: '0 0 4px' }}>
                  Interactive Configuration Simulator
                </h3>
                <p style={{ fontSize: 13, color: fg2, margin: 0 }}>
                  Test how Corpvex dynamic schemas modify voucher layouts and registers without code rebuilds.
                </p>
              </div>

              {/* Sub-tabs */}
              <div style={{ display: 'flex', gap: 6, background: dk ? 'rgba(0,0,0,0.3)' : '#f1f5f9', padding: 4, borderRadius: 10 }}>
                {[
                  { id: 'fields', label: 'Custom Fields' },
                  { id: 'grid', label: 'AG Grid Studio' },
                  { id: 'pdf', label: 'Voucher Letterhead' },
                  { id: 'audit', label: 'MCA Audit Diff' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveConfigTab(sub.id as any)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, border: 'none',
                      fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: activeConfigTab === sub.id ? acc : 'transparent',
                      color: activeConfigTab === sub.id ? (dk ? '#080e1a' : '#ffffff') : fg2,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab 1: Custom Field Injector */}
            {activeConfigTab === 'fields' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: fg, marginBottom: 8 }}>
                      Add a Custom Register Field
                    </div>
                    <p style={{ fontSize: 12.5, color: fg2, lineHeight: 1.5, marginBottom: 14 }}>
                      Need to track Loom Machine No, Quality Grade, or Weaving Beam details on your Tax Invoice? Type below to inject it instantly into the live schema:
                    </p>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                      <input
                        type="text"
                        placeholder="e.g. Loom Machine No"
                        value={newFieldName}
                        onChange={e => setNewFieldName(e.target.value)}
                        style={{
                          flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${bdr}`,
                          background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13, outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newFieldName.trim() && !simulatedCustomFields.includes(newFieldName.trim())) {
                            setSimulatedCustomFields([...simulatedCustomFields, newFieldName.trim()]);
                            setNewFieldName('');
                            triggerToast('Custom field added to schema!');
                          }
                        }}
                        style={{
                          padding: '0 18px', borderRadius: 8, border: 'none', background: acc,
                          color: dk ? '#080e1a' : '#ffffff', fontSize: 13, fontWeight: 800, cursor: 'pointer'
                        }}
                      >
                        + Inject Field
                      </button>
                    </div>

                    <div style={{ fontSize: 11.5, fontWeight: 700, color: fg2, marginBottom: 6 }}>
                      ACTIVE DYNAMIC SCHEMA FIELDS ({simulatedCustomFields.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {simulatedCustomFields.map((f, i) => (
                        <span key={i} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                          borderRadius: 50, background: `${acc}15`, color: acc, fontSize: 11.5, fontWeight: 700
                        }}>
                          {f}
                          <span
                            onClick={() => setSimulatedCustomFields(simulatedCustomFields.filter((_, idx) => idx !== i))}
                            style={{ cursor: 'pointer', opacity: 0.7 }}
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Live Simulated Form */}
                  <div style={{
                    background: dk ? 'rgba(0,0,0,0.4)' : '#f8fafc', padding: 20, borderRadius: 12,
                    border: `1px solid ${bdr}`
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: acc, marginBottom: 12 }}>
                      LIVE VOUCHER SCREEN (AUTO-ASSEMBLED)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, color: fg2, fontWeight: 700, marginBottom: 3 }}>PARTY NAME</div>
                        <div style={{ fontSize: 12, color: fg, fontWeight: 600 }}>Shree Krishna Textiles</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: fg2, fontWeight: 700, marginBottom: 3 }}>GSTIN</div>
                        <div style={{ fontSize: 12, color: fg, fontWeight: 600 }}>27AABCS1429B1ZB</div>
                      </div>
                    </div>

                    {/* Dynamic Fields List */}
                    <div style={{ borderTop: `1px dashed ${bdr}`, paddingTop: 10, marginTop: 10 }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: fg2, marginBottom: 8 }}>
                        DYNAMIC EXTENSION FIELDS
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {simulatedCustomFields.map((f, i) => (
                          <div key={i} style={{ background: dk ? 'rgba(255,255,255,0.03)' : '#ffffff', padding: '8px 10px', borderRadius: 6, border: `1px solid ${bdr}` }}>
                            <div style={{ fontSize: 9.5, color: acc, fontWeight: 700 }}>{f.toUpperCase()}</div>
                            <div style={{ fontSize: 11.5, color: fg, fontWeight: 500 }}>Configured (Live)</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tab 2: AG Grid Studio */}
            {activeConfigTab === 'grid' && (
              <div>
                <div style={{ fontSize: 13.5, color: fg2, marginBottom: 14 }}>
                  Fast filterable reporting with custom groupings, pivot tables, and saved view bookmarks.
                </div>
                <div style={{ overflowX: 'auto', border: `1px solid ${bdr}`, borderRadius: 10 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: dk ? '#111e30' : '#f1f5f9', borderBottom: `1px solid ${bdr}`, textAlign: 'left' }}>
                        <th style={{ padding: '10px 14px', color: acc }}>Voucher #</th>
                        <th style={{ padding: '10px 14px' }}>Date</th>
                        <th style={{ padding: '10px 14px' }}>Customer / Mill</th>
                        <th style={{ padding: '10px 14px' }}>Taxable Amt</th>
                        <th style={{ padding: '10px 14px' }}>GST Rate</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: acc }}>INV-2026-0891</td>
                        <td style={{ padding: '10px 14px' }}>19 Aug 2026</td>
                        <td style={{ padding: '10px 14px' }}>Shree Krishna Textiles Ltd</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹2,45,000.00</td>
                        <td style={{ padding: '10px 14px' }}>5% IGST</td>
                        <td style={{ padding: '10px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: 11, fontWeight: 700 }}>PAID</span></td>
                      </tr>
                      <tr style={{ borderBottom: `1px solid ${bdr}` }}>
                        <td style={{ padding: '10px 14px', fontWeight: 700, color: acc }}>INV-2026-0892</td>
                        <td style={{ padding: '10px 14px' }}>18 Aug 2026</td>
                        <td style={{ padding: '10px 14px' }}>Apex Garments & Exports</td>
                        <td style={{ padding: '10px 14px', fontWeight: 600 }}>₹3,93,142.86</td>
                        <td style={{ padding: '10px 14px' }}>5% IGST</td>
                        <td style={{ padding: '10px 14px' }}><span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontSize: 11, fontWeight: 700 }}>PENDING</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 3: Voucher Letterhead */}
            {activeConfigTab === 'pdf' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: fg, marginBottom: 6 }}>
                  Pixel-Perfect Thermal, A4 & A5 Multi-Template Engine
                </div>
                <p style={{ fontSize: 13, color: fg2, maxWidth: 560, margin: '0 auto 16px' }}>
                  Choose from standard tax invoice formats with IRN QR codes, terms & conditions, bank UPI QR, and authorized digital signatures.
                </p>
                <div style={{ display: 'inline-flex', gap: 12 }}>
                  <span style={{ padding: '6px 14px', borderRadius: 6, background: `${acc}20`, color: acc, fontSize: 12, fontWeight: 700 }}>
                    ✓ GST e-Invoice with Signed QR
                  </span>
                  <span style={{ padding: '6px 14px', borderRadius: 6, background: `${acc}20`, color: acc, fontSize: 12, fontWeight: 700 }}>
                    ✓ 3-Inch Thermal Delivery Slip
                  </span>
                  <span style={{ padding: '6px 14px', borderRadius: 6, background: `${acc}20`, color: acc, fontSize: 12, fontWeight: 700 }}>
                    ✓ Multi-Currency Export Invoice
                  </span>
                </div>
              </div>
            )}

            {/* Sub-tab 4: MCA Audit Diff */}
            {activeConfigTab === 'audit' && (
              <div style={{ background: dk ? 'rgba(0,0,0,0.3)' : '#f8fafc', padding: 18, borderRadius: 10, border: `1px solid ${bdr}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={16} /> MCA IMMUTABLE AUDIT TRAIL LOG # 9042
                  </div>
                  <div style={{ fontSize: 11, color: fg2 }}>19 Aug 2026 · 14:32:05 IST</div>
                </div>
                <div style={{ fontSize: 12, color: fg2, fontFamily: 'monospace', lineHeight: 1.6 }}>
                  <div><strong>User:</strong> rajesh.singhania (Surat Office · IP: 103.21.244.18)</div>
                  <div><strong>Action:</strong> Modified Unit Rate on Line Item # 2</div>
                  <div style={{ color: '#ef4444' }}>- Previous Value: ₹420.00 / MTR (Taxable: ₹2,10,000.00)</div>
                  <div style={{ color: '#10b981' }}>+ Updated Value: ₹450.00 / MTR (Taxable: ₹2,25,000.00)</div>
                  <div style={{ color: acc, marginTop: 4 }}>* Revert Token: RVT-8a90e-VERIFIED</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Platform CTA Banner ── */}
        <div style={{
          marginTop: 60,
          padding: '40px clamp(20px, 4vw, 48px)',
          borderRadius: 20,
          background: dk
            ? 'linear-gradient(135deg, rgba(232, 168, 56, 0.08) 0%, rgba(13, 23, 40, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, #ffffff 100%)',
          border: `1px solid ${bdr}`,
          textAlign: 'center'
        }}>
          <h3 className="lp-serif-title" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, marginBottom: 12 }}>
            See the configuration engine <span style={{ color: acc, fontStyle: 'italic' }}>on your own workflow.</span>
          </h3>
          <p style={{ fontSize: 14.5, color: fg2, maxWidth: 640, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Bring a form, custom register, or complex GST report you wish your current ERP had — our solution architects will configure it live in your demo session.
          </p>
          <button
            onClick={onRegister}
            className="lp-demo-submit-btn"
            style={{ fontSize: 15, padding: '14px 34px' }}
          >
            <span>Book a Demo</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. CONNECTED ENTERPRISE PIPELINE FLOW (CORE SUPERPOWERS)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{
        padding: 'clamp(55px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        maxWidth: 1680, margin: '0 auto',
        position: 'relative'
      }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
            END-TO-END AUTONOMOUS WORKFLOW
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
            Connected Enterprise Pipeline Flow
          </h2>
          <p style={{ fontSize: 'clamp(14px, 1.5vw, 16.5px)', color: fg2, maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
            From raw fabric issues and shop floor jobwork to instant 1-click GST, automated WhatsApp UPI collections, and AI bank settlement — zero data silos.
          </p>
        </div>

        {/* ── 4-Stage Connected Node Bar with Animated Flow Tracker ── */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          {/* Background Connecting Pipe Track (Desktop Only) */}
          <div style={{
            position: 'absolute',
            top: 36,
            left: '12.5%',
            right: '12.5%',
            height: 3,
            background: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            zIndex: 1,
            borderRadius: 2
          }}>
            {/* Glowing Active Fill Segment */}
            <div style={{
              height: '100%',
              width: `${(activePipelineStep / (pipelineStages.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, #f59e0b, ${acc})`,
              boxShadow: `0 0 12px ${acc}90`,
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          {/* Node Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 14,
            position: 'relative',
            zIndex: 2
          }}>
            {pipelineStages.map((stage, idx) => {
              const isActive = activePipelineStep === idx;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActivePipelineStep(idx)}
                  className="lp-glass-card"
                  style={{
                    padding: '16px 18px',
                    borderRadius: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    border: isActive ? `2px solid ${acc}` : `1px solid ${bdr}`,
                    background: isActive
                      ? (dk ? 'linear-gradient(135deg, rgba(232, 168, 56, 0.14) 0%, rgba(11, 20, 36, 0.95) 100%)' : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, #ffffff 100%)')
                      : (dk ? 'rgba(11, 20, 36, 0.5)' : '#ffffff'),
                    boxShadow: isActive ? `0 12px 30px ${acc}25` : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: isActive ? acc : (dk ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
                    color: isActive ? '#060e1a' : fg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 13,
                    flexShrink: 0,
                    fontFamily: 'monospace',
                    transition: 'all 0.25s'
                  }}>
                    {stage.stepNum}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: isActive ? acc : fg2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {stage.phase}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: fg, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {stage.shortLabel}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Active Stage Deep-Dive Interactive Theater ── */}
        {(() => {
          const activeStage = pipelineStages[activePipelineStep];
          return (
            <div
              className="lp-glass-card"
              style={{
                padding: 'clamp(28px, 4vw, 52px)',
                borderRadius: 24,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: 'clamp(32px, 4.5vw, 64px)',
                alignItems: 'center',
                border: `1px solid ${dk ? 'rgba(232, 168, 56, 0.25)' : 'rgba(217, 119, 6, 0.2)'}`,
                boxShadow: dk ? '0 24px 60px rgba(0,0,0,0.5)' : '0 16px 45px rgba(15,23,42,0.06)'
              }}
            >
              {/* Left Column: Stage Details */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span className="lp-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, padding: '4px 10px', borderRadius: 6, background: `${acc}18` }}>
                    STAGE {activeStage.stepNum} OF 04 • {activeStage.phase}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981', padding: '4px 10px', borderRadius: 6, background: 'rgba(16, 185, 129, 0.12)' }}>
                    ⚡ {activeStage.metricHighlight}
                  </span>
                </div>

                <h3 className="lp-serif-title" style={{ fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: 800, lineHeight: 1.2, color: fg, margin: '0 0 16px' }}>
                  {activeStage.title}
                </h3>

                <p style={{ fontSize: 'clamp(14px, 1.4vw, 15.5px)', color: fg2, lineHeight: 1.68, margin: '0 0 24px' }}>
                  {activeStage.desc}
                </p>

                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 30 }}>
                  {activeStage.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: fg, lineHeight: 1.5 }}>
                      <CheckCircle2 size={16} color={acc} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Flow Nav Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setActivePipelineStep(s => (s + 1) % pipelineStages.length)}
                    className="lp-btn-primary"
                    style={{ padding: '11px 22px', fontSize: 13.5 }}
                  >
                    <span>Next Stage: {pipelineStages[(activePipelineStep + 1) % pipelineStages.length].shortLabel}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => setDemoMode(true)}
                    className="lp-btn-secondary"
                    style={{ padding: '11px 20px', fontSize: 13.5 }}
                  >
                    <Zap size={15} color={acc} />
                    <span>Try in Sandbox</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive ERP Widget */}
              <div>
                <div className="lp-showcase-widget" style={{ background: dk ? '#0b1424' : '#ffffff', padding: 'clamp(20px, 3vw, 28px)', borderRadius: 18, border: `1px solid ${bdr}` }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: `1px dashed ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, marginBottom: 16 }}>
                    <span className="lp-mono-tag" style={{ fontSize: 11, fontWeight: 700, color: fg2 }}>
                      {activeStage.widget.headerLeft}
                    </span>
                    <span className="lp-mono-tag lp-live-badge" style={{
                      fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                      background: `${activeStage.widget.headerRightColor}20`, color: activeStage.widget.headerRightColor,
                      border: `1px solid ${activeStage.widget.headerRightColor}40`
                    }}>
                      {activeStage.widget.headerRight}
                    </span>
                  </div>

                  {/* Rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activeStage.widget.rows.map((r, rIdx) => (
                      <div key={rIdx} className="lp-widget-row" style={{ padding: '10px 12px', background: dk ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: dk ? '#cbd5e1' : '#334155', fontWeight: 600, fontSize: 13 }}>{r.label}</span>
                        <span className="lp-mono-tag" style={{ fontSize: 13.5, fontWeight: 700, color: r.highlight ? acc : fg }}>
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${dk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span className="lp-mono-tag" style={{ fontSize: 10.5, fontWeight: 700, color: fg2 }}>
                        {activeStage.widget.progressLabel}
                      </span>
                      <span className="lp-mono-tag" style={{ fontSize: 12, fontWeight: 800, color: activeStage.widget.progressColor }}>
                        {activeStage.widget.progressPct}%
                      </span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <div
                        className="lp-progress-fill"
                        style={{
                          width: `${activeStage.widget.progressPct}%`,
                          background: `linear-gradient(90deg, ${activeStage.widget.progressColor}, #f59e0b)`,
                          boxShadow: `0 0 14px ${activeStage.widget.progressColor}90`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4.1 INTERACTIVE ENTERPRISE ROI & COST SAVINGS CALCULATOR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="roi-calculator" style={{
        padding: 'clamp(60px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        background: dk ? 'rgba(8, 14, 26, 0.6)' : 'rgba(248, 250, 252, 0.8)',
        borderTop: `1px solid ${bdr}`,
        borderBottom: `1px solid ${bdr}`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: acc, marginBottom: 10 }}>
              INTERACTIVE BUSINESS IMPACT CALCULATOR
            </div>
            <h2 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 3.8vw, 46px)', fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 14 }}>
              Calculate Your Enterprise ROI & Hours Saved
            </h2>
            <p style={{ fontSize: 16, color: fg2, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
              Adjust the sliders below to see your operational time savings, accelerated payment recovery, and annual cost reductions with Corpvex.
            </p>
          </div>

          {/* Calculator Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'stretch'
          }}>
            {/* Sliders Card */}
            <div className="lp-glass-card" style={{ padding: 'clamp(24px, 3.5vw, 36px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: fg, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sliders size={20} color={acc} /> Your Current Business Volume
              </div>

              {/* Slider 1: Monthly Invoices */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: fg2 }}>Monthly Invoices Generated</span>
                  <span className="lp-mono-tag" style={{ fontSize: 16, fontWeight: 800, color: acc }}>
                    {roiInvoices.toLocaleString('en-IN')} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={250}
                  value={roiInvoices}
                  onChange={e => setRoiInvoices(Number(e.target.value))}
                  className="lp-range-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: fg2, marginTop: 6 }}>
                  <span>500</span>
                  <span>10,000</span>
                  <span>25,000+</span>
                </div>
              </div>

              {/* Slider 2: Factory & Office Users */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: fg2 }}>Active Factory & Accounts Staff</span>
                  <span className="lp-mono-tag" style={{ fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>
                    {roiStaff} Users
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={150}
                  step={5}
                  value={roiStaff}
                  onChange={e => setRoiStaff(Number(e.target.value))}
                  className="lp-range-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: fg2, marginTop: 6 }}>
                  <span>5 Users</span>
                  <span>50 Users</span>
                  <span>150+ Users</span>
                </div>
              </div>

              {/* Slider 3: Godowns & Mills */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: fg2 }}>Warehouses & Mill Locations</span>
                  <span className="lp-mono-tag" style={{ fontSize: 16, fontWeight: 800, color: '#10b981' }}>
                    {roiGodowns} Godowns
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={roiGodowns}
                  onChange={e => setRoiGodowns(Number(e.target.value))}
                  className="lp-range-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: fg2, marginTop: 6 }}>
                  <span>1 Unit</span>
                  <span>10 Units</span>
                  <span>25+ Units</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            {(() => {
              const hoursSaved = Math.round((roiInvoices * 0.016) + (roiStaff * 1.4) + (roiGodowns * 2.2));
              const annualSavings = Math.round((hoursSaved * 12 * 420) + (roiInvoices * 12 * 5.5));

              return (
                <div className="lp-glass-card" style={{
                  padding: 'clamp(24px, 3.5vw, 36px)',
                  background: dk ? 'linear-gradient(145deg, rgba(16, 26, 45, 0.95) 0%, rgba(8, 14, 26, 0.98) 100%)' : '#ffffff',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  border: `1px solid ${acc}40`,
                  boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${acc}15`
                }}>
                  <div>
                    <div className="lp-mono-tag" style={{ fontSize: 11, fontWeight: 800, color: acc, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={14} /> ESTIMATED CORPVEX IMPACT
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                      {/* Metric 1 */}
                      <div style={{ background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: 18, borderRadius: 12, border: `1px solid ${bdr}` }}>
                        <div style={{ fontSize: 11.5, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Monthly Time Saved</div>
                        <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 900, color: acc, marginTop: 4 }}>
                          {hoursSaved} hrs
                        </div>
                        <div style={{ fontSize: 11, color: '#10b981', marginTop: 4, fontWeight: 600 }}>Zero manual BRS & GST data entry</div>
                      </div>

                      {/* Metric 2 */}
                      <div style={{ background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: 18, borderRadius: 12, border: `1px solid ${bdr}` }}>
                        <div style={{ fontSize: 11.5, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Cashflow Recovery</div>
                        <div style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 900, color: '#38bdf8', marginTop: 4 }}>
                          +35%
                        </div>
                        <div style={{ fontSize: 11, color: '#38bdf8', marginTop: 4, fontWeight: 600 }}>Faster collections via WhatsApp UPI</div>
                      </div>

                      {/* Metric 3 */}
                      <div style={{ background: dk ? 'rgba(255,255,255,0.03)' : '#f8fafc', padding: 18, borderRadius: 12, border: `1px solid ${bdr}`, gridColumn: 'span 2' }}>
                        <div style={{ fontSize: 11.5, color: fg2, fontWeight: 700, textTransform: 'uppercase' }}>Estimated Annual Operational Savings</div>
                        <div style={{ fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 900, color: fg, marginTop: 4 }}>
                          ₹{annualSavings.toLocaleString('en-IN')} <span style={{ fontSize: 14, color: fg2, fontWeight: 600 }}>/ year</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#10b981', marginTop: 4, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <CheckCircle2 size={13} /> Eliminates accounting overtime, reconciliation penalties & lot shrinkage leakage
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onRegister}
                    className="lp-btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 14.5, justifyContent: 'center' }}
                  >
                    <span>Unlock These Savings with Corpvex</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4.2 INTERACTIVE WHATSAPP INVOICING & 1-TAP UPI SIMULATOR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="whatsapp-simulator" style={{
        padding: 'clamp(60px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        background: 'transparent',
        borderBottom: `1px solid ${bdr}`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'center'
          }}>
            {/* Left Column: Explanatory Copy */}
            <div>
              <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: '#25d366', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Smartphone size={15} /> 1-TAP WHATSAPP RECOVERY ENGINE
              </div>
              <h2 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 16 }}>
                Recover Overdue Payments 35% Faster on WhatsApp
              </h2>
              <p style={{ fontSize: 16, color: fg2, lineHeight: 1.65, marginBottom: 24 }}>
                Stop mailing paper bills and chasing late cheques. Corpvex automatically dispatches digitally signed GST invoices with embedded dynamic UPI payment links directly to your buyer’s WhatsApp.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                {[
                  'Automated PDF dispatch instantly upon Tax Invoice generation',
                  'Dynamic UPI QR code pre-filled with the exact voucher amount',
                  '1-Tap payment link compatible with GPay, PhonePe, Paytm & BHIM',
                  'Zero-touch accounting: receipt voucher auto-created and BRS cleared'
                ].map((pt, pIdx) => (
                  <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, color: fg, lineHeight: 1.5 }}>
                    <Check size={16} color="#25d366" style={{ marginTop: 3, flexShrink: 0 }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={onRegister} className="lp-btn-primary" style={{ padding: '12px 26px', fontSize: 14 }}>
                  <span>Enable WhatsApp Invoicing</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Smartphone Mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: 420,
                background: dk ? '#0b141a' : '#ffffff',
                borderRadius: 36,
                border: `8px solid ${dk ? '#1f2c34' : '#e2e8f0'}`,
                boxShadow: dk ? '0 30px 70px rgba(0,0,0,0.7), 0 0 35px rgba(37,211,102,0.15)' : '0 25px 60px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Phone Top Notch */}
                <div style={{ height: 26, background: dk ? '#1f2c34' : '#e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ width: 60, height: 5, borderRadius: 3, background: dk ? '#374248' : '#cbd5e1' }} />
                </div>

                {/* WhatsApp Chat Header */}
                <div style={{
                  padding: '12px 16px',
                  background: dk ? '#202c33' : '#008069',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#ffffff', fontSize: 16 }}>
                    C
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      CORPVEX Dispatch Bot
                      <span style={{ fontSize: 10, background: '#25d366', color: '#000', padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>VERIFIED</span>
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>Official Enterprise Billing Channel</div>
                  </div>
                </div>

                {/* WhatsApp Message Area */}
                <div style={{
                  padding: 16,
                  background: dk ? '#0b141a' : '#efeae2',
                  minHeight: 340,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  {/* Incoming Invoice Message Bubble */}
                  <div style={{
                    alignSelf: 'flex-start',
                    maxWidth: '92%',
                    background: dk ? '#202c33' : '#ffffff',
                    borderRadius: '0 14px 14px 14px',
                    padding: 14,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    color: dk ? '#e9edef' : '#111b21',
                    fontSize: 13,
                    lineHeight: 1.45
                  }}>
                    <div style={{ fontWeight: 700, color: acc, marginBottom: 4 }}>
                      📄 TAX INVOICE #INV-2026-0891
                    </div>
                    <p style={{ margin: '0 0 10px 0' }}>
                      Dear <strong>Shree Krishna Textiles</strong>, your dyeing batch lot #87 is dispatched. Invoice amount: <strong>₹2,57,250.00</strong>.
                    </p>

                    {/* PDF Attachment Card */}
                    <div style={{
                      background: dk ? 'rgba(0,0,0,0.25)' : '#f8fafc',
                      border: `1px solid ${dk ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
                      borderRadius: 8,
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 12
                    }}>
                      <FileText size={24} color="#ef4444" />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          INV-2026-0891_Signed.pdf
                        </div>
                        <div style={{ fontSize: 10, color: fg2 }}>148 KB • IRP Signed QR</div>
                      </div>
                    </div>

                    {/* Dynamic QR Code & Action */}
                    <div style={{ textAlign: 'center', padding: '10px 0', borderTop: `1px dashed ${dk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}>
                      <div style={{ display: 'inline-flex', padding: 6, background: '#ffffff', borderRadius: 8, marginBottom: 10 }}>
                        <QrCode size={90} color="#000000" />
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: fg2, marginBottom: 10 }}>
                        UPI ID: <span style={{ color: acc }}>corpvex@hdfcbank</span>
                      </div>

                      {/* Interactive Button */}
                      {!waPaid ? (
                        <button
                          onClick={() => {
                            setWaProcessing(true);
                            setTimeout(() => {
                              setWaProcessing(false);
                              setWaPaid(true);
                              triggerToast('🎉 WhatsApp UPI Payment of ₹2,57,250 Settled & Auto-Reconciled!');
                            }, 800);
                          }}
                          disabled={waProcessing}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: 8,
                            border: 'none',
                            background: '#25d366',
                            color: '#061118',
                            fontSize: 13,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
                          }}
                        >
                          {waProcessing ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              <span>Processing UPI...</span>
                            </>
                          ) : (
                            <>
                              <span>Pay ₹2,57,250 via 1-Tap UPI</span>
                              <ArrowRight size={14} />
                            </>
                          )}
                        </button>
                      ) : (
                        <div style={{
                          background: dk ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
                          border: '1px solid #10b981',
                          padding: '10px',
                          borderRadius: 8,
                          color: '#10b981',
                          fontWeight: 700,
                          fontSize: 12.5,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <CheckCircle2 size={16} /> PAID & RECONCILED IN LEDGER
                          </div>
                          <div style={{ fontSize: 10.5, color: fg2 }}>Ref: UPI-984210982 · Receipt #RCP-901 Auto-Generated</div>
                          <button
                            onClick={() => setWaPaid(false)}
                            style={{ background: 'none', border: 'none', color: acc, fontSize: 11, cursor: 'pointer', marginTop: 4, textDecoration: 'underline' }}
                          >
                            Reset Demo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. MODULAR ENTERPRISE SUITE — CORPVEX SHOWCASE LAYOUT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="modules" style={{
        padding: 'clamp(60px, 9vh, 110px) clamp(16px, 4vw, 64px)',
        background: 'transparent',
        borderTop: `1px solid ${bdr}`,
        borderBottom: `1px solid ${bdr}`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1680, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: acc, marginBottom: 12 }}>
              MODULAR ENTERPRISE SUITE
            </div>
            <h2 className="lp-serif-title" style={{ fontSize: 'clamp(30px, 4.2vw, 48px)', fontWeight: 700, color: fg, lineHeight: 1.15, marginBottom: 14 }}>
              Explore Dedicated Operational Modules
            </h2>
            <p style={{ fontSize: 16, color: fg2, maxWidth: 640, margin: '0 auto 32px', lineHeight: 1.6 }}>
              Purpose-built for textile processing, garment manufacturing, weaving, and enterprise accounting with live telemetry and zero data congestion.
            </p>

            {/* Search Filter Bar */}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%', maxWidth: 460 }}>
              <Search size={18} color={fg2} style={{ position: 'absolute', left: 16, pointerEvents: 'none', opacity: 0.6 }} />
              <input
                className="lp-modules-search-input"
                type="text"
                placeholder="Filter modules… e.g. Dyeing, Weaving, GST, BRS"
                value={moduleSearch}
                onChange={e => setModuleSearch(e.target.value)}
              />
              {moduleSearch && (
                <button
                  onClick={() => setModuleSearch('')}
                  style={{
                    position: 'absolute', right: 14, background: 'none', border: 'none',
                    cursor: 'pointer', color: fg2, padding: 4, display: 'flex'
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Alternating 2-Column Showcase Blocks (CorpVEX Layout) */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {modules
              .filter(m => {
                if (!moduleSearch.trim()) return true;
                const q = moduleSearch.toLowerCase().trim();
                return (
                  m.title.toLowerCase().includes(q) ||
                  m.category.toLowerCase().includes(q) ||
                  m.desc.toLowerCase().includes(q) ||
                  m.bullets.some(b => b.toLowerCase().includes(q))
                );
              })
              .map((m, idx) => {
                const isCardLeft = idx % 2 === 0;
                const isHovered = hoveredModuleId === m.id;

                const textCol = (
                  <div key="text" className="lp-showcase-text-col" onMouseEnter={() => setHoveredModuleId(m.id)}>
                    <div className="lp-mono-tag" style={{ fontSize: 12, fontWeight: 700, color: acc, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{m.category} / {m.id}</span>
                      {isHovered && (
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${acc}25`, color: acc }}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 3.2vw, 42px)', fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 16 }}>
                      {m.title}
                    </h3>
                    <p style={{ fontSize: 15.5, color: fg2, lineHeight: 1.65, marginBottom: 24, maxWidth: 540 }}>
                      {m.desc}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {m.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14.5, color: isHovered ? fg : fg2, lineHeight: 1.55, transition: 'color 0.25s' }}>
                          <span style={{ color: acc, fontSize: 16, lineHeight: 1.2, flexShrink: 0 }}>•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );

                const widgetCol = (
                  <div key="widget" className="lp-showcase-widget-col">
                    <div
                      className={`lp-showcase-widget ${isHovered ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredModuleId(m.id)}
                      onMouseLeave={() => setHoveredModuleId(null)}
                    >
                      {/* Widget Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `1px dashed ${dk ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`, marginBottom: 18 }}>
                        <span className="lp-mono-tag" style={{ fontSize: 11, fontWeight: 700, color: fg2 }}>
                          {m.widget.headerLeft}
                        </span>
                        <span className="lp-mono-tag lp-live-badge" style={{
                          fontSize: 10.5, fontWeight: 700, padding: '3px 10px', borderRadius: 4,
                          background: `${m.widget.headerRightColor}20`, color: m.widget.headerRightColor,
                          border: `1px solid ${m.widget.headerRightColor}40`
                        }}>
                          {m.widget.headerRight}
                        </span>
                      </div>

                      {/* Widget Data Rows */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {m.widget.rows.map((row, rIdx) => (
                          <div key={rIdx} className="lp-widget-row">
                            <span style={{ color: dk ? '#cbd5e1' : '#334155', fontWeight: 600 }}>{row.label}</span>
                            <span className="lp-mono-tag" style={{
                              fontSize: 14, fontWeight: 700,
                              color: row.highlight ? acc : fg
                            }}>
                              {row.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Widget Progress Bar */}
                      <div style={{ marginTop: 22, paddingTop: 14, borderTop: `1px solid ${dk ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <span className="lp-mono-tag" style={{ fontSize: 10, fontWeight: 700, color: isHovered ? acc : fg2, transition: 'color 0.25s' }}>
                            {m.widget.progressLabel}
                          </span>
                          <span className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: m.widget.progressColor }}>
                            {m.widget.progressPct}%
                          </span>
                        </div>
                        <div style={{ height: 7, borderRadius: 4, background: dk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>
                          <div
                            className="lp-progress-fill"
                            style={{
                              width: modulesProgressTriggered ? `${m.widget.progressPct}%` : '0%',
                              background: `linear-gradient(90deg, ${m.widget.progressColor}, #f59e0b)`,
                              boxShadow: `0 0 14px ${m.widget.progressColor}90`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={m.id}
                    className={`lp-module-showcase-row ${isCardLeft ? 'card-left' : 'card-right'}`}
                    onMouseEnter={() => setHoveredModuleId(m.id)}
                    style={{ borderBottom: `1px solid ${bdr}` }}
                  >
                    {isCardLeft ? (
                      <>
                        {widgetCol}
                        {textCol}
                      </>
                    ) : (
                      <>
                        {textCol}
                        {widgetCol}
                      </>
                    )}
                  </div>
                );
              })}
          </div>

          {/* No Results */}
          {moduleSearch.trim() && modules.filter(m => {
            const q = moduleSearch.toLowerCase().trim();
            return (
              m.title.toLowerCase().includes(q) ||
              m.category.toLowerCase().includes(q) ||
              m.desc.toLowerCase().includes(q) ||
              m.bullets.some(b => b.toLowerCase().includes(q))
            );
          }).length === 0 && (
            <div style={{ textAlign: 'center', padding: '56px 20px', color: fg2 }}>
              <Search size={40} style={{ opacity: 0.3, marginBottom: 14 }} />
              <div style={{ fontSize: 17, fontWeight: 700, color: fg, marginBottom: 6 }}>No matching operational modules</div>
              <div style={{ fontSize: 13.5 }}>Try searching for "Dyeing", "Weaving", "GST", or "BRS"</div>
            </div>
          )}

          {/* CTA Below Grid */}
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <button
              onClick={onRegister}
              className="lp-demo-submit-btn"
              style={{ fontSize: 15, padding: '16px 36px' }}
            >
              <span>Book a Demo</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5.1 TRADITIONAL ERP VS. CORPVEX AI COMPARISON MATRIX
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="comparison" style={{
        padding: 'clamp(60px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        background: dk ? 'rgba(8, 14, 26, 0.5)' : 'rgba(248, 250, 252, 0.7)',
        borderTop: `1px solid ${bdr}`,
        borderBottom: `1px solid ${bdr}`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: acc, marginBottom: 10 }}>
              ARCHITECTURAL ADVANTAGE
            </div>
            <h2 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 14 }}>
              Why Indian Enterprises Upgrade from Legacy ERPs
            </h2>
            <p style={{ fontSize: 16, color: fg2, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
              A direct comparison between traditional desktop accounting software and the modern Corpvex autonomous cloud stack.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="lp-glass-card" style={{ padding: 0, overflow: 'hidden', border: `1px solid ${bdr}` }}>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.2fr',
              gap: 20,
              padding: '18px 24px',
              background: dk ? '#0e1828' : '#f1f5f9',
              borderBottom: `1px solid ${bdr}`,
              fontWeight: 800,
              fontSize: 12.5,
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              <div style={{ color: fg2 }}>Capability / Workflow</div>
              <div style={{ color: '#ef4444' }}>🐢 Legacy Desktop (Tally / Busy)</div>
              <div style={{ color: acc }}>⚡ CORPVEX Cloud ERP</div>
            </div>

            {/* Rows */}
            {[
              {
                feature: 'GST & E-Invoicing (IRP Gateway)',
                legacy: 'Manual JSON exports, portal browser logins, copy-paste schema errors & separate e-Way bill portals.',
                corpvex: '1-Click direct NIC IRP API sync. Real-time signed QR codes, automatic GSTR-1, 2B matching in 1.2s.'
              },
              {
                feature: 'Bank Reconciliation (BRS)',
                legacy: 'Accountants spend 3–4 days manually cross-checking paper bank statements against ledgers. Missed charges.',
                corpvex: '99.4% AI statement parsing across HDFC, ICICI, SBI. Reconciles 5,000+ entries in 3 seconds with zero variance.'
              },
              {
                feature: 'Customer Collections & Receivables',
                legacy: 'Manual phone calls, paper bills mailed via courier, payment follow-ups delayed 45+ days.',
                corpvex: 'Automated WhatsApp dispatch with PDF statements & 1-tap dynamic UPI QR code. Cash turns 35% faster.'
              },
              {
                feature: 'Textile BOM & Shop Floor Jobwork',
                legacy: 'Hand-written challans, untracked lot shrinkage, lost takas, and manual worker piece-rate calculations.',
                corpvex: 'Multi-level BOM, lot-wise yarn shrinkage analytics, barcode scanners, and automated piece-rate worker payroll.'
              },
              {
                feature: 'Audit Trail & MCA Compliance',
                legacy: 'Vouchers can be edited or deleted without immutable audit trails, risking MCA audit penalties.',
                corpvex: 'MCA-compliant immutable audit logs with before/after cryptographic change logs and user IP recording.'
              },
              {
                feature: 'Data Access & Cloud Mobility',
                legacy: 'Locked to one office PC. Frequent hard-disk crashes, sync failures, and vulnerability to ransomware.',
                corpvex: '100% Secure Indian Cloud (AWS Mumbai). ISO 27001 certified. Access securely on PC, Mac, Tablet & Mobile.'
              }
            ].map((row, idx) => (
              <div key={idx} className="lp-comp-row">
                <div style={{ fontWeight: 700, color: fg, fontSize: 14 }}>
                  {row.feature}
                </div>
                <div style={{ color: fg2, fontSize: 13, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{ color: '#ef4444', fontWeight: 900, flexShrink: 0 }}>✕</span>
                  <span>{row.legacy}</span>
                </div>
                <div style={{ color: fg, fontSize: 13, lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Check size={16} color={acc} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{row.corpvex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5.2 EXECUTIVE TESTIMONIALS & VERIFIED ENTERPRISE PROOF
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{
        padding: 'clamp(60px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        background: 'transparent',
        borderBottom: `1px solid ${bdr}`,
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="lp-mono-tag" style={{ fontSize: 11.5, fontWeight: 700, color: acc, marginBottom: 10 }}>
              VERIFIED ENTERPRISE REVIEWS
            </div>
            <h2 className="lp-serif-title" style={{ fontSize: 'clamp(28px, 3.8vw, 44px)', fontWeight: 700, color: fg, lineHeight: 1.2, marginBottom: 14 }}>
              Trusted by India’s Leading Mill Owners & CFOs
            </h2>
            <p style={{ fontSize: 16, color: fg2, maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
              Hear how manufacturing leaders across Gujarat, Maharashtra, and Tamil Nadu streamlined their operations with Corpvex.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24
          }}>
            {[
              {
                quote: 'Before Corpvex, our month-end bank reconciliation took 4 whole days. With Corpvex AI BRS and direct IRP e-invoicing, everything reconciles in minutes. Our factory lot shrinkage is finally under 100% control.',
                author: 'Rajesh K. Shah',
                role: 'Managing Director',
                company: 'Shah Dyeing & Printing Mills (Surat, Gujarat)',
                tag: 'TEXTILE & DYEING'
              },
              {
                quote: 'The WhatsApp payment reminder with instant UPI QR reduced our overdue receivables by 35% within the first month. Our cash flow has never been healthier, and our accountants save 40+ hours every month.',
                author: 'Anand Agrawal',
                role: 'Chief Financial Officer',
                company: 'Agrawal Garment Exports (Ahmedabad, Gujarat)',
                tag: 'GARMENT EXPORTS'
              },
              {
                quote: 'The multi-level BOM and piece-rate worker jobwork module is built specifically for Indian textile operations. Migrating 5 years of historical data from Tally took less than 24 hours with zero downtime.',
                author: 'Suresh R. Nair',
                role: 'Director of Operations',
                company: 'Tirupur Knitwear & Textile Park (Tirupur, Tamil Nadu)',
                tag: 'KNITWEAR & WEAVING'
              }
            ].map((t, idx) => (
              <div key={idx} className="lp-glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Quote size={24} color={acc} style={{ opacity: 0.6 }} />
                    <span className="lp-mono-tag" style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: `${acc}15`, color: acc }}>
                      {t.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 14.5, color: fg, lineHeight: 1.6, fontStyle: 'italic', marginBottom: 24 }}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${acc}, #38bdf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#080e1a', fontSize: 14 }}>
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: fg }}>{t.author}</div>
                    <div style={{ fontSize: 11.5, color: acc, fontWeight: 600 }}>{t.role}</div>
                    <div style={{ fontSize: 11, color: fg2 }}>{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. INDUSTRY BLUEPRINTS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="industries" style={{
        padding: 'clamp(55px, 8vh, 100px) clamp(16px, 4vw, 64px)',
        maxWidth: 1680, margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            INDUSTRY-SPECIFIC ARCHITECTURES
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Engineered for India's Core Growth Sectors
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div key={idx} className="lp-glass-card" style={{ padding: 24 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: `${ind.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={22} color={ind.color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{ind.name}</h3>
                <p style={{ fontSize: 13.5, color: fg2, lineHeight: 1.6 }}>{ind.desc}</p>
              </div>
            );
          })}
        </div>
      </section>



      {/* ═══════════════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" style={{
        padding: 'clamp(55px, 8vh, 95px) clamp(16px, 4vw, 64px)',
        maxWidth: 1200, margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color: acc, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            CLEAR ANSWERS
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="lp-glass-card"
                style={{ padding: '20px 24px', cursor: 'pointer' }}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 800 }}>{faq.q}</span>
                  <ChevronDown size={18} color={acc} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }} />
                </div>
                {isOpen && (
                  <p style={{ fontSize: 14, color: fg2, lineHeight: 1.65, marginTop: 14, borderTop: `1px solid ${bdr}`, paddingTop: 14 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. ENTERPRISE FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${bdr}`,
        padding: '44px clamp(16px, 4vw, 64px) 28px clamp(16px, 4vw, 64px)',
        background: dk ? '#040609' : '#f1f5f9',
        fontSize: 12.5, color: fg2
      }}>
        <div style={{ maxWidth: 1680, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Building2 size={18} color={acc} />
              <span style={{ fontSize: 15, fontWeight: 900, color: fg }}>CORPVEX <span style={{ color: acc }}>ERP</span></span>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: 12 }}>
              Next-generation autonomous ERP and financial intelligence suite built for modern Indian enterprises.
            </p>
            <div style={{ fontSize: 11.5 }}>© 2026 Corpvex Cloud Technologies Pvt Ltd.</div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: fg, marginBottom: 12 }}>Product Modules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>Financial Accounting & BRS</span>
              <span>Multi-Godown Inventory</span>
              <span>Shop Floor Jobwork & BOM</span>
              <span>1-Click GST & e-Invoicing</span>
              <span>WhatsApp Automation & UPI</span>
              <span
                onClick={onNavigateTools}
                style={{ cursor: 'pointer', color: acc, fontWeight: 700, marginTop: 4 }}
              >
                25 Free Business Tools ↗
              </span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: fg, marginBottom: 12 }}>Security & Trust</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span>ISO 27001 Certified Cloud</span>
              <span>MCA Immutable Audit Trail</span>
              <span>256-Bit TLS Bank Encryption</span>
              <span>100% Data Sovereignty (India)</span>
              <span>99.99% SLA Uptime Guarantee</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: fg, marginBottom: 12 }}>Enterprise Contact</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span>support@corpvex.com</span>
              <a href="tel:+918858141463" style={{ color: fg, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={14} color={acc} />
                <span>+918858141463</span>
              </a>
              <span>Surat • Ahmedabad • Mumbai • Bengaluru</span>
            </div>
          </div>
        </div>
      </footer>



      {/* ═══════════════════════════════════════════════════════════════════════
          FULL-FIDELITY INTERACTIVE SOFTWARE SANDBOX STUDIO
          (DASHBOARD, VOUCHER FORMS, AG-GRID REPORTING, MULTI-GODOWN)
      ═══════════════════════════════════════════════════════════════════════ */}
      {demoMode && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: dk ? '#06090e' : '#f1f5f9',
          overflowY: 'auto', display: 'flex', flexDirection: 'column'
        }}>
          {/* Toast Notification Banner */}
          {demoToast && (
            <div style={{
              position: 'fixed', top: 20, right: 20, zIndex: 1300,
              background: '#061118', border: `1px solid ${acc}`, color: '#ffffff',
              padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              boxShadow: `0 10px 30px ${acc}40`, display: 'flex', alignItems: 'center', gap: 10
            }}>
              <CheckCircle2 size={18} color={acc} />
              <span>{demoToast}</span>
            </div>
          )}

          {/* Sandbox Top Header Bar */}
          <div style={{
            padding: '12px 20px', background: dk ? '#0b131c' : '#1e293b', color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${acc} 0%, #0284c7 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Building2 size={18} color="#061118" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>Corpvex Live Simulation</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 50, background: '#f59e0b', color: '#000000', fontWeight: 800 }}>
                    SANDBOX MODE
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  Branch: Surat Main (HQ) • FY 2026-27 • User: Administrator (Full Rights)
                </div>
              </div>
            </div>

            {/* Navigation Tabs between Dashboard, Form, AG-Grid Reporting, Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.25)', padding: 4, borderRadius: 10, overflowX: 'auto' }}>
              <button
                onClick={() => setDemoSection('dashboard')}
                style={{
                  padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  background: demoSection === 'dashboard' ? acc : 'transparent',
                  color: demoSection === 'dashboard' ? '#061118' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                <LayoutDashboard size={15} />
                <span>ERP Dashboard</span>
              </button>

              <button
                onClick={() => setDemoSection('form')}
                style={{
                  padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  background: demoSection === 'form' ? acc : 'transparent',
                  color: demoSection === 'form' ? '#061118' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                <FileText size={15} />
                <span>Sales Voucher Entry</span>
              </button>

              <button
                onClick={() => setDemoSection('reporting')}
                style={{
                  padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  background: demoSection === 'reporting' ? acc : 'transparent',
                  color: demoSection === 'reporting' ? '#061118' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                <FileSpreadsheet size={15} />
                <span>AG-Grid Report Studio</span>
              </button>

              <button
                onClick={() => setDemoSection('stock')}
                style={{
                  padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  background: demoSection === 'stock' ? acc : 'transparent',
                  color: demoSection === 'stock' ? '#061118' : '#cbd5e1',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}
              >
                <Package size={15} />
                <span>Stock Godowns</span>
              </button>
            </div>

            {/* Exit Button */}
            <button
              onClick={() => setDemoMode(false)}
              style={{
                padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: 12.5, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <X size={15} />
              <span>Exit Demo</span>
            </button>
          </div>

          {/* Sandbox Main Workspace Content */}
          <div style={{ flex: 1, padding: 'clamp(16px, 3vw, 32px)', maxWidth: 1400, margin: '0 auto', width: '100%' }}>

            {/* ═════════════════════════════════════════════════════════════
                VIEW 1: EXECUTIVE ERP DASHBOARD
            ═════════════════════════════════════════════════════════════ */}
            {demoSection === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Dashboard KPI Header Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div className="lp-glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Today Sales</span>
                      <ShoppingBag size={18} color={acc} />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>₹2,57,250.00</div>
                    <div style={{ fontSize: 11.5, color: '#10b981', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ArrowUpRight size={14} /> +24% vs yesterday
                    </div>
                  </div>

                  <div className="lp-glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Receivables Due</span>
                      <Clock size={18} color="#f59e0b" />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>₹14,28,650.00</div>
                    <div style={{ fontSize: 11.5, color: '#f59e0b', fontWeight: 700, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Info size={14} /> 3 overdue party ledgers
                    </div>
                  </div>

                  <div className="lp-glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Bank Balance (BRS Sync)</span>
                      <RefreshCw size={18} color="#38bdf8" />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>₹32,15,800.00</div>
                    <div style={{ fontSize: 11.5, color: '#38bdf8', fontWeight: 700, marginTop: 4 }}>
                      HDFC Bank (Auto-Matched)
                    </div>
                  </div>

                  <div className="lp-glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: fg2, textTransform: 'uppercase' }}>Total Stock Valuation</span>
                      <Package size={18} color="#a855f7" />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, marginTop: 8 }}>₹53,99,700.00</div>
                    <div style={{ fontSize: 11.5, color: '#a855f7', fontWeight: 700, marginTop: 4 }}>
                      4 Multi-Location Godowns
                    </div>
                  </div>
                </div>

                {/* Dashboard Middle Section: Visual Charts & Fast Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                  {/* Financial Flow Summary */}
                  <div className="lp-glass-card" style={{ padding: 24 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>Monthly Revenue vs Purchases (FY 2026-27)</span>
                      <BarChart3 size={18} color={acc} />
                    </div>
                    
                    {/* Simulated Bar Chart */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span>August (Current Month)</span>
                          <span style={{ color: acc }}>Sales: ₹48.92 Lakhs | Purchases: ₹28.40 Lakhs</span>
                        </div>
                        <div style={{ width: '100%', height: 12, background: dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: '63%', background: acc, height: '100%' }} />
                          <div style={{ width: '37%', background: '#38bdf8', height: '100%' }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span>July 2026</span>
                          <span>Sales: ₹41.20 Lakhs | Purchases: ₹24.10 Lakhs</span>
                        </div>
                        <div style={{ width: '100%', height: 12, background: dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: '58%', background: acc, height: '100%' }} />
                          <div style={{ width: '42%', background: '#38bdf8', height: '100%' }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                          <span>June 2026</span>
                          <span>Sales: ₹38.60 Lakhs | Purchases: ₹21.80 Lakhs</span>
                        </div>
                        <div style={{ width: '100%', height: 12, background: dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0', borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: '55%', background: acc, height: '100%' }} />
                          <div style={{ width: '45%', background: '#38bdf8', height: '100%' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 18, marginTop: 18, fontSize: 12, color: fg2 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: acc }} /> Gross Sales
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: '#38bdf8' }} /> Raw Material Purchases
                      </span>
                    </div>
                  </div>

                  {/* Fast Voucher & Shortcut Hub */}
                  <div className="lp-glass-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
                        Quick Operational Actions
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <button
                          onClick={() => setDemoSection('form')}
                          style={{
                            padding: '12px', borderRadius: 10, border: `1px solid ${bdr}`,
                            background: dk ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                            color: fg, textAlign: 'left', cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 800, color: acc }}>+ New Tax Invoice</div>
                          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Auto-calculate GST</div>
                        </button>

                        <button
                          onClick={() => { setDemoSection('reporting'); setReportSubTab('invoices'); }}
                          style={{
                            padding: '12px', borderRadius: 10, border: `1px solid ${bdr}`,
                            background: dk ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                            color: fg, textAlign: 'left', cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8' }}>Sales Register</div>
                          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>AG-Grid View</div>
                        </button>

                        <button
                          onClick={() => { setDemoSection('reporting'); setReportSubTab('trial'); }}
                          style={{
                            padding: '12px', borderRadius: 10, border: `1px solid ${bdr}`,
                            background: dk ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                            color: fg, textAlign: 'left', cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#a855f7' }}>Trial Balance</div>
                          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Double-entry check</div>
                        </button>

                        <button
                          onClick={() => setDemoSection('stock')}
                          style={{
                            padding: '12px', borderRadius: 10, border: `1px solid ${bdr}`,
                            background: dk ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                            color: fg, textAlign: 'left', cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>Godown Stock</div>
                          <div style={{ fontSize: 11, color: fg2, marginTop: 2 }}>Real-time valuation</div>
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: 18, padding: 12, borderRadius: 10, background: `${acc}15`, border: `1px solid ${acc}40`, fontSize: 12, color: fg }}>
                      💡 <strong>Live Test:</strong> Click <em>"Sales Voucher Entry"</em> above to add or edit live line items and see real-time recalculations.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                VIEW 2: INTERACTIVE VOUCHER ENTRY FORM
            ═════════════════════════════════════════════════════════════ */}
            {demoSection === 'form' && (
              <form onSubmit={handleSaveVoucher} className="lp-glass-card" style={{ padding: 'clamp(18px, 3vw, 28px)' }}>
                {/* Form Title & Top Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${bdr}`, paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>Sales Tax Invoice Voucher (GST B2B)</div>
                    <div style={{ fontSize: 12, color: fg2 }}>Series: GST-DOMESTIC • Double-entry automatic ledger posting</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleAddLineItem}
                      className="lp-btn-secondary"
                      style={{ padding: '8px 16px', fontSize: 12.5 }}
                    >
                      <Plus size={15} /> Add Line Item
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const sampleInv: DemoInvoiceRow = {
                          id: formVoucherNo,
                          date: formDate,
                          party: formCustomer,
                          gstin: formGstin,
                          city: formCity,
                          itemsCount: formItems.length,
                          taxable: formTaxable,
                          tax: formTax,
                          total: formGrandTotal,
                          status: 'PAID'
                        };
                        setPrintPreviewInvoice(sampleInv);
                      }}
                      className="lp-btn-secondary"
                      style={{ padding: '8px 16px', fontSize: 12.5, borderColor: '#38bdf8' }}
                    >
                      <Printer size={15} color="#38bdf8" /> Print Preview
                    </button>
                    <button
                      type="submit"
                      className="lp-btn-primary"
                      style={{ padding: '8px 20px', fontSize: 12.5 }}
                    >
                      <Check size={15} /> Post & Save Voucher
                    </button>
                  </div>
                </div>

                {/* Form Header Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: fg2, display: 'block', marginBottom: 4 }}>Voucher Number *</label>
                    <input
                      type="text"
                      value={formVoucherNo}
                      onChange={e => setFormVoucherNo(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: fg2, display: 'block', marginBottom: 4 }}>Invoice Date *</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13 }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: fg2, display: 'block', marginBottom: 4 }}>Customer / Ledger Account *</label>
                    <select
                      value={formCustomer}
                      onChange={e => {
                        setFormCustomer(e.target.value);
                        if (e.target.value === 'Shree Krishna Textiles Ltd') {
                          setFormGstin('27AABCS1429B1ZB');
                          setFormCity('Surat, GJ');
                        } else if (e.target.value === 'Apex Garments & Exports') {
                          setFormGstin('33AAACA5678G1Z2');
                          setFormCity('Tirupur, TN');
                        } else {
                          setFormGstin('24AABCB9012H1Z5');
                          setFormCity('Ahmedabad, GJ');
                        }
                      }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13 }}
                    >
                      <option value="Shree Krishna Textiles Ltd">Shree Krishna Textiles Ltd</option>
                      <option value="Apex Garments & Exports">Apex Garments & Exports</option>
                      <option value="Balaji Traders & Distributors">Balaji Traders & Distributors</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 11.5, fontWeight: 700, color: fg2, display: 'block', marginBottom: 4 }}>Buyer GSTIN (Verified)</label>
                    <input
                      type="text"
                      readOnly
                      value={formGstin}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.15)' : '#f1f5f9', color: acc, fontSize: 13, fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Line Items Dynamic Grid */}
                <div style={{ overflowX: 'auto', marginBottom: 20 }}>
                  <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr className="ag-sim-header">
                        <th style={{ textAlign: 'left', width: 40 }}>#</th>
                        <th style={{ textAlign: 'left' }}>Item Description</th>
                        <th style={{ textAlign: 'left', width: 90 }}>HSN</th>
                        <th style={{ textAlign: 'right', width: 90 }}>Qty</th>
                        <th style={{ textAlign: 'center', width: 70 }}>Unit</th>
                        <th style={{ textAlign: 'right', width: 110 }}>Rate (₹)</th>
                        <th style={{ textAlign: 'center', width: 90 }}>GST %</th>
                        <th style={{ textAlign: 'right', width: 130 }}>Line Total (₹)</th>
                        <th style={{ textAlign: 'center', width: 50 }}>Act</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formItems.map((item, idx) => {
                        const lineTaxable = item.qty * item.rate;
                        const lineTotal = lineTaxable * (1 + item.gstRate / 100);
                        return (
                          <tr key={item.id} className="ag-sim-row">
                            <td style={{ textAlign: 'left', color: fg2 }}>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                value={item.name}
                                onChange={e => {
                                  const v = e.target.value;
                                  setFormItems(prev => prev.map(it => it.id === item.id ? { ...it, name: v } : it));
                                }}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: fg, fontSize: 13, fontWeight: 600, outline: 'none' }}
                              />
                            </td>
                            <td style={{ color: fg2 }}>{item.hsn}</td>
                            <td style={{ textAlign: 'right' }}>
                              <input
                                type="number"
                                value={item.qty}
                                onChange={e => handleUpdateItemQty(item.id, Number(e.target.value))}
                                style={{ width: 75, padding: '4px 6px', textAlign: 'right', borderRadius: 6, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13 }}
                              />
                            </td>
                            <td style={{ textAlign: 'center', color: fg2 }}>{item.unit}</td>
                            <td style={{ textAlign: 'right' }}>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={e => handleUpdateItemRate(item.id, Number(e.target.value))}
                                style={{ width: 85, padding: '4px 6px', textAlign: 'right', borderRadius: 6, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 13 }}
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <select
                                value={item.gstRate}
                                onChange={e => {
                                  const r = Number(e.target.value);
                                  setFormItems(prev => prev.map(it => it.id === item.id ? { ...it, gstRate: r } : it));
                                }}
                                style={{ padding: '4px', borderRadius: 6, border: `1px solid ${bdr}`, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', color: fg, fontSize: 12 }}
                              >
                                <option value={0}>0%</option>
                                <option value={5}>5%</option>
                                <option value={12}>12%</option>
                                <option value={18}>18%</option>
                                <option value={28}>28%</option>
                              </select>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 800 }}>
                              ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteLineItem(item.id)}
                                title="Delete Line Item"
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Form Footer Totals */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${bdr}`, paddingTop: 16 }}>
                  <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: fg2 }}>Total Taxable Value:</span>
                      <strong>₹{formTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: fg2 }}>Output GST Tax (CGST + SGST):</span>
                      <strong>₹{formTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 900, borderTop: `1px solid ${bdr}`, paddingTop: 8, color: acc }}>
                      <span>Invoice Total (INR):</span>
                      <span>₹{formGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ═════════════════════════════════════════════════════════════
                VIEW 3: AG-GRID REPORTING STUDIO
            ═════════════════════════════════════════════════════════════ */}
            {demoSection === 'reporting' && (
              <div className="lp-glass-card" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
                {/* Sub-report selector tabs */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${bdr}`, paddingBottom: 14, marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setReportSubTab('invoices')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${reportSubTab === 'invoices' ? acc : bdr}`,
                        background: reportSubTab === 'invoices' ? `${acc}20` : 'transparent',
                        color: reportSubTab === 'invoices' ? fg : fg2, fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Sales Invoices Register ({processedInvoices.length})
                    </button>
                    <button
                      onClick={() => setReportSubTab('stock')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${reportSubTab === 'stock' ? acc : bdr}`,
                        background: reportSubTab === 'stock' ? `${acc}20` : 'transparent',
                        color: reportSubTab === 'stock' ? fg : fg2, fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Stock Valuation Summary ({initialStockItems.length})
                    </button>
                    <button
                      onClick={() => setReportSubTab('trial')}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: `1px solid ${reportSubTab === 'trial' ? acc : bdr}`,
                        background: reportSubTab === 'trial' ? `${acc}20` : 'transparent',
                        color: reportSubTab === 'trial' ? fg : fg2, fontSize: 12.5, fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Trial Balance Ledger ({initialTrialBalance.length})
                    </button>
                  </div>

                  <button
                    onClick={() => triggerToast('Exported active AG-Grid dataset to Excel (.xlsx)')}
                    className="lp-btn-secondary"
                    style={{ padding: '6px 14px', fontSize: 12 }}
                  >
                    <Download size={14} /> Export to Excel
                  </button>
                </div>

                {/* Sub-View: Invoices Grid */}
                {reportSubTab === 'invoices' && (
                  <div>
                    {/* Search & Status Filters */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220, background: dk ? 'rgba(0,0,0,0.3)' : '#ffffff', border: `1px solid ${bdr}`, padding: '6px 12px', borderRadius: 8 }}>
                        <Search size={16} color={fg2} />
                        <input
                          type="text"
                          placeholder="Quick search across party, GSTIN, invoice #..."
                          value={gridSearch}
                          onChange={e => setGridSearch(e.target.value)}
                          style={{ border: 'none', background: 'transparent', color: fg, fontSize: 13, width: '100%', outline: 'none' }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Filter size={15} color={fg2} />
                        {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            style={{
                              padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
                              background: statusFilter === st ? acc : (dk ? 'rgba(255,255,255,0.06)' : '#e2e8f0'),
                              color: statusFilter === st ? '#061118' : fg2
                            }}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Simulated AG-Grid Table */}
                    <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${bdr}` }}>
                      <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr className="ag-sim-header">
                            <th onClick={() => handleSort('id')} style={{ textAlign: 'left' }}>
                              Invoice # {sortCol === 'id' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('date')} style={{ textAlign: 'left' }}>
                              Date {sortCol === 'date' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('party')} style={{ textAlign: 'left' }}>
                              Customer / Entity {sortCol === 'party' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th style={{ textAlign: 'left' }}>GSTIN</th>
                            <th onClick={() => handleSort('taxable')} style={{ textAlign: 'right' }}>
                              Taxable (₹) {sortCol === 'taxable' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('tax')} style={{ textAlign: 'right' }}>
                              GST (₹) {sortCol === 'tax' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th onClick={() => handleSort('total')} style={{ textAlign: 'right' }}>
                              Total (₹) {sortCol === 'total' && (sortAsc ? '▲' : '▼')}
                            </th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedInvoices.map((row, idx) => (
                            <tr key={idx} className="ag-sim-row">
                              <td style={{ fontWeight: 800, color: acc }}>{row.id}</td>
                              <td style={{ color: fg2 }}>{row.date}</td>
                              <td style={{ fontWeight: 700 }}>{row.party}</td>
                              <td style={{ fontFamily: 'monospace', fontSize: 11.5, color: fg2 }}>{row.gstin}</td>
                              <td style={{ textAlign: 'right' }}>₹{row.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td style={{ textAlign: 'right' }}>₹{row.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td style={{ textAlign: 'right', fontWeight: 800 }}>₹{row.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td style={{ textAlign: 'center' }}>
                                <span style={{
                                  padding: '3px 8px', borderRadius: 50, fontSize: 10.5, fontWeight: 800,
                                  background: row.status === 'PAID' ? 'rgba(16, 185, 129, 0.15)' : (row.status === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                                  color: row.status === 'PAID' ? '#10b981' : (row.status === 'PENDING' ? '#f59e0b' : '#ef4444')
                                }}>
                                  {row.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: 6 }}>
                                  <button
                                    onClick={() => setViewInvoiceModal(row)}
                                    title="Quick View Details"
                                    style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${bdr}`, background: 'transparent', color: fg, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => setPrintPreviewInvoice(row)}
                                    title="Open Print Preview"
                                    style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${acc}60`, background: `${acc}15`, color: acc, cursor: 'pointer', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                                  >
                                    <Printer size={12} /> Print
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-View: Stock Summary */}
                {reportSubTab === 'stock' && (
                  <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${bdr}` }}>
                    <table style={{ width: '100%', minWidth: 750, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="ag-sim-header">
                          <th style={{ textAlign: 'left' }}>Item Code</th>
                          <th style={{ textAlign: 'left' }}>Item Description</th>
                          <th style={{ textAlign: 'left' }}>Category</th>
                          <th style={{ textAlign: 'left' }}>Godown</th>
                          <th style={{ textAlign: 'right' }}>Stock Qty</th>
                          <th style={{ textAlign: 'right' }}>Avg Rate (₹)</th>
                          <th style={{ textAlign: 'right' }}>Total Valuation (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initialStockItems.map((stk, idx) => (
                          <tr key={idx} className="ag-sim-row">
                            <td style={{ fontWeight: 800, color: acc }}>{stk.itemCode}</td>
                            <td style={{ fontWeight: 700 }}>{stk.itemName}</td>
                            <td style={{ color: fg2 }}>{stk.category}</td>
                            <td style={{ color: fg2 }}>{stk.godown}</td>
                            <td style={{ textAlign: 'right', fontWeight: 700 }}>{stk.stockQty.toLocaleString()} {stk.unit}</td>
                            <td style={{ textAlign: 'right' }}>₹{stk.avgRate.toFixed(2)}</td>
                            <td style={{ textAlign: 'right', fontWeight: 800 }}>₹{stk.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Sub-View: Trial Balance */}
                {reportSubTab === 'trial' && (
                  <div style={{ overflowX: 'auto', borderRadius: 8, border: `1px solid ${bdr}` }}>
                    <table style={{ width: '100%', minWidth: 650, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr className="ag-sim-header">
                          <th style={{ textAlign: 'left' }}>Account Ledger Name</th>
                          <th style={{ textAlign: 'left' }}>Primary Account Group</th>
                          <th style={{ textAlign: 'right' }}>Debit (₹)</th>
                          <th style={{ textAlign: 'right' }}>Credit (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {initialTrialBalance.map((tb, idx) => (
                          <tr key={idx} className="ag-sim-row">
                            <td style={{ fontWeight: 700 }}>{tb.accountName}</td>
                            <td style={{ color: fg2 }}>{tb.group}</td>
                            <td style={{ textAlign: 'right', fontWeight: tb.debit > 0 ? 800 : 400 }}>
                              {tb.debit > 0 ? `₹${tb.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: tb.credit > 0 ? 800 : 400 }}>
                              {tb.credit > 0 ? `₹${tb.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ═════════════════════════════════════════════════════════════
                VIEW 4: MULTI-GODOWN INVENTORY MATRIX
            ═════════════════════════════════════════════════════════════ */}
            {demoSection === 'stock' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {initialStockItems.map((stk, idx) => (
                  <div key={idx} className="lp-glass-card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: acc }}>{stk.itemCode}</span>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 50, background: stk.stockQty > stk.reorderLevel ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: stk.stockQty > stk.reorderLevel ? '#10b981' : '#ef4444', fontWeight: 800 }}>
                        {stk.stockQty > stk.reorderLevel ? 'IN STOCK' : 'LOW STOCK ALERT'}
                      </span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{stk.itemName}</div>
                    <div style={{ fontSize: 12, color: fg2, marginBottom: 14 }}>Location: {stk.godown}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, borderTop: `1px solid ${bdr}`, paddingTop: 10 }}>
                      <span>Current Qty: <strong>{stk.stockQty} {stk.unit}</strong></span>
                      <span style={{ color: acc, fontWeight: 800 }}>₹{stk.totalValue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Quick View Invoice Modal inside Sandbox */}
          {viewInvoiceModal && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 1400,
              background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
            }}>
              <div className="lp-glass-card" style={{ width: '100%', maxWidth: 540, padding: 24, position: 'relative' }}>
                <button
                  onClick={() => setViewInvoiceModal(null)}
                  style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: fg2, cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
                <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4, color: acc }}>{viewInvoiceModal.id}</div>
                <div style={{ fontSize: 12, color: fg2, marginBottom: 16 }}>Tax Invoice Summary • Verified Document</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, marginBottom: 20 }}>
                  <div><span style={{ color: fg2 }}>Customer:</span> <strong>{viewInvoiceModal.party}</strong></div>
                  <div><span style={{ color: fg2 }}>Date:</span> <strong>{viewInvoiceModal.date}</strong></div>
                  <div><span style={{ color: fg2 }}>GSTIN:</span> <strong>{viewInvoiceModal.gstin}</strong></div>
                  <div><span style={{ color: fg2 }}>Location:</span> <strong>{viewInvoiceModal.city}</strong></div>
                  <div><span style={{ color: fg2 }}>Taxable:</span> <strong>₹{viewInvoiceModal.taxable.toLocaleString('en-IN')}</strong></div>
                  <div><span style={{ color: fg2 }}>Total Amount:</span> <strong style={{ color: acc }}>₹{viewInvoiceModal.total.toLocaleString('en-IN')}</strong></div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      const inv = viewInvoiceModal;
                      setViewInvoiceModal(null);
                      setPrintPreviewInvoice(inv);
                    }}
                    className="lp-btn-primary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <Printer size={15} /> Open Tax Invoice Print Preview
                  </button>
                  <button
                    onClick={() => { triggerToast(`Dispatched invoice PDF to ${viewInvoiceModal.party} via WhatsApp!`); setViewInvoiceModal(null); }}
                    className="lp-btn-secondary"
                    style={{ flex: 1, padding: '10px' }}
                  >
                    <Smartphone size={15} color="#25d366" /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
              FULL A4 TAX INVOICE PRINT PREVIEW MODAL
          ═════════════════════════════════════════════════════════════ */}
          {printPreviewInvoice && (
            <div style={{
              position: 'fixed', inset: 0, zIndex: 1500,
              background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)',
              overflowY: 'auto', padding: '24px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
              {/* Preview Action Header */}
              <div style={{
                width: '100%', maxWidth: 840, marginBottom: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#1e293b', padding: '10px 18px', borderRadius: 10, color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Printer size={18} color={acc} />
                  <span style={{ fontSize: 14, fontWeight: 800 }}>
                    Tax Invoice Print Preview — {printPreviewInvoice.id}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => triggerToast('Document sent to default printer queue')}
                    style={{
                      padding: '6px 14px', borderRadius: 6, border: 'none',
                      background: acc, color: '#061118', fontSize: 12, fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <Printer size={14} /> Print Now
                  </button>
                  <button
                    onClick={() => triggerToast('Downloaded Tax Invoice PDF')}
                    style={{
                      padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button
                    onClick={() => setPrintPreviewInvoice(null)}
                    style={{
                      padding: '6px 10px', borderRadius: 6, border: 'none',
                      background: 'transparent', color: '#94a3b8', cursor: 'pointer'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Realistic A4 Paper Sheet */}
              <div style={{
                width: '100%', maxWidth: 840, background: '#ffffff', color: '#0f172a',
                padding: 'clamp(20px, 4vw, 40px)', borderRadius: 6,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12,
                border: '1px solid #cbd5e1'
              }}>
                {/* Header Banner */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>TAX INVOICE</div>
                  <div style={{ fontSize: 10.5, color: '#475569' }}>(Issued under Section 31 of Central Goods and Services Tax Act, 2017)</div>
                </div>

                {/* Company & Document Header Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, borderBottom: '1px solid #cbd5e1', paddingBottom: 12, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#0f172a' }}>CORPVEX ENTERPRISES INDIA PVT LTD</div>
                    <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.4, marginTop: 4 }}>
                      Plot 42-45, Ring Road Industrial Estate, Surat, Gujarat - 395002<br />
                      <strong>GSTIN:</strong> 24AAACC1234F1Z8 | <strong>State Code:</strong> 24 (Gujarat)<br />
                      <strong>Email:</strong> accounts@corpvex.com | <strong>Phone:</strong> +918858141463
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 11.5 }}>
                    <div><strong>Invoice No:</strong> <span style={{ color: '#0284c7', fontWeight: 800 }}>{printPreviewInvoice.id}</span></div>
                    <div><strong>Dated:</strong> {printPreviewInvoice.date}</div>
                    <div><strong>Place of Supply:</strong> {printPreviewInvoice.city}</div>
                    <div><strong>e-Way Bill No:</strong> 2410 8892 4110</div>
                    <div><strong>IRN Hash:</strong> 8a4f9b2c...7e1a (Signed)</div>
                  </div>
                </div>

                {/* Billed To & Shipped To Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, borderBottom: '1px solid #cbd5e1', paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>BILLED TO (BUYER):</div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{printPreviewInvoice.party}</div>
                    <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>
                      Main Market Yard, {printPreviewInvoice.city}<br />
                      <strong>GSTIN/UIN:</strong> {printPreviewInvoice.gstin}<br />
                      <strong>State:</strong> Gujarat / Maharashtra
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>DISPATCHED / SHIPPED TO:</div>
                    <div style={{ fontSize: 13, fontWeight: 800 }}>{printPreviewInvoice.party} (Godown #2)</div>
                    <div style={{ fontSize: 11, color: '#334155', marginTop: 2 }}>
                      Industrial Sector 4, Logistics Park, {printPreviewInvoice.city}<br />
                      <strong>Transport:</strong> Surat Goods Carrier (Truck GJ-05-AB-1290)<br />
                      <strong>LR No:</strong> LR-88912
                    </div>
                  </div>
                </div>

                {/* Line Items Table */}
                <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                  <table className="tax-inv-table" style={{ width: '100%', borderCollapse: 'collapse', color: '#0f172a' }}>
                    <thead>
                      <tr style={{ background: '#e2e8f0', textAlign: 'left', fontWeight: 800 }}>
                        <th style={{ width: 30 }}>#</th>
                        <th>Description of Goods / Fabric</th>
                        <th style={{ width: 55 }}>HSN</th>
                        <th style={{ width: 55, textAlign: 'right' }}>Qty</th>
                        <th style={{ width: 45, textAlign: 'center' }}>Unit</th>
                        <th style={{ width: 70, textAlign: 'right' }}>Rate (₹)</th>
                        <th style={{ width: 85, textAlign: 'right' }}>Taxable (₹)</th>
                        <th style={{ width: 50, textAlign: 'center' }}>GST%</th>
                        <th style={{ width: 95, textAlign: 'right' }}>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialDemoFormItems.map((item, idx) => {
                        const lineTaxable = item.qty * item.rate;
                        const lineTotal = lineTaxable * (1 + item.gstRate / 100);
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td style={{ fontWeight: 700 }}>{item.name}</td>
                            <td>{item.hsn}</td>
                            <td style={{ textAlign: 'right' }}>{item.qty}</td>
                            <td style={{ textAlign: 'center' }}>{item.unit}</td>
                            <td style={{ textAlign: 'right' }}>{item.rate.toFixed(2)}</td>
                            <td style={{ textAlign: 'right' }}>{lineTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ textAlign: 'center' }}>{item.gstRate}%</td>
                            <td style={{ textAlign: 'right', fontWeight: 800 }}>{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tax Summary & Bank Details Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, borderBottom: '1px solid #cbd5e1', paddingBottom: 14, marginBottom: 14 }}>
                  {/* Bank & UPI QR */}
                  <div style={{ display: 'flex', gap: 12, background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ width: 75, height: 75, background: '#ffffff', borderRadius: 6, border: '1px solid #cbd5e1', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <QrCode size={66} color="#0f172a" />
                    </div>
                    <div style={{ fontSize: 10.5, lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 800, color: '#0284c7', marginBottom: 2 }}>BANK PAYMENT DETAILS:</div>
                      <div><strong>Bank:</strong> HDFC Bank Ltd</div>
                      <div><strong>A/c No:</strong> 50200088991122 (Current)</div>
                      <div><strong>IFSC:</strong> HDFC0000123</div>
                      <div><strong>Branch:</strong> Ring Road, Surat</div>
                    </div>
                  </div>

                  {/* Grand Totals Box */}
                  <div style={{ background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11.5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>Total Taxable Value:</span>
                      <strong>₹{printPreviewInvoice.taxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>CGST Output Tax:</span>
                      <strong>₹{(printPreviewInvoice.tax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#475569' }}>SGST Output Tax:</span>
                      <strong>₹{(printPreviewInvoice.tax / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, borderTop: '2px solid #0f172a', paddingTop: 6, marginTop: 4, color: '#0f172a' }}>
                      <span>Invoice Total (INR):</span>
                      <span style={{ color: '#0284c7' }}>₹{printPreviewInvoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Signatures & Terms */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, alignItems: 'flex-end', paddingTop: 10 }}>
                  <div style={{ fontSize: 10, color: '#64748b', lineHeight: 1.4 }}>
                    <strong>Terms & Conditions:</strong><br />
                    1. Goods once sold will not be accepted back or exchanged.<br />
                    2. Interest @ 18% p.a. will be charged if payment is delayed beyond 30 days.<br />
                    3. All disputes are subject to Surat Jurisdiction only.
                  </div>

                  <div style={{ textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 800 }}>For CORPVEX ENTERPRISES INDIA PVT LTD</div>
                    <div style={{ height: 35, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontStyle: 'italic', fontSize: 12 }}>
                      [ Digitally Signed by Authorized Signatory ]
                    </div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>Authorized Signatory</div>
                    {/* Floating Direct WhatsApp Lead Button */}
                    <a
                      href="https://wa.me/918858141463?text=Hello%20CorpVEX%20Team%2C%20I%20want%20to%20try%20CorpVEX%20ERP%2014-Day%20Free%20Trial%20for%20my%20business."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1100,
                        background: '#25d366',
                        color: '#061118',
                        padding: '12px 20px',
                        borderRadius: 50,
                        fontWeight: 800,
                        fontSize: 13.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none',
                        boxShadow: '0 10px 30px rgba(37, 211, 102, 0.45)',
                        border: '2px solid #ffffff'
                      }}
                    >
                      <Smartphone size={18} />
                      <span>Chat for Free 14-Day Trial</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
