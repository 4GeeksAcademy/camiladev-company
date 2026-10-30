export interface AuthProfile {
  id: string;
  user_id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  profile: AuthProfile | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
}

export interface ProfileUpdateInput {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export type FieldErrors<T> = Partial<Record<keyof T | "form", string>>;
