import React from "react";
import { createRouter, createRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Lazy-loaded Pages
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const DashboardPage = React.lazy(() => import("@/features/dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));

const CustomersPage = React.lazy(() => import("@/features/customers/pages/CustomersPage").then(m => ({ default: m.CustomersPage })));
const CustomerWizardPage = React.lazy(() => import("@/features/customers/pages/CustomerWizardPage").then(m => ({ default: m.CustomerWizardPage })));
const CustomerProfilePage = React.lazy(() => import("@/features/customers/pages/CustomerProfilePage").then(m => ({ default: m.CustomerProfilePage })));

const InventoryPage = React.lazy(() => import("@/features/inventory/pages/InventoryPage").then(m => ({ default: m.InventoryPage })));
const InventoryWizardPage = React.lazy(() => import("@/features/inventory/pages/InventoryWizardPage").then(m => ({ default: m.InventoryWizardPage })));
const InventoryWorkspacePage = React.lazy(() => import("@/features/inventory/pages/InventoryWorkspacePage").then(m => ({ default: m.InventoryWorkspacePage })));

const SalesPage = React.lazy(() => import("@/features/sales/pages/SalesPage").then(m => ({ default: m.SalesPage })));
const SalesWizardPage = React.lazy(() => import("@/features/sales/pages/SalesWizardPage").then(m => ({ default: m.SalesWizardPage })));
const SalesWorkspacePage = React.lazy(() => import("@/features/sales/pages/SalesWorkspacePage").then(m => ({ default: m.SalesWorkspacePage })));

const PurchasePage = React.lazy(() => import("@/features/purchases/pages/PurchasePage").then(m => ({ default: m.PurchasePage })));
const PurchaseWizardPage = React.lazy(() => import("@/features/purchases/pages/PurchaseWizardPage").then(m => ({ default: m.PurchaseWizardPage })));
const PurchaseWorkspacePage = React.lazy(() => import("@/features/purchases/pages/PurchaseWorkspacePage").then(m => ({ default: m.PurchaseWorkspacePage })));

const InvoicePage = React.lazy(() => import("@/features/invoices/pages/InvoicePage").then(m => ({ default: m.InvoicePage })));
const InvoiceWizardPage = React.lazy(() => import("@/features/invoices/pages/InvoiceWizardPage").then(m => ({ default: m.InvoiceWizardPage })));
const InvoiceWorkspacePage = React.lazy(() => import("@/features/invoices/pages/InvoiceWorkspacePage").then(m => ({ default: m.InvoiceWorkspacePage })));

const ExpensePage = React.lazy(() => import("@/features/expenses/pages/ExpensePage").then(m => ({ default: m.ExpensePage })));
const ExpenseWizardPage = React.lazy(() => import("@/features/expenses/pages/ExpenseWizardPage").then(m => ({ default: m.ExpenseWizardPage })));
const ExpenseWorkspacePage = React.lazy(() => import("@/features/expenses/pages/ExpenseWorkspacePage").then(m => ({ default: m.ExpenseWorkspacePage })));

const ReportsDashboardPage = React.lazy(() => import("@/features/reports/pages/ReportsDashboardPage").then(m => ({ default: m.ReportsDashboardPage })));
const SettingsPage = React.lazy(() => import("@/features/settings/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));

// Root Route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout Routes
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  component: AuthLayout,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
});

// App Routes
const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/login",
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: () => {
    window.location.replace("/dashboard");
    return null;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const customersRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/customers",
  component: CustomersPage,
});

const customerNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/customers/new",
  component: CustomerWizardPage,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/customers/$customerId",
  component: CustomerProfilePage,
});

const customerEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/customers/$customerId/edit",
  component: CustomerWizardPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/inventory",
  component: InventoryPage,
});

const inventoryNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/inventory/new",
  component: InventoryWizardPage,
});

const inventoryWorkspaceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/inventory/$inventoryId",
  component: InventoryWorkspacePage,
});

const salesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/sales",
  component: SalesPage,
});

const salesNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/sales/new",
  component: SalesWizardPage,
});

const salesWorkspaceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/sales/$saleId",
  component: SalesWorkspacePage,
});

const purchasesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/purchases",
  component: PurchasePage,
});

const purchasesNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/purchases/new",
  component: PurchaseWizardPage,
});

const purchasesWorkspaceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/purchases/$purchaseId",
  component: PurchaseWorkspacePage,
});

const invoicesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/invoices",
  component: InvoicePage,
});

const invoicesNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/invoices/new",
  component: InvoiceWizardPage,
});

const invoicesWorkspaceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/invoices/$invoiceId",
  component: InvoiceWorkspacePage,
});

const expensesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/expenses",
  component: ExpensePage,
});

const expensesNewRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/expenses/new",
  component: ExpenseWizardPage,
});

const expensesWorkspaceRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/expenses/$expenseId",
  component: ExpenseWorkspacePage,
});

const reportsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/reports",
  component: ReportsDashboardPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const inventoryEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/inventory/$inventoryId/edit",
  component: InventoryWizardPage,
});

const salesEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/sales/$saleId/edit",
  component: SalesWizardPage,
});

const purchasesEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/purchases/$purchaseId/edit",
  component: PurchaseWizardPage,
});

const invoicesEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/invoices/$invoiceId/edit",
  component: InvoiceWizardPage,
});

const expensesEditRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/expenses/$expenseId/edit",
  component: ExpenseWizardPage,
});

// Route Tree
const routeTree = rootRoute.addChildren([
  authRoute.addChildren([loginRoute]),
  dashboardLayoutRoute.addChildren([
    indexRoute,
    dashboardRoute,
    customersRoute,
    customerNewRoute,
    customerProfileRoute,
    customerEditRoute,
    inventoryRoute,
    inventoryNewRoute,
    inventoryWorkspaceRoute,
    inventoryEditRoute,
    salesRoute,
    salesNewRoute,
    salesWorkspaceRoute,
    salesEditRoute,
    purchasesRoute,
    purchasesNewRoute,
    purchasesWorkspaceRoute,
    purchasesEditRoute,
    invoicesRoute,
    invoicesNewRoute,
    invoicesWorkspaceRoute,
    invoicesEditRoute,
    expensesRoute,
    expensesNewRoute,
    expensesWorkspaceRoute,
    expensesEditRoute,
    reportsRoute,
    settingsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
