import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Please input your email!'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Please input your password!'),
});
