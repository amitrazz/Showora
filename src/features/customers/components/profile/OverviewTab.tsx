import { Customer } from "../../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Briefcase, FileText, User, Shield } from "lucide-react";
import { format } from "date-fns";

export function OverviewTab({ customer }: { customer: Customer }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Left Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">{customer.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</p>
                <p className="text-sm font-medium">{customer.dob ? format(new Date(customer.dob), 'dd MMM yyyy') : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Gender</p>
                <p className="text-sm font-medium capitalize">{customer.gender || "N/A"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">Address</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    {customer.address.line1}, {customer.address.city}, {customer.address.state} - {customer.address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Identity & KYC
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">PAN Number</p>
                <p className="text-sm font-medium uppercase font-mono">{customer.panNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Aadhar Number</p>
                <p className="text-sm font-medium font-mono">{customer.aadharNumber || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Driving License</p>
                <p className="text-sm font-medium font-mono">{customer.drivingLicense || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">GST Number</p>
                <p className="text-sm font-medium uppercase font-mono">{customer.gstNumber || "Not applicable"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Finance & Meta */}
      <div className="space-y-6">
        <Card className="shadow-soft border-border/50 bg-primary/5 border-primary/10">
          <CardHeader className="pb-4 border-b border-primary/10">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> Finance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {customer.finance.required ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Provider</span>
                  <span className="text-sm font-semibold">{customer.finance.company || "Pending"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Loan Amount</span>
                  <span className="text-sm font-semibold">{customer.finance.loanAmount ? `₹${customer.finance.loanAmount.toLocaleString()}` : "TBD"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">EMI</span>
                  <span className="text-sm font-semibold">{customer.finance.emi ? `₹${customer.finance.emi.toLocaleString()} / mo` : "TBD"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-semibold capitalize px-2 py-1 bg-background rounded-md border">{customer.finance.status || "Processing"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No finance required.</p>
                <p className="text-xs text-muted-foreground mt-1">Cash / Self-financed purchase.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-4 border-b border-border/50">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Internal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Sales Executive</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {customer.salesExecutive[0]}
                  </div>
                  <p className="text-sm font-medium">{customer.salesExecutive}</p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-muted-foreground mb-1">Lead Source</p>
                <p className="text-sm font-medium">{customer.leadSource || "Unknown"}</p>
              </div>
              {customer.notes.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Latest Internal Note</p>
                  <p className="text-sm italic text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border/50">
                    "{customer.notes[0].content}"
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
