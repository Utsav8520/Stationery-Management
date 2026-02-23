const prisma = require('../config/database');

exports.getCart = async (req, res) => {
    try {
        let cart = await prisma.cart.findUnique({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id },
                include: { items: true }
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        // Check product stock
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Get or create cart
        let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId: req.user.id } });
        }

        // Check if item exists in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId
                }
            }
        });

        if (existingItem) {
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + qty }
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: productId,
                    quantity: qty
                }
            });
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        res.json(updatedCart);
    } catch (error) {
        console.error('Add to Cart Error:', error);
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { productId: paramProductId } = req.params;
        const { quantity } = req.body;
        const qty = parseInt(quantity);
        const parsedProductId = parseInt(paramProductId);

        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({ message: 'Quantity must be a valid number and at least 1' });
        }
        if (isNaN(parsedProductId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        // Check product stock
        const product = await prisma.product.findUnique({ where: { id: parsedProductId } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        await prisma.cartItem.update({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parsedProductId
                }
            },
            data: { quantity: qty }
        });

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: parseInt(productId)
                }
            }
        });

        const updatedCart = await prisma.cart.findUnique({
            where: { id: cart.id },
            include: { items: { include: { product: true } } }
        });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing cart item' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart' });
    }
};
