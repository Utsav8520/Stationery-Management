const prisma = require('../config/database');

exports.getSalesAnalytics = async (req, res) => {
    try {
        const { from, to } = req.query;
        const startDate = from ? new Date(from) : new Date(new Date().setDate(new Date().getDate() - 30));
        const endDate = to ? new Date(to) : new Date();

        const sales = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            _count: { id: true },
            where: {
                status: 'PAID', // Or DELIVERED depending on business logic
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        res.json({
            period: { from: startDate, to: endDate },
            totalSales: sales._sum.totalAmount || 0,
            totalOrders: sales._count.id || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales analytics' });
    }
};

exports.getStockAnalytics = async (req, res) => {
    try {
        const threshold = parseInt(req.query.threshold) || 10;

        const lowStockProducts = await prisma.product.findMany({
            where: { stock: { lte: threshold } },
            select: { id: true, name: true, stock: true }
        });

        res.json({
            threshold,
            count: lowStockProducts.length,
            products: lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock analytics' });
    }
};

exports.getOrderAnalytics = async (req, res) => {
    try {
        const stats = await prisma.order.groupBy({
            by: ['status'],
            _count: { id: true }
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order analytics' });
    }
};
