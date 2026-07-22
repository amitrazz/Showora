import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "./services";
import { CustomerListOptions } from "./types";
import { CreateCustomerWizardForm } from "./schemas";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const useCustomers = (options: CustomerListOptions = {}) => {
  return useQuery({
    queryKey: ["customers", options],
    queryFn: () => customerService.getCustomers(options),
    placeholderData: keepPreviousData,
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerMetrics = () => {
  return useQuery({
    queryKey: ["customers", "metrics"],
    queryFn: customerService.getMetrics,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateCustomerWizardForm) => customerService.createCustomer(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
      navigate({ to: "/customers/$customerId", params: { customerId: data.id } });
    },
    onError: () => {
      toast.error("Failed to create customer");
    }
  });
};
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: CreateCustomerWizardForm }) => customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    onError: () => {
      toast.error("Failed to update customer");
    }
  });
};

export const useImportCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => customerService.importCustomers(file),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      if (result.success) {
        toast.success('Customers imported successfully', {
          description: `Successfully imported ${result.importedCount} customer(s).`,
        });
      } else {
        if (result.importedCount > 0) {
          toast.warning('Import completed with errors', {
            description: `Imported ${result.importedCount} customer(s), but ${result.failedCount} row(s) failed.`,
          });
        } else {
          toast.error('Import failed', {
            description: `${result.failedCount} row(s) failed to import.`,
          });
        }
      }
    },
    onError: (error: any) => {
      toast.error('Failed to import customers', {
        description: error.response?.data?.message || error.message || 'An error occurred during import.',
      });
    },
  });
};