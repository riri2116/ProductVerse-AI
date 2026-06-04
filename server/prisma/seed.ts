import { PrismaClient, Role, Plan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ProductVerse database...');

  // 1. Create Users
  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('AdminPass123', salt);
  const creatorHash = await bcrypt.hash('CreatorPass123', salt);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@productverse.ai' },
    update: {},
    create: {
      email: 'admin@productverse.ai',
      passwordHash: adminHash,
      name: 'Sarah Connor',
      role: Role.ADMIN,
      plan: Plan.ENTERPRISE,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80'
    }
  });

  const normalUser = await prisma.user.upsert({
    where: { email: 'creator@productverse.ai' },
    update: {},
    create: {
      email: 'creator@productverse.ai',
      passwordHash: creatorHash,
      name: 'Alex Rivera',
      role: Role.USER,
      plan: Plan.PRO,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80'
    }
  });

  // 2. Predefined Materials Presets
  const materials = [
    { name: 'Carbon Fiber Weave', category: 'Carbon Fiber', color: '#1a1a1a', metalness: 0.8, roughness: 0.2, clearcoat: 1.0 },
    { name: 'Crimson Leather', category: 'Leather', color: '#8b0000', metalness: 0.1, roughness: 0.7, clearcoat: 0.0 },
    { name: 'Polished Oak Wood', category: 'Wood', color: '#b5651d', metalness: 0.1, roughness: 0.4, clearcoat: 0.3 },
    { name: 'White Carrara Marble', category: 'Marble', color: '#f5f5f5', metalness: 0.2, roughness: 0.1, clearcoat: 0.8 },
    { name: 'Titanium Grey Metal', category: 'Metal', color: '#708090', metalness: 0.9, roughness: 0.2, clearcoat: 0.5 },
    { name: 'Frosted Emerald Glass', category: 'Glass', color: '#50c878', metalness: 0.1, roughness: 0.3, clearcoat: 1.0, opacity: 0.4 }
  ];

  for (const mat of materials) {
    await prisma.material.create({ data: mat });
  }

  // 3. Preloaded Projects
  const p1 = await prisma.project.create({
    data: {
      id: 'project-sports-car',
      name: 'Aethera Hypercar Concept',
      description: 'Luxury electric sports car with custom carbon fiber composite weave.',
      modelUrl: '/models/sports_car.glb',
      activeConfig: JSON.stringify({
        body: { color: '#1a1a1a', metalness: 0.9, roughness: 0.15, clearcoat: 1.0 },
        wheels: { color: '#111111', metalness: 0.8, roughness: 0.3 },
        calipers: { color: '#e53e3e', metalness: 0.9, roughness: 0.1 },
        glass: { color: '#3182ce', opacity: 0.4, roughness: 0.1 },
        interior: { color: '#8b0000', roughness: 0.7 }
      }),
      ownerId: normalUser.id
    }
  });

  const p2 = await prisma.project.create({
    data: {
      id: 'project-chair',
      name: 'Vortex Lounge Chair',
      description: 'Premium ergonomic marble-base lounge chair design.',
      modelUrl: '/models/lounge_chair.glb',
      activeConfig: JSON.stringify({
        base: { color: '#f5f5f5', metalness: 0.2, roughness: 0.1, clearcoat: 0.8 },
        cushions: { color: '#8b0000', metalness: 0.1, roughness: 0.7 },
        frame: { color: '#708090', metalness: 0.9, roughness: 0.2 }
      }),
      ownerId: normalUser.id
    }
  });

  // 4. Create Revisions
  await prisma.version.createMany({
    data: [
      {
        projectId: p1.id,
        name: 'Initial Concept Draft',
        notes: 'Initial styling for client presentation.',
        configData: JSON.stringify({ body: { color: '#708090', metalness: 0.8, roughness: 0.3 } }),
        createdById: normalUser.id
      },
      {
        projectId: p1.id,
        name: 'Carbon Matrix Update',
        notes: 'Added carbon fiber panels to body and deep red leather interior.',
        configData: p1.activeConfig,
        createdById: normalUser.id
      }
    ]
  });

  // 5. Create Marketplace listing
  const m1 = await prisma.marketplaceItem.create({
    data: {
      projectId: p1.id,
      userId: normalUser.id,
      title: 'Aethera Hypercar Design Spec',
      description: 'A beautiful carbon hypercar with custom material setups.',
      category: 'Automotive',
      downloads: 412
    }
  });

  await prisma.marketplaceItem.create({
    data: {
      projectId: p2.id,
      userId: normalUser.id,
      title: 'Vortex Lounge Chair - Marble Concept',
      description: 'Premium lounge chair with white marble frame and burgundy leather cushions.',
      category: 'Furniture',
      downloads: 87
    }
  });

  // 6. Like Marketplace items
  await prisma.like.create({
    data: {
      itemId: m1.id,
      userId: adminUser.id
    }
  });

  // 7. Write Spatial comments
  await prisma.comment.create({
    data: {
      projectId: p1.id,
      userId: adminUser.id,
      text: 'Carbon weave scale could be reduced slightly around the side intakes.',
      posX: -0.85,
      posY: 0.45,
      posZ: 0.35
    }
  });

  console.log('Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
