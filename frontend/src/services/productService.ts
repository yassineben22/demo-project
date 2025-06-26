import { apiService } from './apiService';
import {
  ProductCreateRequestData,
  ProductUpdateRequestData,
  createApiRequest,
} from '../types/request';
import {
  ProductResponseData,
  BaseApiResponse,
} from '../types/response';

class ProductService {
  private readonly PRODUCT_BASE_PATH = '/api/products';

  async createProduct(productData: ProductCreateRequestData): Promise<BaseApiResponse<ProductResponseData>> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('stockQuantity', productData.stockQuantity.toString());
    formData.append('category', productData.category);
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await apiService.getApi().post(
      `${this.PRODUCT_BASE_PATH}/create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  async updateProduct(id: string, productData: ProductUpdateRequestData): Promise<BaseApiResponse<ProductResponseData>> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('stockQuantity', productData.stockQuantity.toString());
    formData.append('category', productData.category);
    
    formData.append('deviceId', '45678');
    formData.append('lang', 'eng');
    formData.append('channel', 'web');
    
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await apiService.getApi().post(
      `${this.PRODUCT_BASE_PATH}/update/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  async getProductById(id: string): Promise<BaseApiResponse<ProductResponseData>> {
    const request = createApiRequest({});
    return apiService.request<ProductResponseData>(
      'POST',
      `${this.PRODUCT_BASE_PATH}/get/${id}`,
      request
    );
  }

  async getAllProducts(): Promise<BaseApiResponse<ProductResponseData[]>> {
    const request = createApiRequest({});
    return apiService.request<ProductResponseData[]>(
      'POST',
      `${this.PRODUCT_BASE_PATH}/get/all`,
      request
    );
  }

  async deleteProduct(id: string): Promise<BaseApiResponse<null>> {
    const request = createApiRequest({});
    return apiService.request<null>(
      'POST',
      `${this.PRODUCT_BASE_PATH}/delete/${id}`,
      request
    );
  }
}

export const productService = new ProductService();
