import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useCustomer } from "../hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPaise as formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { Edit, Mail, Phone, Plus, ShieldCheck, FileText, IndianRupee } from "lucide-react";
import { OverviewTab } from "../components/profile/OverviewTab";
import { TimelineTab } from "../components/profile/TimelineTab";
import { useSales } from "../../sales/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "purchases", label: "Purchases" },
  { id: "payments", label: "Payments" },
  { id: "documents", label: "Documents" },
  { id: "timeline", label: "Timeline" },
];

export function CustomerProfilePage() {
  const { customerId } = useParams({ strict: false });
  const { data: customer, isLoading } = useCustomer(customerId as string);
  const [activeTab, setActiveTab] = useState("overview");
  const { data: salesList } = useSales();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div className="p-8 text-center text-muted-foreground">Customer not found</div>;
  }

  const customerSales = salesList?.filter(sale => sale.customerId === customer.id) || [];
  const totalPurchasesCount = customerSales.length || customer.totalPurchases || 0;
  const computedLtv = customerSales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0) || customer.lifetimeValue || 0;
  const computedOutstanding = customerSales.reduce((sum, sale) => sum + (sale.outstandingBalance || 0), 0) || customer.outstandingAmount || 0;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent w-full" />
        
        <div className="px-6 sm:px-10 pb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 mb-6">
            <Avatar className="h-24 w-24 border-4 border-card bg-muted shadow-sm">
              <AvatarFallback className="text-2xl text-primary/80 bg-primary/10">
                {customer.firstName[0]}{customer.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{customer.firstName} {customer.lastName}</h1>
                <div className="flex gap-2">
                  <Badge variant="outline" className={customer.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-transparent" : "bg-muted"}>
                    {customer.status.toUpperCase()}
                  </Badge>
                  {customer.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-primary/5 text-primary/80 hover:bg-primary/10">{tag}</Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-4">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link to="/customers/$customerId/edit" params={{ customerId: customer.id }} className="flex-1 sm:flex-none">
                <Button variant="outline" className="shadow-sm w-full">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </Link>
              <Link to="/sales/new" className="flex-1 sm:flex-none">
                <Button className="shadow-sm w-full">
                  <Plus className="mr-2 h-4 w-4" /> New Sale
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-border/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Lifetime Value</p>
              <p className="text-lg font-semibold">{formatCurrency(computedLtv)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Outstanding</p>
              <p className={`text-lg font-semibold ${computedOutstanding > 0 ? "text-destructive" : ""}`}>
                {formatCurrency(computedOutstanding)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total Purchases</p>
              <p className="text-lg font-semibold">{totalPurchasesCount}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Customer Since</p>
              <p className="text-lg font-semibold">{format(new Date(customer.customerSince), 'MMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-border/50 bg-muted/10 px-6 sm:px-10 flex overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-4 px-4 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "overview" && <OverviewTab customer={customer} />}
        {activeTab === "timeline" && <TimelineTab timeline={customer.timeline} />}
        {activeTab === "purchases" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {customerSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
                <FileText className="h-10 w-10 mb-4 opacity-50" />
                <p>No purchases recorded for this customer yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {customerSales.map((sale) => (
                  <Card key={sale.id} className="shadow-sm border-border/50 bg-card hover:bg-muted/10 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-semibold text-primary">
                          #{sale.id.substring(0, 8).toUpperCase()}
                        </span>
                        <Badge variant="outline" className={sale.delivery.status === 'Completed' ? 'text-emerald-500 bg-emerald-500/10' : ''}>
                          {sale.delivery.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-semibold mt-2">
                        {sale.vehicleMake} {sale.vehicleModel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Price:</span>
                        <span className="font-mono font-medium">{formatCurrency(sale.grandTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Outstanding:</span>
                        <span className={`font-mono font-medium ${sale.outstandingBalance > 0 ? "text-destructive" : "text-emerald-500"}`}>
                          {sale.outstandingBalance > 0 ? formatCurrency(sale.outstandingBalance) : "Paid"}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                        <span>Date: {format(new Date(sale.saleDate), 'dd MMM yyyy')}</span>
                        <Link to="/sales/$saleId" params={{ saleId: sale.id }} className="text-primary hover:underline font-medium">
                          View Details →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "payments" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {customerSales.flatMap(s => s.payments || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
                <IndianRupee className="h-10 w-10 mb-4 opacity-50" />
                <p>No payments recorded for this customer yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerSales.flatMap(s => (s.payments || []).map(p => ({ ...p, vehicleName: `${s.vehicleMake} ${s.vehicleModel}`, saleId: s.id }))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {payment.method} 
                          <Badge variant="outline" className="text-xs bg-muted">{payment.status}</Badge>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ref: {payment.referenceId || 'N/A'} • {payment.vehicleName}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 mt-0.5">
                          {format(new Date(payment.date), 'dd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-medium text-emerald-600">+{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "documents" && (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <ShieldCheck className="h-10 w-10 mb-4 opacity-50" />
             <p>Document vault coming soon</p>
           </div>
        )}
      </div>
    </div>
  );
}
