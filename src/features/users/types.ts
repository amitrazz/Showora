export interface UserItem {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  isVerified: boolean;
  organizationId: string | null;
  createdAt: string;
  roles: string[];
}
