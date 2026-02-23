const prisma = require('../config/database');

// Rider Controllers
exports.createRider = async (req, res) => {
    try {
        const { name, contact, vehicle } = req.body;
        const rider = await prisma.rider.create({
            data: { name, contact, vehicle }
        });
        res.status(201).json(rider);
    } catch (error) {
        res.status(500).json({ message: 'Error creating rider' });
    }
};

exports.getRiders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [riders, total] = await Promise.all([
            prisma.rider.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.rider.count()
        ]);

        res.json({
            riders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching riders' });
    }
};

exports.getRiderById = async (req, res) => {
    try {
        const { id } = req.params;
        const rider = await prisma.rider.findUnique({
            where: { id: parseInt(id) }
        });
        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }
        res.json(rider);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rider' });
    }
};


exports.updateRider = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact, vehicle, status } = req.body;

        const rider = await prisma.rider.update({
            where: { id: parseInt(id) },
            data: { name, contact, vehicle, status }
        });
        res.json(rider);
    } catch (error) {
        res.status(500).json({ message: 'Error updating rider' });
    }
};

exports.deleteRider = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.rider.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Rider deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting rider' });
    }
};
