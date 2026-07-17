import { createRouter, createRoute, createRootRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { LoginPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { CustomersPage, CustomerWizardPage, CustomerProfilePage } from "@/features/customers";
import { InventoryPage, InventoryWizardPage, InventoryWorkspacePage } from "@/features/inventory";
import { SalesPage, SalesWizardPage, SalesWorkspacePage } from "@/features/sales";
import { PurchasePage, PurchaseWizardPage, PurchaseWorkspacePage } from "@/features/purchases";
import { InvoicePage, InvoiceWizardPage, InvoiceWorkspacePage } from "@/features/invoices";
import { ExpensePage, ExpenseWizardPage, ExpenseWorkspacePage } from "@/features/expenses";
import { ReportsDashboardPage } from "@/features/reports";
import { SettingsPage } from "@/features/settings";
import { Outlet } from "@tanstack/react-router";

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
    salesRoute,
    salesNewRoute,
    salesWorkspaceRoute,
    purchasesRoute,
    purchasesNewRoute,
    purchasesWorkspaceRoute,
    invoicesRoute,
    invoicesNewRoute,
    invoicesWorkspaceRoute,
    expensesRoute,
    expensesNewRoute,
    expensesWorkspaceRoute,
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
