import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      category: "Electronics",
      ourPrice: 79.99,
    },
    {
      name: "Organic Cotton T-Shirt",
      sku: "OCT-001",
      category: "Apparel",
      ourPrice: 29.99,
    },
    {
      name: "Stainless Steel Water Bottle",
      sku: "SSW-001",
      category: "Home & Kitchen",
      ourPrice: 24.99,
    },
    {
      name: "Ergonomic Office Chair",
      sku: "EOC-001",
      category: "Furniture",
      ourPrice: 349.99,
    },
    {
      name: "USB-C Charging Cable (6ft)",
      sku: "UCC-001",
      category: "Electronics",
      ourPrice: 12.99,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
