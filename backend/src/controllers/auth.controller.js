const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { calculateAge } = require('../middleware/ageVerification');

const MINIMUM_AGE = parseInt(process.env.MINIMUM_AGE) || 21;

exports.register = async (req, res) => {
    try {
        const { email, password, name, address, birthdate } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Validate age if birthdate provided
        if (birthdate) {
            const age = calculateAge(birthdate);
            if (age < MINIMUM_AGE) {
                return res.status(403).json({
                    message: `You must be at least ${MINIMUM_AGE} years old to register.`,
                    currentAge: age
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                address,
                birthdate: birthdate ? new Date(birthdate) : null,
                role: 'CUSTOMER'
            },
        });

        // Generate token
        const token = generateToken({ id: user.id, role: user.role });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken({ id: user.id, role: user.role });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.role !== 'ADMIN') {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = generateToken({ id: user.id, role: user.role });

        res.json({
            message: 'Admin login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
