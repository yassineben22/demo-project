import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService } from '../services/productService';
import {
  ProductCreateRequestData,
  ProductUpdateRequestData,
} from '../types/request';
import {
  ProductResponseData,
  ApiErrorResponse,
} from '../types/response';

export const createProduct = createAsyncThunk<
  ProductResponseData,
  ProductCreateRequestData,
  { rejectValue: ApiErrorResponse }
>(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

export const updateProduct = createAsyncThunk<
  ProductResponseData,
  { id: string; productData: ProductUpdateRequestData },
  { rejectValue: ApiErrorResponse }
>(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, productData);
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

export const getProductById = createAsyncThunk<
  ProductResponseData,
  string,
  { rejectValue: ApiErrorResponse }
>(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

export const getAllProducts = createAsyncThunk<
  ProductResponseData[],
  void,
  { rejectValue: ApiErrorResponse }
>(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.responseData;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: ApiErrorResponse }
>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error as ApiErrorResponse);
    }
  }
);

interface ProductState {
  products: ProductResponseData[];
  selectedProduct: ProductResponseData | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setSelectedProduct: (state, action: PayloadAction<ProductResponseData>) => {
      state.selectedProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isCreating = false;
        state.products.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload?.statusLabel || 'Failed to create product';
      });

    builder
      .addCase(updateProduct.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload?.statusLabel || 'Failed to update product';
      });

    builder
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.statusLabel || 'Failed to get product';
      });

    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.statusLabel || 'Failed to get products';
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.products = state.products.filter(p => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload?.statusLabel || 'Failed to delete product';
      });
  },
});

export const { clearError, clearSelectedProduct, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
