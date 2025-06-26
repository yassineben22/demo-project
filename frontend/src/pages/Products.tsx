import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
  setSelectedProduct,
  clearSelectedProduct,
} from '../store/productSlice';
import { ProductCreateRequestData, ProductUpdateRequestData } from '../types/request';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  image?: File;
}

interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
  category?: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    products,
    selectedProduct,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
  } = useAppSelector((state) => state.products);
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [operationCompleted, setOperationCompleted] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    category: '',
  });  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});

  const toastRef = React.useRef<Toast>(null);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);
  useEffect(() => {
    if (!isCreating && !isUpdating && !isDeleting && !error && operationCompleted) {
      setShowDialog(false);
      resetForm();
      setOperationCompleted(false);
      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: isEditMode ? 'Product updated successfully' : 'Product created successfully',
      });
    }
  }, [isCreating, isUpdating, isDeleting, error, operationCompleted, isEditMode]);
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: '',
    });
    setFormErrors({});
    setIsEditMode(false);
    setOperationCompleted(false);
    dispatch(clearSelectedProduct());
  };

  const validateForm = (): boolean => {
    const errors: ProductFormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
      isValid = false;
    }

    if (formData.stockQuantity < 0) {
      errors.stockQuantity = 'Stock quantity cannot be negative';
      isValid = false;
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreate = () => {
    setIsEditMode(false);
    resetForm();
    setShowDialog(true);
  };
  const handleEdit = (product: any) => {
    setIsEditMode(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      category: product.category,
    });
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleDetails = (product: any) => {
    dispatch(setSelectedProduct(product));
    setShowDetailsDialog(true);
  };

  const handleDelete = (product: any) => {
    confirmDialog({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        dispatch(deleteProduct(product.id));
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Product deleted successfully',
        });
      },
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setOperationCompleted(true);

    const productData: ProductCreateRequestData | ProductUpdateRequestData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stockQuantity: formData.stockQuantity,
      category: formData.category,
      image: formData.image,
    };

    if (isEditMode && selectedProduct) {
      dispatch(updateProduct({ id: selectedProduct.id, productData }));
    } else {
      dispatch(createProduct(productData));
    }
  };

  const handleFileSelect = (event: any) => {
    const file = event.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const onFileRemove = () => {
    setFormData(prev => ({ ...prev, image: undefined }));  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="action-buttons">
        <Button
          icon="pi pi-eye"
          className="p-button-rounded p-button-info p-button-sm"
          onClick={() => handleDetails(rowData)}
          tooltip="View Details"
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
        />
      </div>
    );
  };

  const priceBodyTemplate = (rowData: any) => {
    return `$${rowData.price.toFixed(2)}`;
  };
  const imageBodyTemplate = (rowData: any) => {
    return rowData.imageUrl ? (
      <img src={rowData.imageUrl} alt={rowData.name} className="product-image" />
    ) : (
      <div className="product-image-placeholder">
        <i className="pi pi-image"></i>
      </div>
    );
  };
  return (
    <div className="products-page">
      <Toast ref={toastRef} />
      <ConfirmDialog />
      
      <Card>
        <div className="page-header">
          <div className="page-header-left">
            <Button
              icon="pi pi-arrow-left"
              className="p-button-text"
              onClick={() => navigate('/')}
              tooltip="Back to Home"
            />
            <h1 className="page-title">Products Management</h1>
          </div>
          <Button
            label="Add Product"
            icon="pi pi-plus"
            onClick={handleCreate}
            className="p-button-primary"
          />
        </div>

        {error && (
          <Message severity="error" text={error} className="error-message" />
        )}

        {isLoading ? (
          <div className="loading-container">
            <ProgressSpinner />
          </div>        ) : (
          <DataTable
            value={products}
            responsiveLayout="scroll"
            loading={isDeleting}
            emptyMessage="No products found"
          >
            <Column field="imageUrl" header="Image" body={imageBodyTemplate} style={{ width: '80px' }} />
            <Column field="name" header="Name" sortable />
            <Column field="description" header="Description" />
            <Column field="price" header="Price" body={priceBodyTemplate} sortable />
            <Column field="stockQuantity" header="Stock" sortable />
            <Column field="category" header="Category" sortable />
            <Column header="Actions" body={actionBodyTemplate} style={{ width: '160px' }} />
          </DataTable>
        )}
      </Card>

      <Dialog
        header={isEditMode ? 'Edit Product' : 'Add New Product'}
        visible={showDialog}
        onHide={() => {
          setShowDialog(false);
          resetForm();
        }}
        style={{ width: '500px' }}
        modal
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='grid grid-cols-2 my-3'>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name *
            </label>
            <InputText
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full ${formErrors.name ? 'p-invalid' : ''}`}
              placeholder="Enter product name"
            />
            {formErrors.name && (
              <small className="p-error">{formErrors.name}</small>
            )}
          </div>

          <div className='grid grid-cols-2 my-3'>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description *
            </label>
            <InputTextarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full ${formErrors.description ? 'p-invalid' : ''}`}
              placeholder="Enter product description"
              rows={3}
            />
            {formErrors.description && (
              <small className="p-error">{formErrors.description}</small>
            )}
          </div>

          <div className="grid grid-cols-2 my-3">
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price *
              </label>
              <InputNumber
                id="price"
                value={formData.price}
                onValueChange={(e) => setFormData(prev => ({ ...prev, price: e.value || 0 }))}
                className={`w-full ${formErrors.price ? 'p-invalid' : ''}`}
                mode="currency"
                currency="USD"
                locale="en-US"
              />
              {formErrors.price && (
                <small className="p-error">{formErrors.price}</small>
              )}
            </div>

            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium mb-1">
                Stock Quantity *
              </label>
              <InputNumber
                id="stockQuantity"
                value={formData.stockQuantity}
                onValueChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: e.value || 0 }))}
                className={`w-full ${formErrors.stockQuantity ? 'p-invalid' : ''}`}
                min={0}
              />
              {formErrors.stockQuantity && (
                <small className="p-error">{formErrors.stockQuantity}</small>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 my-3">
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category *
            </label>
            <InputText
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={`w-full ${formErrors.category ? 'p-invalid' : ''}`}
              placeholder="Enter product category"
            />
            {formErrors.category && (
              <small className="p-error">{formErrors.category}</small>
            )}
          </div>

          <div className='grid grid-cols-2 my-3'>
            <label className="block text-sm font-medium mb-1">
              Product Image
            </label>
            <FileUpload
              mode="basic"
              accept="image/*"
              maxFileSize={5000000}
              onSelect={handleFileSelect}
              onRemove={onFileRemove}
              chooseLabel="Choose Image"
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              label="Cancel"
              className="p-button-secondary"
              onClick={() => {
                setShowDialog(false);
                resetForm();
              }}
            />
            <Button
              type="submit"
              label={isEditMode ? 'Update' : 'Create'}
              className="p-button-primary"
              loading={isCreating || isUpdating}
            />          </div>
        </form>
      </Dialog>

      <Dialog
        header="Product Details"
        visible={showDetailsDialog}
        onHide={() => {
          setShowDetailsDialog(false);
          dispatch(clearSelectedProduct());
        }}
        style={{ width: '600px' }}
        modal
      >
        {selectedProduct && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              {selectedProduct.imageUrl ? (
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '300px', 
                    objectFit: 'cover', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              ) : (
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  border: '2px dashed #d1d5db'
                }}>
                  <i className="pi pi-image" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Product Name:</label>
                <p style={{ color: '#111827', margin: 0 }}>{selectedProduct.name}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Category:</label>
                <p style={{ color: '#111827', margin: 0 }}>{selectedProduct.category}</p>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Price:</label>
                <p style={{ color: '#10b981', fontWeight: '700', fontSize: '1.125rem', margin: 0 }}>
                  ${selectedProduct.price.toFixed(2)}
                </p>
              </div>
              
              <div>
                <label style={{ fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Stock Quantity:</label>
                <p style={{ 
                  color: selectedProduct.stockQuantity > 0 ? '#10b981' : '#ef4444', 
                  fontWeight: '600', 
                  margin: 0 
                }}>
                  {selectedProduct.stockQuantity} units
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: '600', color: '#374151', display: 'block', marginBottom: '0.25rem' }}>Description:</label>
              <p style={{ color: '#111827', lineHeight: '1.6', margin: 0 }}>{selectedProduct.description}</p>
            </div>

            {selectedProduct.createdAt && (
              <div style={{ 
                paddingTop: '1rem', 
                marginTop: '1rem', 
                borderTop: '1px solid #e5e7eb',
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div>
                  <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Created:</label>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                    {new Date(selectedProduct.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedProduct.updatedAt && (
                  <div>
                    <label style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>Last Updated:</label>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                      {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: '0.5rem', 
              paddingTop: '1rem', 
              marginTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Button
                label="Edit Product"
                icon="pi pi-pencil"
                className="p-button-primary"
                onClick={() => {
                  setShowDetailsDialog(false);
                  handleEdit(selectedProduct);
                }}
              />
              <Button
                label="Close"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => {
                  setShowDetailsDialog(false);
                  dispatch(clearSelectedProduct());
                }}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Products;
