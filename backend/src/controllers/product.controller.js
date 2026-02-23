const prisma = require('../config/database');
const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const category = req.query.category;
        const minStock = req.query.minStock ? parseInt(req.query.minStock) : undefined;
        const featured = req.query.featured === 'true';
        const search = req.query.search;

        const where = {};
        if (category) where.category = category;
        if (minStock !== undefined) where.stock = { gte: minStock };
        if (featured) where.featured = true;

        // Add search functionality
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const where = {
            OR: [
                { name: { contains: query } }, // Removed mode: 'insensitive' for MySQL compatibility if not configured
                { description: { contains: query } }
            ]
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
            }),
            prisma.product.count({ where })
        ]);

        res.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ message: 'Error searching products' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, featured } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category,
                imageUrl,
                featured: featured === 'true' || featured === true
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category, featured } = req.body;

        const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }


        let imageUrl = existingProduct.imageUrl;
        if (req.file) {
            // Delete old image if exists
            if (imageUrl) {
                const oldPath = path.join(__dirname, '../../', imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const updateData = {
            name,
            description,
            category,
            imageUrl
        };

        if (price) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;

        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.json(product);
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete image file
        if (product.imageUrl) {
            const imagePath = path.join(__dirname, '../../', product.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.product.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock, reason } = req.body;

        const product = await prisma.$transaction(async (prisma) => {
            const currentProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
            const oldStock = currentProduct.stock;
            const newStock = parseInt(stock);
            const change = newStock - oldStock;

            const updatedProduct = await prisma.product.update({
                where: { id: parseInt(id) },
                data: { stock: newStock }
            });

            if (change !== 0) {
                await prisma.stockHistory.create({
                    data: {
                        productId: parseInt(id),
                        change,
                        reason: reason || 'Manual update',
                    }
                });
            }

            return updatedProduct;
        });

        res.json(product);
    } catch (error) {
        console.error('Update Stock Error:', error);
        res.status(500).json({ message: 'Error updating stock' });
    }
};

exports.bulkReduceStock = async (req, res) => {
    try {
        const { items, reason } = req.body; // items: [{ id, quantity }]

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items format' });
        }

        await prisma.$transaction(async (prisma) => {
            for (const item of items) {
                const product = await prisma.product.findUnique({ where: { id: parseInt(item.id) } });
                if (!product) continue;

                await prisma.product.update({
                    where: { id: parseInt(item.id) },
                    data: { stock: { decrement: parseInt(item.quantity) } }
                });

                await prisma.stockHistory.create({
                    data: {
                        productId: parseInt(item.id),
                        change: -parseInt(item.quantity),
                        reason: reason || 'Bulk reduction',
                    }
                });
            }
        });

        res.json({ message: 'Stock reduced successfully' });
    } catch (error) {
        console.error('Bulk Reduce Stock Error:', error);
        res.status(500).json({ message: 'Error reducing stock' });
    }
};

exports.bulkAddStock = async (req, res) => {
    try {
        const { items, reason } = req.body; // items: [{ id, quantity }]

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items format' });
        }

        await prisma.$transaction(async (prisma) => {
            for (const item of items) {
                const product = await prisma.product.findUnique({ where: { id: parseInt(item.id) } });
                if (!product) continue;

                await prisma.product.update({
                    where: { id: parseInt(item.id) },
                    data: { stock: { increment: parseInt(item.quantity) } }
                });

                await prisma.stockHistory.create({
                    data: {
                        productId: parseInt(item.id),
                        change: parseInt(item.quantity),
                        reason: reason || 'Bulk addition',
                    }
                });
            }
        });

        res.json({ message: 'Stock added successfully' });
    } catch (error) {
        console.error('Bulk Add Stock Error:', error);
        res.status(500).json({ message: 'Error adding stock' });
    }
};
