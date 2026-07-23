import { useQuery } from "@tanstack/react-query";
import { usersService } from "./services";

export function useUsers(role?: string) {
  return useQuery({
    queryKey: ["users", role],
    queryFn: () => usersService.getUsers(role),
  });
}

export function useSalesExecutives() {
  return useUsers("SALES_EXECUTIVE");
}
