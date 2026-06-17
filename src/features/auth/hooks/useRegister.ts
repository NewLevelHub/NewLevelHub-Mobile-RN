import { useState } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Routes, type RootStackParamList } from '@/app/navigation/routes';
import { useAuthStore } from '@/core/auth/authStore';
import { ApiException } from '@/core/network/apiException';

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export interface UseRegisterResult {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  emailError: string | undefined;
  firstNameError: string | undefined;
  lastNameError: string | undefined;
  passwordError: string | undefined;
  passwordConfirmError: string | undefined;
  errorMessage: string | undefined;
  isLoading: boolean;
  onEmailChange: (v: string) => void;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onPasswordConfirmChange: (v: string) => void;
  handleSubmit: () => Promise<void>;
}

export function useRegister(
  navigation: NativeStackNavigationProp<RootStackParamList>,
): UseRegisterResult {
  const register = useAuthStore((state) => state.register);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string>();
  const [firstNameError, setFirstNameError] = useState<string>();
  const [lastNameError, setLastNameError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const validate = (): boolean => {
    const trimmedEmail = email.trim();
    const nextEmailError = !trimmedEmail
      ? 'Укажите email'
      : !EMAIL_PATTERN.test(trimmedEmail)
        ? 'Некорректный email'
        : undefined;
    const nextFirstNameError = !firstName.trim() ? 'Укажите имя' : undefined;
    const nextLastNameError = !lastName.trim() ? 'Укажите фамилию' : undefined;
    const nextPasswordError = !password
      ? 'Укажите пароль'
      : password.length < 8
        ? 'Минимум 8 символов'
        : undefined;
    const nextPasswordConfirmError = !passwordConfirm
      ? 'Подтвердите пароль'
      : passwordConfirm !== password
        ? 'Пароли не совпадают'
        : undefined;

    setEmailError(nextEmailError);
    setFirstNameError(nextFirstNameError);
    setLastNameError(nextLastNameError);
    setPasswordError(nextPasswordError);
    setPasswordConfirmError(nextPasswordConfirmError);

    return (
      !nextEmailError &&
      !nextFirstNameError &&
      !nextLastNameError &&
      !nextPasswordError &&
      !nextPasswordConfirmError
    );
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      await register({
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined,
        password,
        password_confirm: passwordConfirm,
      });
      navigation.navigate(Routes.VerifyEmail, { email: email.trim() });
    } catch (error) {
      if (error instanceof ApiException) {
        const fieldEmailError = error.fieldError('email');
        const fieldFirstNameError = error.fieldError('first_name');
        const fieldLastNameError = error.fieldError('last_name');
        const fieldPasswordError = error.fieldError('password');
        const fieldPasswordConfirmError = error.fieldError('password_confirm');

        if (fieldEmailError) setEmailError(fieldEmailError);
        if (fieldFirstNameError) setFirstNameError(fieldFirstNameError);
        if (fieldLastNameError) setLastNameError(fieldLastNameError);
        if (fieldPasswordError) setPasswordError(fieldPasswordError);
        if (fieldPasswordConfirmError) setPasswordConfirmError(fieldPasswordConfirmError);

        const hasFieldError =
          fieldEmailError ??
          fieldFirstNameError ??
          fieldLastNameError ??
          fieldPasswordError ??
          fieldPasswordConfirmError;

        if (!hasFieldError) {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage('Ошибка сети');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onEmailChange = (v: string) => {
    setEmail(v);
    setEmailError(undefined);
    setErrorMessage(undefined);
  };
  const onFirstNameChange = (v: string) => {
    setFirstName(v);
    setFirstNameError(undefined);
  };
  const onLastNameChange = (v: string) => {
    setLastName(v);
    setLastNameError(undefined);
  };
  const onPhoneChange = (v: string) => setPhone(v);
  const onPasswordChange = (v: string) => {
    setPassword(v);
    setPasswordError(undefined);
  };
  const onPasswordConfirmChange = (v: string) => {
    setPasswordConfirm(v);
    setPasswordConfirmError(undefined);
  };

  return {
    email,
    firstName,
    lastName,
    phone,
    password,
    passwordConfirm,
    emailError,
    firstNameError,
    lastNameError,
    passwordError,
    passwordConfirmError,
    errorMessage,
    isLoading,
    onEmailChange,
    onFirstNameChange,
    onLastNameChange,
    onPhoneChange,
    onPasswordChange,
    onPasswordConfirmChange,
    handleSubmit,
  };
}
