# Task Manager App

A scalable Task Manager Application built with React, TypeScript, and Node.js, deployed and managed databse using Zoho Catalyst. This app enables users to create, view, update, and delete tasks, providing a simple and effective task management experience.

## Features

- **Task List**: View a list of all tasks.
- **Task Form**: Create and edit tasks.
- **Task Item**: Display individual tasks with options to mark as complete, edit, or delete.
- **Form Validation**: Ensures required fields are filled.
- **Error Handling**: Alerts users to input errors and server issues.
- **Backend API**: RESTful API with full CRUD functionality deployed using Zoho Catalyst.
- **Zoho Catalyst Integration**: Utilizes Catalyst Data Store for database management.

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Zoho Catalyst
- **API**: RESTful API using Catalyst functions
- **Database**: Catalyst Data Store / ZCQL
- **Hosting**: Zoho Catalyst for both frontend and backend

## Requirements

- **Node.js** (version 14 or higher)
- **Zoho Catalyst CLI** (for deployment)
- **Zoho Catalyst Account** (required for API and Data Store setup)

## Getting Started

### 1. Set Up Zoho Catalyst

1. **Create a Zoho Catalyst Account**: Register at [Zoho Catalyst](https://catalyst.zoho.com/).
2. **Create a New Project** in Catalyst.
3. **Set Up Catalyst Data Tables**: In your Catalyst console, create the required tables with columns for `id`, `title`, `description`, and `status` (ensure `title` is required, and `status` defaults to `pending`).

### 2. Clone the Repository

```bash
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app
```

### 3. Initialize Catalyst CLI

1. Install the **Catalyst CLI** if not already installed, and log in by following [Zoho Catalyst’s CLI setup guide](https://catalyst.zoho.com/).
2. Initialize the project on Catalyst by running:

   ```bash
   catalyst init
   ```

3. In the `functions/task_master_functions` directory, install dependencies:

   ```bash
   npm install
   ```

### 4. Environment Variables

Create the following environment files in the `functions/task_master_functions` directory:

- **.env** for general configuration
- **.env.production** and **.env.development** for respective environment configurations

**Sample .env Configuration**:

```env
CATALYST_ENVIRONMENT=development
CATALYST_SECRET=secretaarkumparnjtharoola
```

### 5. Set Up and Start Frontend

1. Navigate to the `react-app` directory and install dependencies:

   ```bash
   cd ../../react-app
   npm install
   ```

2. Navigate back to the root directory:

   ```bash
   cd ..
   ```

### 6. Run the Application Locally

To test and serve the project locally, use Catalyst’s CLI:

```bash
catalyst serve
```

## API Endpoints

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| GET    | `/tasks`      | Fetch all tasks       |
| POST   | `/tasks`      | Create a new task     |
| PUT    | `/tasks/:id`  | Update an existing task |
| DELETE | `/tasks/:id`  | Delete a task         |

## Folder Structure

```
task-manager-app/
├── react-app/              # React frontend with TypeScript
│   ├── src/                # Source code
│   │   ├── components/     # Components (TaskList, TaskForm, TaskItem)
│   │   └── App.tsx         # Main app component
│   └── public/             # Static files
├── functions/              # Catalyst functions for backend API
│   └── task_master_functions/ # API logic for task CRUD
├── README.md
└── .gitignore
```

## Project Design

- **Frontend Components**:
  - **TaskList**: Displays the list of tasks.
  - **TaskForm**: Handles task creation and editing.
  - **TaskItem**: Displays individual task details and actions.
- **Backend API**: REST API developed in Node.js, connected with Catalyst Data Store for persistent task management.

## Contributing

Contributions are welcome! Please fork the repository and make a pull request with your changes.

---
