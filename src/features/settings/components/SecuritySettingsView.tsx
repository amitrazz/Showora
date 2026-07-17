import { Shield, Key, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SecuritySettingsView = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-medium tracking-tight">Security & Authentication</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage security policies and two-factor authentication.</p>
      </div>
      
      <div className="space-y-4 max-w-2xl">
        
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Two-Factor Authentication (2FA)</h3>
              <p className="text-sm text-muted-foreground">Enforce 2FA for all administrator accounts.</p>
            </div>
          </div>
          <Button variant="outline">Configure</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Password Policy</h3>
              <p className="text-sm text-muted-foreground">Require strong passwords and 90-day rotations.</p>
            </div>
          </div>
          <Button variant="outline">Configure</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">Manage devices currently logged into Showora.</p>
            </div>
          </div>
          <Button variant="outline">View Sessions</Button>
        </div>

      </div>

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3 max-w-2xl">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-amber-800">Advanced Security Features</h4>
          <p className="text-sm text-amber-700/80 mt-1">IP Whitelisting and SSO integrations (SAML/OIDC) are available on the Enterprise tier. Contact support to upgrade your workspace.</p>
        </div>
      </div>
    </div>
  );
};
