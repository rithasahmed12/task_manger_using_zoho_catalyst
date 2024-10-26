export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'pending' ;
    createdAt:Date
}

export interface TaskResponse {
    tasks: Task[];
}


export interface TaskItemProps {
    task: Task;
    onDelete: (id: string) => void;
    onUpdate: (task: Task) => void;
}

export interface EditForm {
    title: string;
    description: string;
    status: string;
}

export interface TaskForm {
    title: string;
    description: string;
    status: 'completed' | 'pending';
    createdAt: Date;
    userId:string
}
