import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding product documentation...');

  // Fetch all products
  const products = await prisma.product.findMany();
  
  if (products.length === 0) {
    console.log('No products found to attach documentation to. Skipping.');
    return;
  }

  // Define some realistic base documentation for various categories
  const docTypes = ['user_guide', 'admin_guide', 'api_reference', 'integration_guide'];
  
  const docsToCreate = [];

  for (const product of products) {
    // Determine how many docs to add based on product (1-3)
    const numDocs = Math.floor(Math.random() * 3) + 1;
    
    // Shuffle and pick doc types
    const shuffledTypes = [...docTypes].sort(() => 0.5 - Math.random());
    const selectedTypes = shuffledTypes.slice(0, numDocs);
    
    for (const type of selectedTypes) {
      let title = '';
      let description = '';
      let pageCount = 0;
      
      switch (type) {
        case 'user_guide':
          title = `${product.name} User Guide`;
          description = `Comprehensive end-user manual for getting started with ${product.name}. Covers basic concepts, navigation, and everyday usage scenarios.`;
          pageCount = Math.floor(Math.random() * 30) + 10; // 10-40 pages
          break;
        case 'admin_guide':
          title = `${product.name} Administrator Guide`;
          description = `Detailed instructions for setting up, configuring, and managing ${product.name} within your organization's environment.`;
          pageCount = Math.floor(Math.random() * 50) + 20; // 20-70 pages
          break;
        case 'api_reference':
          title = `${product.name} API Documentation`;
          description = `Complete technical reference for integrating with the ${product.name} REST API, including endpoint definitions, authentication, and payload formats.`;
          pageCount = Math.floor(Math.random() * 100) + 50; // 50-150 pages
          break;
        case 'integration_guide':
          title = `${product.name} Integration Guide`;
          description = `Step-by-step walkthroughs for connecting ${product.name} with third-party software, CRMs, and custom backend systems.`;
          pageCount = Math.floor(Math.random() * 40) + 15; // 15-55 pages
          break;
      }
      
      docsToCreate.push({
        product_id: product.id,
        doc_type: type,
        title: title,
        description: description,
        version: `1.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
        file_size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        page_count: pageCount,
        pdf_url: `https://example.com/docs/${product.sku}_${type}.pdf`, // Placeholder
        downloads: Math.floor(Math.random() * 5000)
      });
    }
  }

  // Clear existing docs
  console.log('Clearing existing product_documentation records...');
  await prisma.productDocumentation.deleteMany({});

  console.log(`Inserting ${docsToCreate.length} documentation records...`);
  
  // Insert new docs
  let inserted = 0;
  for (const doc of docsToCreate) {
    await prisma.productDocumentation.create({
      data: doc
    });
    inserted++;
  }
  
  console.log(`Successfully seeded ${inserted} product documentation entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
