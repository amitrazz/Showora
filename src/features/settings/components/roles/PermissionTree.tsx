import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PermissionNode } from "../../utils/permissionUtils";
import { PermissionCheckbox } from "./PermissionCheckbox";

interface PermissionTreeProps {
  tree: Record<string, PermissionNode>;
  selectedPermissions: Set<string>;
  onChange: (newSet: Set<string>) => void;
  searchQuery: string;
}

export const PermissionTree = ({
  tree,
  selectedPermissions,
  onChange,
  searchQuery,
}: PermissionTreeProps) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(Object.keys(tree)));

  const toggleModule = (mod: string) => {
    const next = new Set(expandedModules);
    if (next.has(mod)) next.delete(mod);
    else next.add(mod);
    setExpandedModules(next);
  };

  const handleToggle = (codes: string[], forceState?: boolean) => {
    const next = new Set(selectedPermissions);
    
    let allSelected = true;
    if (forceState === undefined) {
      for (const code of codes) {
        if (!next.has(code)) {
          allSelected = false;
          break;
        }
      }
    } else {
      allSelected = !forceState; // If forcing true, we pretend it was all false so it toggles to true
    }

    if (allSelected) {
      // Unselect all
      codes.forEach(c => next.delete(c));
    } else {
      // Select all
      codes.forEach(c => next.add(c));
    }

    onChange(next);
  };

  const filteredTree = useMemo(() => {
    if (!searchQuery) return tree;
    const query = searchQuery.toLowerCase();
    
    const result: Record<string, PermissionNode> = {};

    Object.entries(tree).forEach(([modName, modNode]) => {
      const modMatches = modName.toLowerCase().includes(query);
      
      const filteredResources: Record<string, PermissionNode> = {};
      
      Object.entries(modNode.children || {}).forEach(([resName, resNode]) => {
        const resMatches = resName.toLowerCase().includes(query);
        
        const filteredActions: Record<string, PermissionNode> = {};
        Object.entries(resNode.children || {}).forEach(([actName, actNode]) => {
          const actMatches = actName.toLowerCase().includes(query) || (actNode.code && actNode.code.toLowerCase().includes(query));
          
          if (modMatches || resMatches || actMatches) {
            filteredActions[actName] = actNode;
          }
        });

        if (Object.keys(filteredActions).length > 0) {
          filteredResources[resName] = { ...resNode, children: filteredActions };
        }
      });

      if (Object.keys(filteredResources).length > 0) {
        result[modName] = { ...modNode, children: filteredResources };
      }
    });

    return result;
  }, [tree, searchQuery]);

  return (
    <div className="space-y-4">
      {Object.entries(filteredTree).map(([modName, modNode]) => {
        // Collect all action codes in this module
        const modCodes: string[] = [];
        Object.values(modNode.children || {}).forEach(resNode => {
          Object.values(resNode.children || {}).forEach(actNode => {
            if (actNode.code) modCodes.push(actNode.code);
          });
        });

        const modSelectedCount = modCodes.filter(c => selectedPermissions.has(c)).length;
        const modIsAll = modSelectedCount === modCodes.length && modCodes.length > 0;
        const modIsIndeterminate = modSelectedCount > 0 && modSelectedCount < modCodes.length;
        const isExpanded = expandedModules.has(modName);

        return (
          <div key={modName} className="border rounded-xl bg-card overflow-hidden">
            <div 
              className="bg-muted/50 px-4 py-3 flex items-center justify-between cursor-pointer border-b hover:bg-muted/70 transition-colors"
              onClick={() => toggleModule(modName)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                <h3 className="font-semibold text-base capitalize">{modName.replace(/_/g, " ")}</h3>
              </div>
              <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-muted-foreground">{modSelectedCount} / {modCodes.length} selected</span>
                <PermissionCheckbox
                  label="All"
                  checked={modIsAll}
                  indeterminate={modIsIndeterminate}
                  onChange={() => handleToggle(modCodes)}
                />
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(modNode.children || {}).map(([resName, resNode]) => {
                  const resCodes: string[] = [];
                  Object.values(resNode.children || {}).forEach(actNode => {
                    if (actNode.code) resCodes.push(actNode.code);
                  });

                  const resSelectedCount = resCodes.filter(c => selectedPermissions.has(c)).length;
                  const resIsAll = resSelectedCount === resCodes.length && resCodes.length > 0;
                  const resIsIndeterminate = resSelectedCount > 0 && resSelectedCount < resCodes.length;

                  return (
                    <div key={resName} className="space-y-3 bg-muted/20 p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between pb-2 border-b border-border/50">
                        <h4 className="font-medium text-sm text-primary capitalize">{resName.replace(/_/g, " ")}</h4>
                        <PermissionCheckbox
                          label=""
                          checked={resIsAll}
                          indeterminate={resIsIndeterminate}
                          onChange={() => handleToggle(resCodes)}
                        />
                      </div>
                      <div className="space-y-2">
                        {Object.entries(resNode.children || {}).map(([actName, actNode]) => {
                          const code = actNode.code!;
                          return (
                            <PermissionCheckbox
                              key={actName}
                              label={actName}
                              checked={selectedPermissions.has(code)}
                              onChange={() => handleToggle([code])}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {Object.keys(filteredTree).length === 0 && (
        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
          No permissions found matching your search.
        </div>
      )}
    </div>
  );
};
