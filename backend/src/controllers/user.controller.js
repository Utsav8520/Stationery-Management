const prisma = require('../config/database');
const { calculateAge } = require('../middleware/ageVerification');

const MINIMUM_AGE = parseInt(process.env.MINIMUM_AGE) || 21;

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                birthdate: true,
                role: true,
                createdAt: true
            }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, address, birthdate } = req.body;

        // If updating birthdate, validate age again
        if (birthdate) {
            const age = calculateAge(birthdate);
            if (age < MINIMUM_AGE) {
                return res.status(403).json({
                    message: `Age restriction: You must be at least ${MINIMUM_AGE} years old.`,
                    currentAge: age
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: {
                name,
                address,
                birthdate: birthdate ? new Date(birthdate) : undefined
            },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                birthdate: true,
                role: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    address: true,
                    birthdate: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.user.count()
        ]);

        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                birthdate: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get User By ID Error:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, birthdate, role } = req.body;

        if (birthdate) {
            const age = calculateAge(birthdate);
            if (age < MINIMUM_AGE) {
                return res.status(403).json({
                    message: `Age restriction: User must be at least ${MINIMUM_AGE} years old.`,
                    currentAge: age
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                address,
                birthdate: birthdate ? new Date(birthdate) : undefined,
                role
            },
            select: {
                id: true,
                email: true,
                name: true,
                address: true,
                birthdate: true,
                role: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Update User By ID Error:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error('Delete User By ID Error:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};
