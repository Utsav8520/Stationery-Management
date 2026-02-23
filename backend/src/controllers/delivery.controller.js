const prisma = require('../config/database');

exports.createDelivery = async (req, res) => {
    try {
        const { orderId, address, riderId, deliveryPartner } = req.body;

        // Check if order exists
        const order = await prisma.order.findUnique({ where: { id: parseInt(orderId) } });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const delivery = await prisma.delivery.create({
            data: {
                orderId: parseInt(orderId),
                address,
                riderId: riderId ? parseInt(riderId) : null,
                deliveryPartner,
                status: 'PENDING'
            }
        });

        // Link delivery to order
        await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { deliveryId: delivery.id }
        });

        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Error creating delivery' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, trackingId } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        // Check if delivery exists first
        const existingDelivery = await prisma.delivery.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        const delivery = await prisma.delivery.update({
            where: { id: parseInt(id) },
            data: { status, trackingId }
        });

        // Sync Order Status based on Delivery Status
        if (status === 'DELIVERED') {
            await prisma.order.update({
                where: { id: delivery.orderId },
                data: { status: 'DELIVERED' }
            });
        } else if (status === 'FAILED') {
            await prisma.order.update({
                where: { id: delivery.orderId },
                data: { status: 'CANCELLED' }
            });
        }

        res.json(delivery);
    } catch (error) {
        console.error('Update Delivery Status Error:', error);
        res.status(500).json({ message: error.message || 'Error updating delivery status' });
    }
};

exports.assignRider = async (req, res) => {
    try {
        const { id } = req.params;
        const { riderId } = req.body;

        console.log(`Assigning rider ${riderId} to delivery ${id}`);

        if (!riderId) {
            return res.status(400).json({ message: 'Rider ID is required' });
        }

        // Check if delivery exists
        const existingDelivery = await prisma.delivery.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Check if rider exists
        const rider = await prisma.rider.findUnique({
            where: { id: parseInt(riderId) }
        });

        if (!rider) {
            return res.status(404).json({ message: 'Rider not found' });
        }

        // Transaction to update both Delivery and Order
        const result = await prisma.$transaction(async (prisma) => {
            const delivery = await prisma.delivery.update({
                where: { id: parseInt(id) },
                data: {
                    riderId: parseInt(riderId),
                    status: 'OUT_FOR_DELIVERY' // Auto update status when rider assigned
                },
                include: { rider: true }
            });

            // Auto-advance Order to SHIPPED when rider is assigned
            await prisma.order.update({
                where: { id: delivery.orderId },
                data: { status: 'SHIPPED' }
            });

            return delivery;
        });

        res.json(result);
    } catch (error) {
        console.error('Assign Rider Error:', error);
        res.status(500).json({ message: error.message || 'Error assigning rider' });
    }
};

exports.getDeliveryDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const delivery = await prisma.delivery.findUnique({
            where: { orderId: parseInt(orderId) },
            include: { rider: true }
        });

        if (!delivery) return res.status(404).json({ message: 'Delivery info not found' });

        res.json(delivery);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery details' });
    }
};

exports.getAllDeliveries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [deliveries, total] = await Promise.all([
            prisma.delivery.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    order: {
                        select: {
                            id: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    rider: true
                }
            }),
            prisma.delivery.count()
        ]);

        res.json({
            deliveries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Get All Deliveries Error:", error)
        res.status(500).json({ message: 'Error fetching deliveries' });
    }
};
