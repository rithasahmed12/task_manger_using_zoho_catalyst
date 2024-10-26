import React from 'react';
import { Layout, Button, Form, Input, Typography } from 'antd';
import { signup } from '../api/authApi';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slice/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { signupValidationSchema } from '../validation/signupValidation';

const { Content } = Layout;
const { Title } = Typography;

const SignupForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async (values: { email: string; password: string }) => {
        const loadingToast = toast.loading('Signing...');
        try {
            const response = await signup(values);
            dispatch(setUser(response.id));
            navigate('/app/dashboard');
            toast.success('Signup successful!',{id:loadingToast});
        } catch (error) {
            console.error('Signup failed:', error);
            const errorMessage = (error as any).response?.data?.message || (error as any).response.data.errors[0].msg  || 'An unknown error occurred';
            toast.error(errorMessage,{id:loadingToast});
        }
    };

    return (
        <Layout className="min-h-screen">
            <Content className="flex justify-center items-center p-4">
                <Formik
                    initialValues={{ email: '', password: '', confirmPassword: '' }}
                    validationSchema={signupValidationSchema}
                    onSubmit={handleSignup}
                >
                    {({ handleSubmit, handleChange, values, errors, touched }) => (
                        <Form
                            onFinish={handleSubmit}
                            layout="vertical"
                            className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
                        >
                            <Title level={3} className="text-center mb-4">TaskHive Signup</Title>
                            
                            <Form.Item label="Email" validateStatus={touched.email && errors.email ? 'error' : ''} help={touched.email && errors.email ? errors.email : ''}>
                                <Input name="email" placeholder="Enter your email" onChange={handleChange} value={values.email} />
                            </Form.Item>
                            <Form.Item label="Password" validateStatus={touched.password && errors.password ? 'error' : ''} help={touched.password && errors.password ? errors.password : ''}>
                                <Input.Password name="password" placeholder="Enter your password" onChange={handleChange} value={values.password} />
                            </Form.Item>
                            <Form.Item label="Confirm Password" validateStatus={touched.confirmPassword && errors.confirmPassword ? 'error' : ''} help={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ''}>
                                <Input.Password name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} value={values.confirmPassword} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="w-full">
                                    Signup
                                </Button>
                            </Form.Item>
                            <div className="text-center">
                                <span>Already have an account? </span><Link to="/app/">Login</Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Content>
        </Layout>
    );
};

export default SignupForm;
