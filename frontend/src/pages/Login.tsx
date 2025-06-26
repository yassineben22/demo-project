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
import { loginUser, clearError } from '../store/authSlice';
import { LoginRequestData } from '../types/request';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<LoginRequestData>({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState<Record<keyof LoginRequestData, boolean>>({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateField = (name: keyof LoginRequestData, value: any): string | undefined => {
    switch (name) {
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
        if (value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        break;
      default:
        return undefined;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    let isValid = true;    const fieldsToValidate: Array<keyof LoginRequestData> = ['email', 'password'];
    
    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key as keyof LoginRequestData]);
      if (error) {
        newErrors[key as keyof LoginFormErrors] = error;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof LoginRequestData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (formErrors[field as keyof LoginFormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    if (touched[field]) {
      const error = validateField(field, value);
      setFormErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleBlur = (field: keyof LoginRequestData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));    const error = validateField(field, formData[field]);
    setFormErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setTouched({
      email: true,
      password: true
    });

    if (validateForm()) {
      try {
        await dispatch(loginUser(formData)).unwrap();
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <div className="auth-background">
      <Card className="auth-card">
        <h1 className="auth-title">Login</h1>
        
        {error && (
          <Message severity="error" text={error} className="mb-3" style={{ width: '100%' }} />
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="p-field">
            <label htmlFor="email">Email *</label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              className={formErrors.email ? 'p-invalid' : ''}
              disabled={isLoading}
            />
            {formErrors.email && <Message severity="error" text={formErrors.email} className="mt-1" />}
          </div>

          <div className="p-field">
            <label htmlFor="password">Password *</label>
            <Password
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              feedback={false}
              toggleMask
              className={formErrors.password ? 'p-invalid' : ''}
              disabled={isLoading}
            />
            {formErrors.password && <Message severity="error" text={formErrors.password} className="mt-1" />}
          </div>

          <div className="remember-me-container">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked || false)}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe" className="ml-2">Remember me</label>
          </div>

          <Button
            type="submit"
            label={isLoading ? 'Logging in...' : 'Login'}
            icon={isLoading ? undefined : 'pi pi-sign-in'}
            disabled={isLoading}
          >
            {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px' }} strokeWidth="4" />}
          </Button>
        </form>

        <div className="auth-link-container">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
