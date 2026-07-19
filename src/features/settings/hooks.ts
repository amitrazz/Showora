import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from './services';
import { GeneralSettings, OrganizationSettings } from './types';
import { toast } from 'sonner';

export const useGeneralSettings = () => {
  return useQuery({
    queryKey: ['settings', 'general'],
    queryFn: () => settingsService.getGeneralSettings(),
  });
};

export const useUpdateGeneralSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GeneralSettings) => settingsService.updateGeneralSettings(data),
    onSuccess: (settings) => {
      queryClient.setQueryData(['settings', 'general'], settings);
      toast.success('General settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save general settings. Please try again.');
    },
  });
};

export const useOrganizationSettings = () => {
  return useQuery({
    queryKey: ['settings', 'organization'],
    queryFn: () => settingsService.getOrganizationSettings(),
  });
};

export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrganizationSettings) => settingsService.updateOrganizationSettings(data),
    onSuccess: (settings) => {
      queryClient.setQueryData(['settings', 'organization'], settings);
      toast.success('Organization settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save organization settings. Please try again.');
    },
  });
};

export const useNotificationPreferences = () => {
  return useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: () => settingsService.getNotificationPreferences(),
  });
};

export const useAppearanceConfig = () => {
  return useQuery({
    queryKey: ['settings', 'appearance'],
    queryFn: () => settingsService.getAppearanceConfig(),
  });
};

export const useBranches = () => {
  return useQuery({
    queryKey: ['settings', 'branches'],
    queryFn: () => settingsService.getBranches(),
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['settings', 'users'],
    queryFn: () => settingsService.getUsers(),
  });
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['settings', 'audit-logs'],
    queryFn: () => settingsService.getAuditLogs(),
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: ({ module, data }: { module: string, data: any }) => settingsService.updateSettings(module, data),
    onSuccess: (_, variables) => {
      toast.success(`${variables.module} settings saved successfully`);
    },
    onError: () => {
      toast.error('Failed to save settings. Please try again.');
    }
  });
};
