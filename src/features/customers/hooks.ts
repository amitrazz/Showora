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