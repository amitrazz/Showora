import { LoginFormData } from "./schemas";
import { api } from "@/lib/api";
import { User } from "@/store";

interface LoginResponse {
  accessToken: string;
}

export const loginService = async (data: LoginFormData): Promise<{ user: User; accessToken: string }> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  const { accessToken } = response.data;

  // Basic JWT decoding for UI purposes
  let user: User;
  try {
    const payloadBase64 = accessToken.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    user = {
      id: decodedPayload.sub || "usr_1",
      name: decodedPayload.name || decodedPayload.email.split('@')[0],
      email: decodedPayload.email,
      role: decodedPayload.roles[0] || "user",
      organizationId: decodedPayload.organizationId
    };
  } catch {
    throw new Error("Failed to parse access token");
  }

  return { user, accessToken };
};

export const logoutService = async () => {
  await api.post('/auth/logout');
};
