const prisma = require('../config/database');
const { sendEmail, emailTemplates } = require('../config/email');
const { calculateAge } = require('../middleware/ageVerification');

const MINIMUM_AGE = parseInt(process.env.MINIMUM_AGE) || 21;

exports.createOrder = async (req, res) => {
    try {
        // 1. Age Verification Check
        if (!req.user.birthdate) {
            return res.status(403).json({ message: 'Please update your profile with birthdate before placing an order.' });
        }
        const age = calculateAge(req.user.birthdate);
        if (age < MINIMUM_AGE) {
            return res.status(403).json({ message: `You must be at least ${MINIMUM_AGE} years old to place an order.` });
        }

        // 2. Get items from cart or body
        let orderItems = [];
        let totalAmount = 0;

        const cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: { items: { include: { product: true } } }
        });

        if (cart && cart.items.length > 0) {
            orderItems = cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            }));
        } else if (req.body.items && req.body.items.length > 0) {
            // Validate and fetch prices for manual items
            for (const item of req.body.items) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } });
                if (!product) throw new Error(`Product ${item.productId} not found`);
                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
            }
        } else {
            return res.status(400).json({ message: 'No items provided for order' });
        }

        // 3. Calculate total and validate stock
        for (const item of orderItems) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }
            totalAmount += item.price * item.quantity;
        }

        // 4. Create Order Transaction
        const order = await prisma.$transaction(async (prisma) => {
            // Create Order
            const newOrder = await prisma.order.create({
                data: {
                    userId: req.user.id,
                    totalAmount,
                    status: 'PENDING',
                    deliveryAddress: req.body.deliveryAddress,
                    items: {
                        create: orderItems
                    }
                },
                include: { items: { include: { product: true } } }
            });

            // Create a corresponding delivery record
            const newDelivery = await prisma.delivery.create({
                data: {
                    orderId: newOrder.id,
                    address: newOrder.deliveryAddress,
                    status: 'PENDING'
                }
            });

            // Link delivery to order
            await prisma.order.update({
                where: { id: newOrder.id },
                data: { deliveryId: newDelivery.id }
            });

            // Deduct Stock
            for (const item of orderItems) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }

            // Clear Cart
            if (cart) {
                await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
            }

            return newOrder;
        });

        // 5. Send Email Notification
        sendEmail(req.user.email, emailTemplates.orderConfirmation(order, req.user));

        res.status(201).json(order);
    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ message: error.message || 'Error creating order' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const where = {};
        if (req.user.role !== 'ADMIN') {
            where.userId = req.user.id;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: { include: { product: true } },
                    payment: true,
                    delivery: true,
                    user: true
                }
            }),
            prisma.order.count({ where })
        ]);

        res.json({
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                items: { include: { product: true } },
                payment: true,
                delivery: { include: { rider: true } },
                user: { select: { id: true, name: true, email: true, address: true } }
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check permission
        if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(`Updating order ${id} status to ${status}`);

        // Validate status
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        // Check if order exists first
        const existingOrder = await prisma.order.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: { user: true, delivery: true }
        });

        // If status is DELIVERED, update delivery status too
        if (status === 'DELIVERED' && order.delivery) {
            await prisma.delivery.update({
                where: { id: order.delivery.id },
                data: { status: 'DELIVERED' }
            });
        }

        // Send email notification
        sendEmail(order.user.email, emailTemplates.orderStatusUpdate(order, order.user));

        res.json(order);
    } catch (error) {
        console.error('Update Order Status Error:', error);
        res.status(500).json({ message: error.message || 'Error updating order status' });
    }
};
