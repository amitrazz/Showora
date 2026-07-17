import { useState } from "react";
import { OverviewView } from "../components/OverviewView";
import { SalesView } from "../components/SalesView";
import { FinanceView } from "../components/FinanceView";
import { InventoryView } from "../components/InventoryView";
import { CustomersView } from "../components/CustomersView";
import { PurchasesView } from "../components/PurchasesView";
import { ExpensesView } from "../components/ExpensesView";
import { TaxesView } from "../components/TaxesView";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, LineChart, PieChart, Users, Package, 
  ShoppingBag, Wallet, FileText, Download, Calendar, MapPin 
} from "lucide-react";

type ReportTab = 'overview' | 'sales' | 'inventory' | 'customers' | 'purchases' | 'expenses' | 'finance' | 'taxes';

const navItems: { id: ReportTab, label: string, icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
  { id: 'sales', label: 'Sales & Revenue', icon: <LineChart className="h-4 w-4" /> },
  { id: 'inventory', label: 'Inventory Health', icon: <Package className="h-4 w-4" /> },
  { id: 'customers', label: 'Customer Insights', icon: <Users className="h-4 w-4" /> },
  { id: 'purchases', label: 'Purchases & Suppliers', icon: <ShoppingBag className="h-4 w-4" /> },
  { id: 'expenses', label: 'Operating Expenses', icon: <Wallet className="h-4 w-4" /> },
  { id: 'finance', label: 'Finance & Profitability', icon: <PieChart className="h-4 w-4" /> },
  { id: 'taxes', label: 'GST & Taxes', icon: <FileText className="h-4 w-4" /> },
];

export function ReportsDashboardPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <OverviewView />;
      case 'sales': return <SalesView />;
      case 'inventory': return <InventoryView />;
      case 'customers': return <CustomersView />;
      case 'purchases': return <PurchasesView />;
      case 'expenses': return <ExpensesView />;
      case 'finance': return <FinanceView />;
      case 'taxes': return <TaxesView />;
      default: return (
        <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10 animate-in fade-in">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
             {navItems.find(i => i.id === activeTab)?.icon}
          </div>
          <h3 className="text-lg font-medium">Report Under Construction</h3>
          <p className="text-sm text-muted-foreground max-w-sm text-center mt-2">
            The detailed analytics view for {navItems.find(i => i.id === activeTab)?.label} is currently being built. 
            Check back soon for deeper BI insights.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-6 animate-in fade-in duration-500">
      
      {/* Global Reports Header */}
      <div className="border-b bg-card px-6 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground">Gain insights into sales, inventory, and profitability.</p>
        </div>
        
        {/* Global Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Button variant="outline" size="sm" className="shadow-sm whitespace-nowrap">
            <Calendar className="mr-2 h-4 w-4" /> Last 12 Months
          </Button>
          <Button variant="outline" size="sm" className="shadow-sm whitespace-nowrap">
            <MapPin className="mr-2 h-4 w-4" /> All Branches
          </Button>
          <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
          <Button className="shadow-sm whitespace-nowrap bg-indigo-600 hover:bg-indigo-700">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Split-pane Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Reports Left Navigation */}
        <div className="w-64 border-r bg-muted/10 overflow-y-auto hidden md:block shrink-0">
          <div className="p-4 space-y-1">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Dashboards</p>
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-6">Financials</p>
            {navItems.slice(4).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden border-b p-4 shrink-0 bg-background">
          <select 
            value={activeTab} 
            onChange={(e) => setActiveTab(e.target.value as ReportTab)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {navItems.map(item => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Main Report Content Area */}
        <div className="flex-1 overflow-y-auto bg-background/50">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </div>

      </div>
    </div>
  );
}
