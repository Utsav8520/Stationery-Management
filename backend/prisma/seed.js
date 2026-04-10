const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('Utsav12345', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'stationerystore@gmail.com' },
        update: {},
        create: {
            email: 'stationerystore@gmail.com',
            password: adminPassword,
            name: 'System Admin',
            role: 'ADMIN',
            birthdate: new Date('1990-01-01') // Admin is definitely over 21
        },
    });
    console.log('Created Admin:', admin.email);

    // Create Sample Products
    const products = [
        // Featured Premium Products
        {
            name: 'Premium Office Desk Set',
            description: 'Executive desk set with pen holder, paper tray, and business card holder',
            price: 3500,
            stock: 15,
            category: 'Office Supplies',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop'
        },
        {
            name: 'Pro Cricket Bat - English Willow',
            description: 'Grade 1 English willow cricket bat with handle grip',
            price: 4500,
            stock: 20,
            category: 'Sports',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop'
        },
        {
            name: 'Deluxe Stationery Kit',
            description: 'Complete stationery kit with pens, pencils, notepad, and eraser',
            price: 1200,
            stock: 50,
            category: 'Stationery',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop'
        },
        {
            name: 'Professional Football',
            description: 'Match grade football with proper inflation',
            price: 1800,
            stock: 30,
            category: 'Sports',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop'
        },
        {
            name: 'Executive Notebook Collection',
            description: 'Premium leather-bound notebooks set of 3',
            price: 2200,
            stock: 25,
            category: 'Stationery',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop'
        },
        {
            name: 'Basketball - Official Size',
            description: 'Official size basketball for indoor/outdoor use',
            price: 1500,
            stock: 35,
            category: 'Sports',
            featured: true,
            imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop'
        },
        // Regular Products
        {
            name: 'School Backpack',
            description: 'Durable school backpack with multiple compartments',
            price: 1200,
            stock: 60,
            category: 'School Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
        },
        {
            name: 'Football Shoes - Nike',
            description: 'Professional football cleats for turf fields',
            price: 5500,
            stock: 25,
            category: 'Sports',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
        },
        {
            name: 'Ballpoint Pen Set (10 pcs)',
            description: 'Smooth writing ballpoint pens pack of 10',
            price: 250,
            stock: 200,
            category: 'Stationery',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop'
        },
        {
            name: 'Desktop Organizer',
            description: 'Multi-compartment desk organizer for office',
            price: 800,
            stock: 45,
            category: 'Office Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'
        },
        {
            name: 'Exercise Book (200 pages)',
            description: 'Premium quality ruled exercise book',
            price: 80,
            stock: 500,
            category: 'School Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop'
        },
        {
            name: 'Table Tennis Set',
            description: 'Complete TT set with racket and balls',
            price: 900,
            stock: 40,
            category: 'Sports',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=400&h=300&fit=crop'
        },
        {
            name: 'Stapler with Staples',
            description: 'Heavy duty office stapler with 1000 staples',
            price: 350,
            stock: 80,
            category: 'Office Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop'
        },
        {
            name: 'Crayons Set (24 colors)',
            description: 'Premium wax crayons for kids',
            price: 450,
            stock: 100,
            category: 'School Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop'
        },
        {
            name: 'Badminton Racket Set',
            description: 'Pair of professional badminton rackets with shuttlecocks',
            price: 2500,
            stock: 30,
            category: 'Sports',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&h=300&fit=crop'
        },
        {
            name: 'Scientific Calculator',
            description: 'Advanced calculator for engineering students',
            price: 1200,
            stock: 50,
            category: 'School Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'
        },
        {
            name: 'File Folder Set',
            description: 'A4 size manila file folders pack of 50',
            price: 600,
            stock: 75,
            category: 'Office Supplies',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop'
        },
        {
            name: 'Volleyball',
            description: 'Official size volleyball for indoor play',
            price: 1100,
            stock: 35,
            category: 'Sports',
            featured: false,
            imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop'
        }
    ];

    for (const p of products) {
        await prisma.product.create({ data: p });
    }
    console.log('Created Sample Products');

    // Create Sample Riders
    await prisma.rider.createMany({
        data: [
            { name: 'Ramesh Rider', contact: '9800000001', vehicle: 'Bike - Ba 1 Pa 1234' },
            { name: 'Suresh Rider', contact: '9800000002', vehicle: 'Scooter - Ba 2 Pa 5678' }
        ]
    });
    console.log('Created Sample Riders');

    // Create Sample Party
    await prisma.party.create({
        data: {
            name: 'ABC Suppliers',
            contact: '9811111111',
            type: 'Supplier'
        }
    });
    console.log('Created Sample Party');

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
