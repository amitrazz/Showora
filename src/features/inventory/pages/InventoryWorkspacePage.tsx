import { useState } from "react";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { SkeletonProfilePage } from "@/components/ui/skeleton/SkeletonTemplates";
import { useInventoryVehicle } from "../hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { format, formatDistanceToNow } from "date-fns";
import { Truck, MapPin, Building, MoreHorizontal, FileText, IndianRupee, Shield, ArrowRightLeft, PenTool, CheckCircle, Clock, Pencil, Copy, Printer, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "movement", label: "Movement History" },
  { id: "allocation", label: "Allocation" },
  { id: "documents", label: "Documents" },
  { id: "service", label: "Service History" },
  { id: "timeline", label: "Timeline" },
];

export function InventoryWorkspacePage() {
  const { inventoryId } = useParams({ strict: false });
  const { data: vehicle, isLoading } = useInventoryVehicle(inventoryId as string);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonProfilePage />;
  }

  if (!vehicle) {
    return <div className="p-8 text-center text-muted-foreground">Vehicle not found</div>;
  }

  const statusVariants: Record<string, string> = {
    'Available': "bg-emerald-500/10 text-emerald-500 border-transparent",
    'Reserved': "bg-amber-500/10 text-amber-500 border-transparent",
    'Allocated': "bg-blue-500/10 text-blue-500 border-transparent",
    'Delivered': "bg-purple-500/10 text-purple-500 border-transparent",
    'In Transit': "bg-orange-500/10 text-orange-500 border-transparent",
    'Under Service': "bg-destructive/10 text-destructive border-transparent",
  };

  const handleReserve = () => {
    toast.success(`Vehicle VIN #${vehicle.vin} has been marked as Reserved.`);
  };

  const handleAllocate = () => {
    toast.success(`Vehicle VIN #${vehicle.vin} allocated to active sales pipeline.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header Profile Card */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        
        <div className="px-6 sm:px-10 py-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="h-20 w-20 bg-muted border border-border/50 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="h-10 w-10 text-muted-foreground/50" />
            </div>
            
            <div className="flex-1 space-y-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight">{vehicle.make} {vehicle.model}</h1>
                    <Badge variant="outline" className={statusVariants[vehicle.status] || "bg-muted"}>
                      {vehicle.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-4">
                    <span className="font-medium text-foreground">{vehicle.variant}</span>
                    <span className="flex items-center gap-1">• {vehicle.color}</span>
                    <span className="hidden sm:flex items-center gap-1 font-mono">• VIN: {vehicle.vin}</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {vehicle.status === 'Available' && (
                    <Button variant="outline" className="shadow-sm" onClick={handleReserve}>
                      Reserve
                    </Button>
                  )}
                  {['Available', 'Reserved'].includes(vehicle.status) && (
                    <Button className="shadow-sm" onClick={handleAllocate}>
                      Allocate
                    </Button>
                  )}
                  <Link to="/inventory/$inventoryId/edit" params={{ inventoryId: vehicle.id }}>
                    <Button variant="outline" className="shadow-sm">
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="border shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="right">
                      <DropdownMenuItem onClick={() => {
                        navigator.clipboard.writeText(vehicle.vin);
                        toast.success("VIN copied to clipboard!");
                      }}>
                        <Copy className="h-4 w-4 mr-2" /> Copy VIN
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-2" /> Print Spec Sheet
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onClick={() => {
                        toast.success("Vehicle status updated to Archived.");
                        navigate({ to: "/inventory" });
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Archive Vehicle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 mt-6 border-t border-border/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Current Location</p>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <p className="text-sm font-semibold">{vehicle.location}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Stock Age</p>
              <p className={`text-sm font-semibold ${vehicle.daysInInventory > 90 ? 'text-destructive' : ''}`}>
                {vehicle.daysInInventory} Days
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Cost / MRP</p>
              <p className="text-sm font-semibold">{formatCurrency(vehicle.purchaseCost)} / {formatCurrency(vehicle.mrp)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">Supplier</p>
              <p className="text-sm font-semibold truncate" title={vehicle.supplier}>{vehicle.supplier}</p>
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
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" /> Vehicle Specifics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Make & Model</p>
                      <p className="text-sm font-medium">{vehicle.make} {vehicle.model}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Variant & Color</p>
                      <p className="text-sm font-medium">{vehicle.variant} - {vehicle.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Fuel & Transmission</p>
                      <p className="text-sm font-medium">{vehicle.fuelType} • {vehicle.transmission}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Manufacturing Year</p>
                      <p className="text-sm font-medium">{vehicle.manufacturingYear}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" /> Identification Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">VIN Number</p>
                      <p className="text-sm font-medium uppercase font-mono">{vehicle.vin}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Engine Number</p>
                      <p className="text-sm font-medium uppercase font-mono">{vehicle.engineNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Chassis Number</p>
                      <p className="text-sm font-medium uppercase font-mono">{vehicle.chassisNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-soft border-border/50">
                <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> Purchase Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Supplier</span>
                      <span className="text-sm font-semibold truncate max-w-[150px]">{vehicle.supplier}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Date</span>
                      <span className="text-sm font-semibold">{format(new Date(vehicle.purchaseDate), 'dd MMM yyyy')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Invoice</span>
                      <span className="text-sm font-mono font-semibold">{vehicle.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">PO Number</span>
                      <span className="text-sm font-mono font-semibold">{vehicle.purchaseOrderNumber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft border-border/50 bg-primary/5 border-primary/10">
                <CardHeader className="pb-4 border-b border-primary/10">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" /> Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Purchase Cost</span>
                      <span className="text-sm font-mono font-semibold text-destructive">{formatCurrency(vehicle.purchaseCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">GST (Input)</span>
                      <span className="text-sm font-mono font-semibold">{formatCurrency(vehicle.gstAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Selling Price</span>
                      <span className="text-sm font-mono font-semibold text-emerald-600">{formatCurrency(vehicle.sellingPrice)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "movement" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium">Movement History</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Vehicle Transfer initialized", { description: "Select destination warehouse in Settings > Branches." })}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" /> New Transfer
                </Button>
              </div>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {vehicle.movementHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted z-10 shrink-0">
                      <Truck className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 bg-card rounded-xl border border-border/50 p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{event.type}</h4>
                          <p className="text-xs text-muted-foreground">{event.fromLocation ? `${event.fromLocation} → ` : ''}{event.toLocation || 'N/A'}</p>
                        </div>
                        <time className="text-xs text-muted-foreground">{format(new Date(event.date), 'dd MMM yyyy, HH:mm')}</time>
                      </div>
                      <p className="text-sm text-muted-foreground">By {event.user}: {event.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "timeline" && (
          <Card className="shadow-soft border-border/50 animate-in fade-in duration-500">
            <CardContent className="p-6 sm:p-10">
              <h3 className="text-lg font-medium mb-8">Activity Timeline</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {vehicle.timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-primary/10 z-10 shrink-0">
                      <Clock className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <time className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</time>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "allocation" && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             {vehicle.allocation ? (
               <div className="space-y-4 text-center">
                 <CheckCircle className="h-10 w-10 mx-auto text-emerald-500" />
                 <div>
                   <h3 className="text-lg font-medium text-foreground">Allocated to {vehicle.allocation.customerName}</h3>
                   <p className="text-sm mt-1">Expected Delivery: {format(new Date(vehicle.allocation.expectedDelivery), 'dd MMM yyyy')}</p>
                   <p className="text-sm">Exec: {vehicle.allocation.salesExecutive}</p>
                 </div>
               </div>
             ) : (
               <>
                 <Building className="h-10 w-10 mb-4 opacity-50" />
                 <p>Vehicle is currently unallocated.</p>
                 <Button className="mt-4 shadow-sm" onClick={handleAllocate}>Allocate to Customer</Button>
               </>
             )}
          </div>
        )}

        {activeTab === "documents" && (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <FileText className="h-10 w-10 mb-4 opacity-50" />
             <p>Document vault for vehicle coming soon</p>
           </div>
        )}

        {activeTab === "service" && (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border rounded-2xl bg-card border-dashed">
             <PenTool className="h-10 w-10 mb-4 opacity-50" />
             <p>Service & PDI history coming soon</p>
           </div>
        )}
      </div>
    </div>
  );
}
