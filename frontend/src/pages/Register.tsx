import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser, clearError } from '../store/authSlice';
import { RegisterRequestData } from '../types/request';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    fullName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear Redux error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateField = (name: keyof FormData, value: any): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || value.trim().length < 2) {
          return 'Full name must be at least 2 characters long';
        }
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          return 'Full name can only contain letters and spaces';
        }
        break;

      case 'phoneNumber':
        if (!value || value.trim().length === 0) {
          return 'Phone number is required';
        }
        if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number (at least 10 digits)';
        }
        break;

      case 'email':
        if (!value || value.trim().length === 0) {
          return 'Email is required';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value || value.length === 0) {
          return 'Password is required';
        }
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        break;

      case 'confirmPassword':
        if (!value || value.length === 0) {
          return 'Please confirm your password';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Validate field if it has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));

    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as Record<keyof FormData, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      try {        // Prepare data for API (exclude confirmPassword and agreeTerms)
        const registrationData: RegisterRequestData = {
          fullName: formData.fullName,
          phone: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        };

        await dispatch(registerUser(registrationData)).unwrap();
        // Navigation will be handled by useEffect when isAuthenticated changes
      } catch (error) {
        // Error is handled by Redux and displayed via the error state
        console.error('Registration failed:', error);
      }
    }
  };  return (
    <div className="auth-background">
      <Card className="auth-card">
        <h1 className="auth-title">Register</h1>
        
        {/* Display Redux error */}
        {error && (
          <Message severity="error" text={error} className="mb-3" style={{ width: '100%' }} />
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="p-field">
            <label htmlFor="fullName">Full Name *</label>
            <InputText
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="Enter your full name"
              className={errors.fullName ? 'p-invalid' : ''}
              disabled={isLoading}
            />
            {errors.fullName && <Message severity="error" text={errors.fullName} className="mt-1" />}
          </div>

          <div className="p-field">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <InputText
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              onBlur={() => handleBlur('phoneNumber')}
              placeholder="Enter your phone number"
              className={errors.phoneNumber ? 'p-invalid' : ''}
              disabled={isLoading}
            />
            {errors.phoneNumber && <Message severity="error" text={errors.phoneNumber} className="mt-1" />}
          </div>

          <div className="p-field">
            <label htmlFor="email">Email *</label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              className={errors.email ? 'p-invalid' : ''}
              disabled={isLoading}
            />
            {errors.email && <Message severity="error" text={errors.email} className="mt-1" />}
          </div>

          <div className="p-field">
            <label htmlFor="password">Password *</label>
            <Password
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              toggleMask
              className={errors.password ? 'p-invalid' : ''}
              style={{ width: '100%' }}
              disabled={isLoading}
            />
            {errors.password && <Message severity="error" text={errors.password} className="mt-1" />}
          </div>

          <div className="p-field">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <Password
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Confirm your password"
              feedback={false}
              toggleMask
              className={errors.confirmPassword ? 'p-invalid' : ''}
              style={{ width: '100%' }}
              disabled={isLoading}
            />
            {errors.confirmPassword && <Message severity="error" text={errors.confirmPassword} className="mt-1" />}
          </div>

          <Button
            type="submit"
            label={isLoading ? 'Registering...' : 'Register'}
            icon={isLoading ? undefined : 'pi pi-user-plus'}
            disabled={isLoading}
          >
            {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px' }} strokeWidth="4" />}
          </Button>
        </form>

        <div className="auth-link-container">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
