import { api } from "@/lib/api";
import { UserItem } from "./types";

export const usersService = {
  getUsers: async (role?: string): Promise<UserItem[]> => {
    const response = await api.get<UserItem[]>("/users", {
      params: role ? { role } : undefined,
    });
    return response.data;
  },
};
