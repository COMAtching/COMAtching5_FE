export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePasswordLength = (
  password: string,
  minLength = 8,
  maxLength = 20,
): boolean => password.length >= minLength && password.length <= maxLength;

export const validatePasswordPattern = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
  return passwordRegex.test(password);
};
