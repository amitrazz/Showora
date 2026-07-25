export interface PermissionNode {
  name: string;
  code?: string;
  children?: Record<string, PermissionNode>;
}

/**
 * Parses a flat list of permission strings (e.g. ['crm:customer:read']) into a tree.
 */
export function buildPermissionTreeFromStrings(permissions: string[]): Record<string, PermissionNode> {
  const root: Record<string, PermissionNode> = {};
  
  permissions.forEach(permStr => {
    const parts = permStr.split(':');
    if (parts.length !== 3) return;
    
    const [module, resource, action] = parts;
    
    if (!root[module]) root[module] = { name: module, children: {} };
    if (!root[module].children![resource]) root[module].children![resource] = { name: resource, children: {} };
    root[module].children![resource].children![action] = { name: action, code: permStr };
  });
  
  return root;
}

/**
 * Parses a nested object from PermissionsRegistry into a standard tree.
 * The registry is typically Record<Module, Record<Resource, Record<Action, string>>>
 */
export function buildPermissionTreeFromRegistry(registryData: Record<string, any>): Record<string, PermissionNode> {
  const root: Record<string, PermissionNode> = {};

  Object.entries(registryData).forEach(([moduleName, resources]) => {
    const moduleKey = moduleName.toLowerCase();
    root[moduleKey] = { name: moduleName, children: {} };
    
    Object.entries(resources).forEach(([resourceName, actions]) => {
      const resourceKey = resourceName.toLowerCase();
      root[moduleKey].children![resourceKey] = { name: resourceName, children: {} };
      
      Object.entries(actions as Record<string, string>).forEach(([actionName, permCode]) => {
        const actionKey = actionName.toLowerCase();
        root[moduleKey].children![resourceKey].children![actionKey] = { 
          name: actionName, 
          code: permCode 
        };
      });
    });
  });

  return root;
}
