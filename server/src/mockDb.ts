import { Role, Plan } from '@prisma/client';

export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar: string | null;
  role: Role;
  plan: Plan;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockProject {
  id: string;
  name: string;
  description: string | null;
  modelUrl: string;
  activeConfig: string; // JSON String
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockVersion {
  id: string;
  projectId: string;
  name: string;
  notes: string | null;
  configData: string;
  createdById: string;
  createdAt: Date;
}

export interface MockMaterial {
  id: string;
  name: string;
  category: string;
  color: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
  opacity: number;
  emissive: string;
  normalScale: number;
  textureMapUrl: string | null;
  normalMapUrl: string | null;
  roughnessMapUrl: string | null;
  createdAt: Date;
}

export interface MockComment {
  id: string;
  projectId: string;
  userId: string;
  text: string;
  posX: number;
  posY: number;
  posZ: number;
  isResolved: boolean;
  createdAt: Date;
}

export interface MockMarketplaceItem {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface MockAuditLog {
  id: string;
  userId: string | null;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: Date;
}

class MemoryStore {
  users: Map<string, MockUser> = new Map();
  projects: Map<string, MockProject> = new Map();
  versions: MockVersion[] = [];
  materials: Map<string, MockMaterial> = new Map();
  comments: MockComment[] = [];
  marketplaceItems: Map<string, MockMarketplaceItem> = new Map();
  notifications: MockNotification[] = [];
  auditLogs: MockAuditLog[] = [];
  likes: { userId: string; itemId: string }[] = [];
  subscriptions: Map<string, { status: string; currentPeriodEnd: Date }> = new Map();

  constructor() {
    this.seed();
  }

  seed() {
    // Seed default admin and user
    const adminId = 'admin-id-1234';
    const userId = 'user-id-5678';
    
    this.users.set(adminId, {
      id: adminId,
      email: 'admin@productverse.ai',
      passwordHash: '$2a$10$xyzFakeHashForSecurityPassword123', // AdminPass123
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
      role: Role.ADMIN,
      plan: Plan.ENTERPRISE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.users.set(userId, {
      id: userId,
      email: 'creator@productverse.ai',
      passwordHash: '$2a$10$xyzFakeHashForSecurityPassword456', // CreatorPass123
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
      role: Role.USER,
      plan: Plan.PRO,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed default materials
    const defaultMaterials: Omit<MockMaterial, 'id' | 'createdAt'>[] = [
      { name: 'Carbon Fiber', category: 'Carbon Fiber', color: '#1a1a1a', metalness: 0.8, roughness: 0.2, clearcoat: 1.0, opacity: 1.0, emissive: '#000000', normalScale: 1.5, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null },
      { name: 'Luxury Red Leather', category: 'Leather', color: '#8b0000', metalness: 0.1, roughness: 0.7, clearcoat: 0.0, opacity: 1.0, emissive: '#000000', normalScale: 1.0, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null },
      { name: 'Polished Oak Wood', category: 'Wood', color: '#b5651d', metalness: 0.1, roughness: 0.4, clearcoat: 0.3, opacity: 1.0, emissive: '#000000', normalScale: 0.8, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null },
      { name: 'White Carrara Marble', category: 'Marble', color: '#f5f5f5', metalness: 0.2, roughness: 0.1, clearcoat: 0.8, opacity: 1.0, emissive: '#000000', normalScale: 0.5, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null },
      { name: 'Titanium Grey Metal', category: 'Metal', color: '#708090', metalness: 0.9, roughness: 0.2, clearcoat: 0.5, opacity: 1.0, emissive: '#000000', normalScale: 1.0, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null },
      { name: 'Frosted Emerald Glass', category: 'Glass', color: '#50c878', metalness: 0.1, roughness: 0.3, clearcoat: 1.0, opacity: 0.4, emissive: '#000000', normalScale: 1.0, textureMapUrl: null, normalMapUrl: null, roughnessMapUrl: null }
    ];

    defaultMaterials.forEach((mat, idx) => {
      const id = `mat-id-${idx}`;
      this.materials.set(id, {
        id,
        ...mat,
        createdAt: new Date()
      });
    });

    // Seed default projects
    const p1: MockProject = {
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
      ownerId: userId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    const p2: MockProject = {
      id: 'project-chair',
      name: 'Vortex Lounge Chair',
      description: 'Premium ergonomic marble-base lounge chair design.',
      modelUrl: '/models/lounge_chair.glb',
      activeConfig: JSON.stringify({
        base: { color: '#f5f5f5', metalness: 0.2, roughness: 0.1, clearcoat: 0.8 },
        cushions: { color: '#8b0000', metalness: 0.1, roughness: 0.7 },
        frame: { color: '#708090', metalness: 0.9, roughness: 0.2 }
      }),
      ownerId: userId,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    const p3: MockProject = {
      id: 'project-sneaker',
      name: 'Nebula Pro Runner X',
      description: 'Cyberpunk athletics shoes with dynamic polymer threads.',
      modelUrl: '/models/sneaker.glb',
      activeConfig: JSON.stringify({
        sole: { color: '#50c878', metalness: 0.3, roughness: 0.6 },
        upper: { color: '#1a1a1a', metalness: 0.5, roughness: 0.4 },
        laces: { color: '#e53e3e', roughness: 0.9 },
        accents: { color: '#ff00ff', emissive: '#ff00ff' }
      }),
      ownerId: adminId,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };

    this.projects.set(p1.id, p1);
    this.projects.set(p2.id, p2);
    this.projects.set(p3.id, p3);

    // Seed project history versions
    this.versions.push({
      id: 'ver-1',
      projectId: 'project-sports-car',
      name: 'Initial Concept Draft',
      notes: 'Initial styling for client presentation. Using grey satin metal.',
      configData: JSON.stringify({
        body: { color: '#708090', metalness: 0.8, roughness: 0.3 }
      }),
      createdById: userId,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    });

    this.versions.push({
      id: 'ver-2',
      projectId: 'project-sports-car',
      name: 'Carbon Matrix Update',
      notes: 'Added carbon fiber panels to body and deep red leather interior.',
      configData: p1.activeConfig,
      createdById: userId,
      createdAt: new Date()
    });

    // Seed marketplace items
    this.marketplaceItems.set('market-1', {
      id: 'market-1',
      projectId: 'project-sports-car',
      userId: userId,
      title: 'Aethera Hypercar Design Spec',
      description: 'A beautiful carbon hypercar with custom material setups.',
      category: 'Automotive',
      downloads: 412,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.marketplaceItems.set('market-2', {
      id: 'market-2',
      projectId: 'project-chair',
      userId: userId,
      title: 'Vortex Lounge Chair - Marble Concept',
      description: 'Premium lounge chair with white marble frame and burgundy leather cushions.',
      category: 'Furniture',
      downloads: 87,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Seed likes
    this.likes.push({ userId: adminId, itemId: 'market-1' });
    this.likes.push({ userId: userId, itemId: 'market-1' });

    // Seed notifications
    this.notifications.push({
      id: 'notif-1',
      userId: userId,
      title: 'Design Liked',
      message: 'Sarah Connor liked your design: Aethera Hypercar Design Spec.',
      link: '/marketplace/market-1',
      isRead: false,
      createdAt: new Date()
    });

    this.notifications.push({
      id: 'notif-2',
      userId: userId,
      title: 'Team Invitation',
      message: 'You have been invited to edit project Nebula Pro Runner X by Sarah Connor.',
      link: '/workspace/project-sneaker',
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    });
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
