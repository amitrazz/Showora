import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { GeneralSettingsView } from "../components/GeneralSettingsView";
import { OrganizationSettingsView } from "../components/OrganizationSettingsView";
import { AppearanceSettingsView } from "../components/AppearanceSettingsView";
import { NotificationSettingsView } from "../components/NotificationSettingsView";
import { BranchSettingsView } from "../components/BranchSettingsView";
import { UserSettingsView } from "../components/UserSettingsView";
import { AuditLogsView } from "../components/AuditLogsView";
import { RoleSettingsView } from "../components/RoleSettingsView";
import { SecuritySettingsView } from "../components/SecuritySettingsView";

type SettingsTab =
  | 'general' | 'organization' | 'branch' | 'users' | 'roles'
  | 'sales' | 'inventory' | 'purchases' | 'invoices' | 'expenses' | 'taxes'
  | 'notifications' | 'integrations' | 'appearance' | 'security' | 'audit' | 'backup';

const settingsNav = [
  {
    group: "Workspace",
    items: [
      { id: 'general', label: 'General' },
      { id: 'organization', label: 'Organization' },
      { id: 'branch', label: 'Branches' },
    ]
  },
  {
    group: "Access",
    items: [
      { id: 'users', label: 'Users & Teams' },
      { id: 'roles', label: 'Roles & Permissions' },
      { id: 'security', label: 'Security & Auth' },
    ]
  },
  {
    group: "Modules",
    items: [
      { id: 'sales', label: 'Sales & Quotes' },
      { id: 'inventory', label: 'Inventory & Stock' },
      { id: 'purchases', label: 'Purchasing' },
      { id: 'invoices', label: 'Invoices & Billing' },
      { id: 'expenses', label: 'Expenses' },
      { id: 'taxes', label: 'GST & Taxes' },
    ]
  },
  {
    group: "System",
    items: [
      { id: 'appearance', label: 'Appearance' },
      { id: 'notifications', label: 'Notifications' },
      { id: 'integrations', label: 'Integrations' },
      { id: 'audit', label: 'Audit Logs' },
      { id: 'backup', label: 'Backups' },
    ]
  }
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'general': return <GeneralSettingsView onDirty={() => setHasUnsavedChanges(true)} onSaved={() => setHasUnsavedChanges(false)} />;
      case 'organization': return <OrganizationSettingsView onDirty={() => setHasUnsavedChanges(true)} onSaved={() => setHasUnsavedChanges(false)} />;
      case 'appearance': return <AppearanceSettingsView onDirty={() => setHasUnsavedChanges(true)} />;
      case 'notifications': return <NotificationSettingsView onDirty={() => setHasUnsavedChanges(true)} />;
      case 'branch': return <BranchSettingsView />;
      case 'users': return <UserSettingsView />;
      case 'roles': return <RoleSettingsView />;
      case 'security': return <SecuritySettingsView />;
      case 'audit': return <AuditLogsView />;
      default: return (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in">
          <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Module Settings Under Construction</h2>
          <p className="text-muted-foreground max-w-sm">
            The configuration panel for this specific module is currently being finalized by the engineering team.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] -m-6 bg-background">

      {/* Settings Header */}
      <div className="border-b bg-card px-8 py-5 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Showroom Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization, team members, and preferences.</p>
        </div>
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search settings (Ctrl+K)..." className="pl-9 bg-muted/50 border-none focus-visible:ring-1" />
        </div>
      </div>

      {/* Split-pane Workspace */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left Navigation Sidebar */}
        <div className="w-64 border-r bg-muted/10 overflow-y-auto hidden md:block shrink-0">
          <div className="p-4 space-y-6">
            {settingsNav.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                  {group.group}
                </p>
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Settings Content Area */}
        <div className="flex-1 overflow-y-auto bg-background pb-24">
          <div className="max-w-4xl mx-auto p-8">
            {renderActiveView()}
          </div>
        </div>

        {/* Sticky Save Bar (Vercel Style) */}
        {hasUnsavedChanges && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:ml-32 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-popover border shadow-xl rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium">You have unsaved changes.</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setHasUnsavedChanges(false)}>Reset</Button>
                <Button
                  size="sm"
                  type={activeTab === 'general' || activeTab === 'organization' ? 'submit' : 'button'}
                  form={activeTab === 'general' ? 'general-settings-form' : activeTab === 'organization' ? 'organization-settings-form' : undefined}
                  onClick={activeTab === 'general' || activeTab === 'organization' ? undefined : () => setHasUnsavedChanges(false)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
