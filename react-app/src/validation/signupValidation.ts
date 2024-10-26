import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email format').required('Please input your email!'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Please input your password!'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password!'),
});