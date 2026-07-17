import { useMutation } from "@tanstack/react-query";
import { loginService, logoutService } from "./services";
import { LoginFormData } from "./schemas";
import { useAuthStore } from "@/store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginFormData) => loginService(data),
    onSuccess: (data) => {
      login(data.user, data.accessToken);
      toast.success("Successfully logged in");
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logoutService(),
    onSuccess: () => {
      logout();
      navigate({ to: "/login" });
    },
    onError: () => {
      // Even if API fails, log them out locally
      logout();
      navigate({ to: "/login" });
    }
  });
};
