const prisma = require('../config/database');

exports.getStockHistory = async (req, res) => {
    try {
        const { productId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const where = { productId: parseInt(productId) };

        const [history, total] = await Promise.all([
            prisma.stockHistory.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { name: true } } }
            }),
            prisma.stockHistory.count({ where })
        ]);

        res.json({
            history,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get Stock History Error:', error);
        res.status(500).json({ message: 'Error fetching stock history' });
    }
};

exports.getAllStockHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            prisma.stockHistory.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { product: { select: { name: true } } }
            }),
            prisma.stockHistory.count()
        ]);

        res.json({
            history,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get All Stock History Error:', error);
        res.status(500).json({ message: 'Error fetching stock history' });
    }
};
