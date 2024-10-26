const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { catalyst } = res.locals;
        
        // Check if user exists
        const existingUserQuery = `SELECT ROWID FROM Users WHERE Email = '${email}'`;
        console.log('existingUserQuery:',existingUserQuery);
        
        const existingUser = await catalyst.zcql().executeZCQLQuery(existingUserQuery);

        if (existingUser && existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const insertQuery = `INSERT INTO Users (Email, Password) VALUES ('${email}', '${hashedPassword}')`;
        await catalyst.zcql().executeZCQLQuery(insertQuery);

        // Get the newly created user's ROWID
        const getUserQuery = `SELECT ROWID FROM Users WHERE Email = '${email}'`;
        const [createdUser] = await catalyst.zcql().executeZCQLQuery(getUserQuery);
        

        const token = jwt.sign(
            { id: createdUser.Users.ROWID },
            config.secret,
            { expiresIn: '30d' }
        );

        res.status(201).json({ token ,id: createdUser.Users.ROWID });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { catalyst } = res.locals;
        
        
        // Get user
        const query = `SELECT ROWID, Password FROM Users WHERE Email = '${email}'`;
        const users = await catalyst.zcql().executeZCQLQuery(query);
        

        if (!users || users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const {Users} = users[0];
        
        const isMatch = await bcrypt.compare(password, Users.Password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: Users.ROWID },
            config.secret,
            { expiresIn: '30d' }
        );

        res.json({ token, id: Users.ROWID });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login };