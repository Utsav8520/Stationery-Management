const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productImages = {
    'Premium Office Desk Set': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
    'Pro Cricket Bat - English Willow': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop',
    'Deluxe Stationery Kit': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&h=300&fit=crop',
    'Professional Football': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop',
    'Executive Notebook Collection': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop',
    'Basketball - Official Size': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    'School Backpack': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    'Football Shoes - Nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    'Ballpoint Pen Set (10 pcs)': 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=300&fit=crop',
    'Desktop Organizer': 'https://www.123ink.ca/p-377480-os-14-wd-wooden-desktop-organizer-with-drawers-and-5-compartments',
    'Exercise Book (200 pages)': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    'Table Tennis Set': 'https://images.unsplash.com/photo-1611251135345-18c56206b863?w=400&h=300&fit=crop',
    'Stapler with Staples': 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop',
    'Crayons Set (24 colors)': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    'Badminton Racket Set': 'https://shuttletime.bwfbadminton.com/equipment',
    'Scientific Calculator': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    'File Folder Set': 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop',
    'Volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop',
};

async function main() {
    console.log('Updating product images...');

    for (const [name, imageUrl] of Object.entries(productImages)) {
        const updated = await prisma.product.updateMany({
            where: { name },
            data: { imageUrl },
        });
        if (updated.count > 0) {
            console.log(`Updated image for: ${name}`);
        } else {
            console.log(`Product not found: ${name}`);
        }
    }

    console.log('Done updating product images.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
