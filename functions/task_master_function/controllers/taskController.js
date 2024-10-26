const getTasks = async (req, res) => {
    try {
        const { catalyst } = res.locals;
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const zcql = catalyst.zcql();
        
        // Get total count
        const countQuery = await zcql.executeZCQLQuery(
            `SELECT COUNT(ROWID) as total FROM Tasks WHERE UserId = ${userId}`
        );
        const totalItems = parseInt(countQuery[0].Tasks.total);
        const hasMore = totalItems > page * perPage;

        // Get paginated tasks
        const tasks = await zcql.executeZCQLQuery(
            `SELECT ROWID, Title, Description, Status, CreatedAt 
             FROM Tasks 
             WHERE UserId = ${userId} 
             ORDER BY CreatedAt DESC 
             LIMIT ${(page - 1) * perPage}, ${perPage}`
        );

        const formattedTasks = tasks.map(row => ({
            id: row.Tasks.ROWID,
            title: row.Tasks.Title,
            description: row.Tasks.Description,
            status: row.Tasks.Status,
            createdAt: row.Tasks.CreatedAt
        }));

        res.json({
            tasks: formattedTasks,
            hasMore,
            totalItems,
            currentPage: page,
            perPage
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const { catalyst } = res.locals;
        
        // Format current date as YYYY-MM-DD HH:mm:ss
        const now = new Date();
        const formattedDate = now.getFullYear() + '-' +
            String(now.getMonth() + 1).padStart(2, '0') + '-' +
            String(now.getDate()).padStart(2, '0') + ' ' +
            String(now.getHours()).padStart(2, '0') + ':' +
            String(now.getMinutes()).padStart(2, '0') + ':' +
            String(now.getSeconds()).padStart(2, '0');
        
        const taskTable = catalyst.datastore().table('Tasks');
        const task = await taskTable.insertRow({
            Title: title,
            Description: description || "",
            Status: 'pending',
            UserId: userId,
            CreatedAt: formattedDate
        });

        res.status(201).json({
            id: task.ROWID,
            title,
            description,
            status: 'pending',
            createdAt: task.CreatedAt
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('id:',id);
        
        const { title, description, status } = req.body;
        const { catalyst } = res.locals;

        const taskTable = catalyst.datastore().table('Tasks');
        const task = await taskTable.updateRow({
            ROWID: id,
            Title: title,
            Description: description,
            Status: status
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({
            id: task.ROWID,
            title: task.Title,
            description: task.Description,
            status: task.Status
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { catalyst } = res.locals;

        const taskTable = catalyst.datastore().table('Tasks');
        await taskTable.deleteRow(id);

        res.status(204).send();
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };