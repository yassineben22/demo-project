// Base request structure for all API calls
export interface BaseApiRequest<T = any> {
  referenceData: {
    deviceId: string;
    lang: string;
  };
  requestData: T;
}

// Auth Request DTOs
export interface LoginRequestData {
  email: string;
  password: string;
}

export interface RegisterRequestData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

// Product Request DTOs
export interface ProductRequestData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
}

export interface ProductCreateRequestData extends ProductRequestData {
  image?: File;
}

export interface ProductUpdateRequestData extends ProductRequestData {
  image?: File;
}

// Typed request wrappers
export type LoginRequest = BaseApiRequest<LoginRequestData>;
export type RegisterRequest = BaseApiRequest<RegisterRequestData>;

// Typed request wrappers for products
export type CreateProductRequest = BaseApiRequest<ProductCreateRequestData>;
export type UpdateProductRequest = BaseApiRequest<ProductUpdateRequestData>;
export type GetProductRequest = BaseApiRequest<{}>;
export type GetAllProductsRequest = BaseApiRequest<{}>;
export type DeleteProductRequest = BaseApiRequest<{}>;

// Helper function to create requests with default reference data
export const createApiRequest = <T>(requestData: T, deviceId?: string, lang?: string): BaseApiRequest<T> => {
  return {
    referenceData: {
        deviceId: deviceId || "00000",
        lang: lang || "eng", 
    },
    requestData,
  };
};
