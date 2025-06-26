// Base API Response DTO
export interface BaseApiResponse<T = any> {
  statusCode: string;
  statusMessage: string | null;
  statusLabel: string;
  responseData: T;
}

// Auth Response DTOs
export interface AuthResponseData {
  token: string;
  email: string;
  fullName: string;
}

// User DTO
export interface UserData {
  email: string;
  fullName: string;
  token: string;
}

// Error Response DTO
export interface ApiErrorResponse {
  statusCode: string;
  statusMessage: string;
  statusLabel: string;
  responseData?: any;
}

// Product Response DTOs
export interface ProductResponseData {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Typed response wrappers
export type LoginResponse = BaseApiResponse<AuthResponseData>;
export type RegisterResponse = BaseApiResponse<AuthResponseData>;

// Typed response wrappers for products
export type CreateProductResponse = BaseApiResponse<ProductResponseData>;
export type UpdateProductResponse = BaseApiResponse<ProductResponseData>;
export type GetProductResponse = BaseApiResponse<ProductResponseData>;
export type GetAllProductsResponse = BaseApiResponse<ProductResponseData[]>;
export type DeleteProductResponse = BaseApiResponse<null>;
