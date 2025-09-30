import { toast } from 'react-toastify';
import { usePage } from '@inertiajs/react';

export function useAlert() {
  const { locale } = usePage().props;
  const position = locale === 'ar' ? 'bottom-left' : 'bottom-right';

  const showAlert = (message, type = 'info', options = {}) => {
    const defaultOptions = {
      position,
      autoClose: 4000,
      theme: "colored",
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'warning':
        toast.warning(message, defaultOptions);
        break;
      case 'info':
        toast.info(message, defaultOptions);
        break;
      case 'loading':
        toast.info(message, { ...defaultOptions, autoClose: false });
        break;
      default:
        toast(message, defaultOptions);
    }
  };

  const showSuccess = (message, options = {}) => showAlert(message, 'success', options);
  const showError = (message, options = {}) => showAlert(message, 'error', options);
  const showWarning = (message, options = {}) => showAlert(message, 'warning', options);
  const showInfo = (message, options = {}) => showAlert(message, 'info', options);
  const showLoading = (message, options = {}) => showAlert(message, 'loading', options);

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading
  };
}
