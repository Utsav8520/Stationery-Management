const prisma = require('../config/database');
const { initiatePayment, verifyPayment } = require('../utils/khalti');
const { sendEmail, emailTemplates } = require('../config/email');

exports.initiateKhaltiPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) },
            include: { user: true }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'PAID' || order.status === 'CANCELLED') {
            return res.status(400).json({ message: 'Order is already paid or cancelled' });
        }

        // Prepare Khalti payload
        console.log('KHALTI_BACKEND_CALLBACK_URL:', process.env.KHALTI_BACKEND_CALLBACK_URL);
        console.log('FRONTEND_BASE_URL:', process.env.FRONTEND_BASE_URL);
        const paymentDetails = {
            return_url: `${process.env.KHALTI_BACKEND_CALLBACK_URL}`, // Backend callback URL
            website_url: process.env.FRONTEND_BASE_URL, // Frontend Base URL
            amount: Math.round(order.totalAmount * 100), // Convert to paisa
            purchase_order_id: order.id.toString(),
            purchase_order_name: `Order #${order.id}`,
            customer_info: {
                name: order.user.name || 'Customer',
                email: order.user.email,
                phone: '9800000000' // Placeholder if phone not in User model
            }
        };

        const khaltiResponse = await initiatePayment(paymentDetails);

        // Create Payment record
        await prisma.payment.create({
            data: {
                orderId: order.id,
                amount: order.totalAmount,
                method: 'KHALTI',
                status: 'PENDING',
                pidx: khaltiResponse.pidx
            }
        });

        res.json({
            payment_url: khaltiResponse.payment_url,
            pidx: khaltiResponse.pidx
        });
    } catch (error) {
        console.error('Khalti Initiate Error:', error);
        res.status(500).json({ message: 'Error initiating payment' });
    }
};

exports.khaltiCallback = async (req, res) => {
    try {
        const { pidx, status, purchase_order_id: orderId } = req.query; // Renamed purchase_order_id to orderId

        if (!pidx || !orderId) {
            console.error('Khalti Callback Error: Missing pidx or purchase_order_id');
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/payment-status?status=FAILED&orderId=${orderId || ''}&message=Missing+PIDX+or+OrderId`);
        }

        // Verify with Khalti Lookup API
        const verification = await verifyPayment(pidx);

        let frontendRedirectUrl = `${process.env.FRONTEND_BASE_URL}/payment-status?orderId=${orderId}`;

        if (verification.status === 'Completed') {
            // Update Payment and Order status
            const payment = await prisma.payment.update({
                where: { pidx: pidx },
                data: { status: 'SUCCESS' },
                include: { order: { include: { user: true } } }
            });

            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PAID', paymentId: payment.id }
            });

            // Send Email - add null checks
            if (payment.order && payment.order.user && payment.order.user.email) {
                try {
                    sendEmail(payment.order.user.email, emailTemplates.paymentSuccess(payment.order, payment, payment.order.user));
                } catch (emailError) {
                    console.error('Error sending payment success email:', emailError);
                }
            } else {
                console.warn('Cannot send payment success email: User or order details missing for payment ID', payment.id);
            }

            frontendRedirectUrl += `&status=SUCCESS&pidx=${pidx}`;
            res.redirect(frontendRedirectUrl);

        } else {
            // Update Payment status to FAILED
            await prisma.payment.update({
                where: { pidx: pidx },
                data: { status: 'FAILED' }
            });

            frontendRedirectUrl += `&status=FAILED&message=${verification.status || 'Payment verification failed'}`;
            res.redirect(frontendRedirectUrl);
        }
    } catch (error) {
        console.error('Khalti Callback Error:', error);
        // Redirect to a generic failure page or pass error message
        res.redirect(`${process.env.FRONTEND_BASE_URL}/payment-status?status=FAILED&message=Payment+verification+failed+due+to+server+error`);
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const payment = await prisma.payment.findUnique({
            where: { orderId: parseInt(orderId) }
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment info not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payment status' });
    }
};
