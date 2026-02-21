export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordLength = (password: string): boolean =>
  password.length >= 8 && password.length <= 20;

export const validatePasswordPattern = (password: string): boolean =>
  /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
