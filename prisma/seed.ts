import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed products with upsert to allow safe re-runs
  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      sku: "WBH-001",
      category: "Electronics",
      ourPrice: 79.99,
      competitors: [
        { competitorName: "TechGiant", price: 74.99, url: "https://techgiant.example.com/wbh-001" },
        { competitorName: "SoundPro", price: 89.99, url: "https://soundpro.example.com/headphones" },
      ],
    },
    {
      name: "Organic Cotton T-Shirt",
      sku: "OCT-001",
      category: "Apparel",
      ourPrice: 29.99,
      competitors: [
        { competitorName: "FashionHub", price: 24.99, url: "https://fashionhub.example.com/oct-001" },
        { competitorName: "EcoWear", price: 34.99, url: "https://ecowear.example.com/organic-tshirt" },
      ],
    },
    {
      name: "Stainless Steel Water Bottle",
      sku: "SSW-001",
      category: "Home & Kitchen",
      ourPrice: 24.99,
      competitors: [
        { competitorName: "HomeBase", price: 22.99, url: "https://homebase.example.com/ssw-001" },
        { competitorName: "EcoLiving", price: 27.99, url: "https://ecoliving.example.com/bottle" },
      ],
    },
    {
      name: "Ergonomic Office Chair",
      sku: "EOC-001",
      category: "Furniture",
      ourPrice: 349.99,
      competitors: [
        { competitorName: "OfficeMax", price: 329.99, url: "https://officemax.example.com/eoc-001" },
        { competitorName: "ComfortPlus", price: 399.99, url: "https://comfortplus.example.com/chair" },
      ],
    },
    {
      name: "USB-C Charging Cable (6ft)",
      sku: "UCC-001",
      category: "Electronics",
      ourPrice: 12.99,
      competitors: [
        { competitorName: "CableWorld", price: 9.99, url: "https://cableworld.example.com/ucc-001" },
        { competitorName: "TechGiant", price: 14.99, url: "https://techgiant.example.com/ucc-001" },
      ],
    },
  ];

  for (const product of products) {
    const { competitors, ...productData } = product;

    const created = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: { ourPrice: productData.ourPrice, category: productData.category },
      create: productData,
    });

    // Seed competitor prices for this product
    for (const comp of competitors) {
      await prisma.competitorPrice.create({
        data: {
          productId: created.id,
          competitorName: comp.competitorName,
          price: comp.price,
          url: comp.url,
        },
      });
    }

    console.log(`  Product: ${created.name} (${created.sku}) with ${competitors.length} competitor prices`);
  }

  console.log(`\nSeeded ${products.length} products with competitor prices`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
