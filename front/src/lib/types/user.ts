export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  street: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  birthDate: string;
  role: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}
