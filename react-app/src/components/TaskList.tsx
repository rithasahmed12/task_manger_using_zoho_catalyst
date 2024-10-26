import React, { useEffect, useState, useCallback } from 'react';
import { Layout, Button, Modal, Form, Input, Select, Space, Pagination } from 'antd';
import { LogoutOutlined, PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { toast } from 'react-hot-toast';
import TaskItem from './TaskItem';
import { Task, TaskForm } from '../types/tasksTypes';
import { createTask, deleteTask, fetchTasks } from '../api/tasksApi';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;
const { Option } = Select;

const TaskList: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLogoutVisible, setIsLogoutVisible] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'completed' | 'pending' | 'all'>('all');
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [form] = Form.useForm<TaskForm>();

    const userId = useSelector((state:any) => state.user.userInfoTh);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Create a debounced search function
    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setSearchTerm(value);
        }, 300),
        []
    );

    // Memoize the filter function to prevent unnecessary rerenders
    const filterTasks = useCallback(() => {
        const filtered = tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
        setFilteredTasks(filtered);
    }, [tasks, searchTerm, statusFilter]);

    // Update filtered tasks whenever the dependencies change
    useEffect(() => {
        filterTasks();
    }, [filterTasks]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Adjust page size based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setPageSize(4);
            } else if (window.innerWidth < 1024) {
                setPageSize(6);
            } else {
                setPageSize(9);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Component cleanup
    useEffect(() => {
        return () => {
            debouncedSetSearch.cancel();
        };
    }, [debouncedSetSearch]);

    // Fetch tasks
    useEffect(() => {
        const getTasks = async () => {
            const loadingToast = toast.loading('Loading your tasks...');
            try {
                const response = await fetchTasks(userId);
                setTasks(response.tasks);
                setFilteredTasks(response.tasks);
                toast.success('Tasks loaded successfully!', { id: loadingToast });
            } catch (error) {
                toast.error('Failed to load tasks', { id: loadingToast });
                console.error('Error fetching tasks:', error);
            } finally {
                setLoading(false);
            }
        };

        getTasks();
    }, []);

    // Calculate paginated tasks
    const getPaginatedTasks = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredTasks.slice(startIndex, endIndex);
    };

    const taskStats = {
        total: tasks.length,
        completed: tasks.filter(task => task.status === 'completed').length,
        pending: tasks.filter(task => task.status === 'pending').length,
    };

    const handleStatusFilterChange = (value: 'completed' | 'pending' | 'all') => {
        setStatusFilter(value);
    };

    const showAddTaskModal = () => {
        form.setFieldsValue({ status: 'pending' });
        setIsModalVisible(true);
    };

    const handleLogout = () => {
        setIsLogoutVisible(true);
        
    };

    const confirmLogout = () => {
        dispatch(clearUser());
        navigate('/app/');
        toast.success('Logged out successfully');
        setIsLogoutVisible(false);
    };

    const handleAddTask = async (values: TaskForm) => {
        const loadingToast = toast.loading('Adding task...');
        try {
            values = {...values,userId:userId}
            
            const task = await createTask(values);
            console.log(task);
            
            setTasks(prevTasks => [task,...prevTasks]);
            toast.success('Task added successfully!', { id: loadingToast });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.log(error);
            
            toast.error('Failed to add task', { id: loadingToast });
        }
    };

    const handleDelete = async (taskId: string) => {
        const loadingToast = toast.loading('Deleting task...');
        try {
            await deleteTask(taskId);
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            toast.success('Task deleted successfully!', { id: loadingToast });
        } catch (error) {
            toast.error('Failed to delete task', { id: loadingToast });
        }
    };

    const handleUpdate = async (updatedTask: Task) => {
        try {
            setTasks(prevTasks => 
                prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
            );
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    const TaskControls = () => (
        <div className="flex flex-col w-full gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col w-full gap-4 sm:flex-row sm:items-center">
                <Select 
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="w-full sm:w-32"
                >
                    <Option value="all">All Tasks</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="pending">Pending</Option>
                </Select>
            </div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddTaskModal}
                className="w-full sm:w-auto"
            >
                Add Task
            </Button>
        </div>
    );

    const TaskStats = () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="text-base sm:text-lg font-semibold">Total Tasks</div>
                <div className="text-xl sm:text-2xl">{taskStats.total}</div>
            </div>
            <div className="text-center p-2 border-b sm:border-b-0 sm:border-r border-gray-200">
                <div className="text-base sm:text-lg font-semibold text-green-600 flex items-center justify-center">
                    <CheckCircleOutlined className="mr-1" />
                    Completed
                </div>
                <div className="text-xl sm:text-2xl">{taskStats.completed}</div>
            </div>
            <div className="text-center p-2">
                <div className="text-base sm:text-lg font-semibold text-orange-600 flex items-center justify-center">
                    <ClockCircleOutlined className="mr-1" />
                    Pending
                </div>
                <div className="text-xl sm:text-2xl">{taskStats.pending}</div>
            </div>
        </div>
    );

    return (
        <Layout className="min-h-screen">
            <Header className="flex justify-between items-center bg-white border-b border-gray-200 px-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Button
                        icon={<MenuOutlined />}
                        className="lg:hidden"
                        onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TaskHive</h1>
                </div>
                <Button 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    className="flex items-center"
                >
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </Header>

            <Content className="p-4 sm:p-6 lg:p-8 z-0">
                <div className="max-w-7xl mx-auto space-y-6">
                    <TaskStats />
                    
                    <div className="bg-white p-4 rounded-lg shadow space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">My Tasks</h2>
                        </div>
                        
                        <TaskControls />

                        {/* Task Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loading ? (
                                <div className="col-span-full flex justify-center items-center h-64">
                                    <div className="ant-spin-spinning">
                                        <span className="ant-spin-dot ant-spin-dot-spin">
                                            <i className="ant-spin-dot-item"></i>
                                            <i className="ant-spin-dot-item"></i>
                                            <i className="ant-spin-dot-item"></i>
                                            <i className="ant-spin-dot-item"></i>
                                        </span>
                                    </div>
                                </div>
                            ) : getPaginatedTasks().length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">No tasks found</p>
                                </div>
                            ) : (
                                getPaginatedTasks().map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                    />
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        
                            <div className="flex justify-center mt-6">
                                <Pagination
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={filteredTasks.length}
                                    onChange={setCurrentPage}
                                    className=""
                                    size={window.innerWidth < 640 ? "small" : "default"}
                                />
                            </div>
                        
                    </div>
                </div>

                {/* Add Task Modal */}
                <Modal
                    title="Add Task"
                    open={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={window.innerWidth < 640 ? "90%" : 520}
                >
                    <Form
                        form={form}
                        onFinish={handleAddTask}
                        layout="vertical"
                        className="mt-4"
                        initialValues={{ status: 'pending' }}
                    >
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && value.trim() !== '') {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Please input the task title!'));
                                },
                            }),]}
                        >
                            <Input placeholder="Enter task title" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <Input.TextArea 
                                rows={4} 
                                placeholder="Enter task description" 
                            />
                        </Form.Item>
                        
                        <Form.Item className="mb-0 flex justify-end">
                            <Space>
                                <Button onClick={() => setIsModalVisible(false)}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Add Task
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Logout Confirmation Modal */}
                <Modal
                    title="Confirm Logout"
                    open={isLogoutVisible}
                    onOk={confirmLogout}
                    onCancel={() => setIsLogoutVisible(false)}
                    okText="Logout"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    width={window.innerWidth < 640 ? "90%" : 520}
                >
                    <p>Are you sure you want to logout?</p>
                </Modal>

                {/* Mobile Menu Modal */}
                <Modal
                    title="Menu"
                    open={isMobileMenuVisible}
                    onCancel={() => setIsMobileMenuVisible(false)}
                    footer={null}
                    className="lg:hidden"
                >
                    <div className="space-y-4">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                showAddTaskModal();
                                setIsMobileMenuVisible(false);
                            }}
                            block
                        >
                            Add Task
                        </Button>
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={() => {
                                handleLogout();
                                setIsMobileMenuVisible(false);
                            }}
                            block
                        >
                            Logout
                        </Button>
                    </div>
                </Modal>
            </Content>
        </Layout>
    );
};

export default TaskList;