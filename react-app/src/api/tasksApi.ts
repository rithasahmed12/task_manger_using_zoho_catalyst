import api from './axiosConfig';
import { Task, TaskResponse } from '../types/tasksTypes';

export const fetchTasks = async (userId:string): Promise<TaskResponse> => {
    const response = await api.get(`/tasks/${userId}`);
    return response.data;
};

export const createTask = async (task: {title:string,description:string}): Promise<Task> => {
    const response = await api.post('/tasks', task);
    return response.data;
};

export const updateTask = async (id: string, task: Task): Promise<Task> => {    
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
};

