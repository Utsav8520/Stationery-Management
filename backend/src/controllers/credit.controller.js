const prisma = require('../config/database');

exports.createParty = async (req, res) => {
    try {
        const { name, contact, type } = req.body;
        const party = await prisma.party.create({
            data: { name, contact, type }
        });
        res.status(201).json(party);
    } catch (error) {
        res.status(500).json({ message: 'Error creating party' });
    }
};

exports.getParties = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [parties, total] = await Promise.all([
            prisma.party.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.party.count()
        ]);

        res.json({
            parties,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching parties' });
    }
};

exports.getPartyById = async (req, res) => {
    try {
        const { id } = req.params;
        const party = await prisma.party.findUnique({
            where: { id: parseInt(id) }
        });
        if (!party) {
            return res.status(404).json({ message: 'Party not found' });
        }
        res.json(party);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching party' });
    }
};


exports.createTransaction = async (req, res) => {
    try {
        const { partyId, amount, type, description } = req.body;
        const transaction = await prisma.creditTransaction.create({
            data: {
                partyId: parseInt(partyId),
                userId: req.user.id,
                amount: parseFloat(amount),
                type, // 'DEBIT' or 'CREDIT'
                description
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction' });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { partyId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.creditTransaction.findMany({
                where: { partyId: parseInt(partyId) },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } }
            }),
            prisma.creditTransaction.count({ where: { partyId: parseInt(partyId) } })
        ]);

        res.json({
            transactions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

exports.getPartyBalance = async (req, res) => {
    try {
        const { partyId } = req.params;
        const transactions = await prisma.creditTransaction.findMany({
            where: { partyId: parseInt(partyId) }
        });

        let balance = 0;
        transactions.forEach(t => {
            if (t.type === 'CREDIT') balance += t.amount; // Money coming in / Owed to us reduced
            else balance -= t.amount; // Money going out / Owed to us increased (depending on perspective)
        });

        res.json({ partyId, balance });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating balance' });
    }
};
