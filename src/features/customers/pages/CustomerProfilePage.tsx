import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useCustomer } from "../hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import { Edit, Mail, Phone, Plus, ShieldCheck, FileText, IndianRupee } from "lucide-react";
import { OverviewTab } from "../components/profile/OverviewTab";
import { TimelineTab } from "../components/profile/TimelineTab";

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
              <Button variant="outline" className="shadow-sm flex-1 sm:flex-none">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
              <Button className="shadow-sm flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" /> New Sale
              </Button>
            </div>
          </div>
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-border/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Lifetime Value</p>
              <p className="text-lg font-semibold">{formatCurrency(customer.lifetimeValue)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Outstanding</p>
              <p className={`text-lg font-semibold ${customer.outstandingAmount > 0 ? "text-destructive" : ""}`}>
                {formatCurrency(customer.outstandingAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Total Purchases</p>
              <p className="text-lg font-semibold">{customer.totalPurchases}</p>
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
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <FileText className="h-10 w-10 mb-4 opacity-50" />
             <p>Purchases ledger coming soon</p>
           </div>
        )}
        {activeTab === "payments" && (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <IndianRupee className="h-10 w-10 mb-4 opacity-50" />
             <p>Payment history coming soon</p>
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
