# ProductVerse AI - API Documentation

The REST endpoints for ProductVerse AI provide interfaces for authorization, 3D design configurations syncing, version history control, AI texture generation, spatial pinning commentary, marketplace galleries, and administrative system metrics.

---

## 1. Authentication Endpoints

### Register User
* **Endpoint**: `POST /api/auth/register`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123",
    "name": "Design Professional"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "usr-12345",
      "email": "user@example.com",
      "name": "Design Professional",
      "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Design Professional",
      "role": "USER",
      "plan": "FREE"
    }
  }
  ```

### Login Session
* **Endpoint**: `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "Password123"
  }
  ```
* **Response (200 OK)**:
  Same structure as Register response.

### Google OAuth Login (Mock)
* **Endpoint**: `POST /api/auth/google`
* **Request Body**:
  ```json
  {
    "credential": "google-jwt-credential-token"
  }
  ```
* **Response (200 OK)**:
  OAuth verified session details.

---

## 2. 3D Project Endpoints

### List Active Projects
* **Endpoint**: `GET /api/projects`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  ```json
  [
    {
      "id": "proj-98765",
      "name": "Hypercar Design Studio",
      "description": "Custom aerodynamic shell tuning.",
      "modelUrl": "/models/sports_car.glb",
      "activeConfig": "{\"body\":{\"color\":\"#111111\",\"metalness\":0.9}}",
      "ownerId": "usr-12345",
      "createdAt": "2026-06-04T12:00:00.000Z",
      "updatedAt": "2026-06-04T12:15:00.000Z"
    }
  ]
  ```

### Create Project
* **Endpoint**: `POST /api/projects`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "name": "Luxury Sneaker Prototype",
    "description": "Sustainable running sneaker model.",
    "category": "sneaker"
  }
  ```
* **Response (201 Created)**:
  Creates new model config mapping to `sneaker.glb`.

### Get Project Details
* **Endpoint**: `GET /api/projects/:id`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  Fetches full project details, including spatial comments, owner avatars, and version revisions logs.

### Save Active Shading Configuration
* **Endpoint**: `PUT /api/projects/:id/config`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "configData": {
      "body": { "color": "#8b5cf6", "metalness": 0.8, "roughness": 0.2, "clearcoat": 1.0 }
    }
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "message": "Configuration synced successfully.",
    "activeConfig": "{\"body\":{\"color\":\"#8b5cf6\",...}}"
  }
  ```

---

## 3. Version Revision Control

### Commit Design Version
* **Endpoint**: `POST /api/projects/:id/versions`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "name": "Carbon Wing Trim",
    "notes": "Added carbon composite spoiler finish.",
    "configData": { "body": { "color": "#111" } }
  }
  ```

### Restore Revision Checkpoint
* **Endpoint**: `POST /api/projects/:id/versions/:versionId/restore`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  Updates active configurator materials configuration back to selected revision details.

---

## 4. Collaborative Spatial Comments

### Drop Comment Pin
* **Endpoint**: `POST /api/projects/:id/comments`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "text": "Stitch seam color should be neon magenta",
    "posX": -0.42,
    "posY": 0.58,
    "posZ": 1.12
  }
  ```

### Resolve Comment Pin
* **Endpoint**: `PUT /api/projects/:id/comments/:commentId/resolve`
* **Headers**: `Authorization: Bearer <token>`
* **Response (200 OK)**:
  Marks comment resolved.

---

## 5. AI Features

### Generate Palette Theme
* **Endpoint**: `POST /api/ai/theme`
* **Request Body**:
  ```json
  {
    "prompt": "Cyberpunk metallic neon styling",
    "category": "car"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "palette": [
      { "name": "body", "color": "#09090b", "metalness": 0.9, "roughness": 0.1, "clearcoat": 1.0 },
      { "name": "accents", "color": "#ec4899", "metalness": 0.5, "roughness": 0.2, "emissive": "#ec4899" }
    ]
  }
  ```

### Critic Shading Review
* **Endpoint**: `POST /api/ai/critic`
* **Request Body**:
  ```json
  {
    "config": { "body": { "color": "#09090b" } },
    "category": "car",
    "prompt": "Luxury Showcase"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "visualScore": 88,
    "marketAppeal": 90,
    "feasibility": 78,
    "luxuryRating": 92,
    "costEfficiency": 65,
    "suggestions": [
      "The dark metallic scheme is elegant but lacks contrast on calipers.",
      "Carbon fiber accents could elevate the wing struts visual premium."
    ]
  }
  ```

---

## 6. Marketplace Gallery

### List Published Gallery Items
* **Endpoint**: `GET /api/marketplace`

### Publish Project
* **Endpoint**: `POST /api/marketplace/publish`
* **Headers**: `Authorization: Bearer <token>`
* **Request Body**:
  ```json
  {
    "projectId": "proj-98765",
    "title": "Futuristic Cyber Runner sneaker",
    "description": "High-vis pink detailing with custom sole grips.",
    "category": "sneaker"
  }
  ```

---

## 7. Administrative Telemetry

### System Metrics
* **Endpoint**: `GET /api/admin/stats`
* **Headers**: `Authorization: Bearer <token>` (User must possess `ADMIN` role attributes)
* **Response (200 OK)**:
  Returns statistics detailing total active users, models configurations, database type (SQLite/PostgreSQL), memory stores size, and network telemetry logs.
