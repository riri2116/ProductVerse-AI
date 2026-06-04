import { Server, Socket } from 'socket.io';

interface UserCursor {
  userId: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  z: number;
}

interface RoomState {
  users: Map<string, { socketId: string; cursor: UserCursor | null }>;
}

export function initMultiplayerSockets(io: Server) {
  const rooms = new Map<string, RoomState>();

  io.on('connection', (socket: Socket) => {
    let currentRoom: string | null = null;
    let userId: string | null = null;
    let userName: string | null = null;
    let userAvatar: string | null = null;

    // Join design session
    socket.on('join-project', (data: { projectId: string; userId: string; name: string; avatar?: string }) => {
      currentRoom = data.projectId;
      userId = data.userId;
      userName = data.name;
      userAvatar = data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.name}`;

      socket.join(currentRoom);

      if (!rooms.has(currentRoom)) {
        rooms.set(currentRoom, { users: new Map() });
      }

      const room = rooms.get(currentRoom)!;
      room.users.set(userId, {
        socketId: socket.id,
        cursor: null
      });

      // Broadcast active user joined
      io.to(currentRoom).emit('user-joined', {
        userId,
        name: userName,
        avatar: userAvatar,
        activeCount: room.users.size
      });

      // Send the current list of active users to the joining user
      const activeUsers = Array.from(room.users.entries()).map(([uid, u]) => ({
        userId: uid,
        cursor: u.cursor
      }));
      socket.emit('active-users', activeUsers);
    });

    // Move dynamic 3D cursor
    socket.on('cursor-move', (data: { x: number; y: number; z: number }) => {
      if (!currentRoom || !userId || !userName) return;

      const room = rooms.get(currentRoom);
      if (!room) return;

      const userState = room.users.get(userId);
      if (!userState) return;

      const cursor: UserCursor = {
        userId,
        name: userName,
        avatar: userAvatar || '',
        x: data.x,
        y: data.y,
        z: data.z
      };
      userState.cursor = cursor;

      // Broadcast cursor coordinates to other project editors
      socket.to(currentRoom).emit('cursor-update', cursor);
    });

    // Material edits sync
    socket.on('material-change', (data: { partName: string; config: any }) => {
      if (!currentRoom) return;
      // Broadcast modification immediately to other views
      socket.to(currentRoom).emit('material-updated', data);
    });

    // Annotations & Comments sync
    socket.on('comment-post', (data: { id: string; text: string; posX: number; posY: number; posZ: number; user: any }) => {
      if (!currentRoom) return;
      socket.to(currentRoom).emit('comment-received', data);
    });

    // Voice activation notification
    socket.on('voice-signal', (data: { active: boolean }) => {
      if (!currentRoom || !userId) return;
      socket.to(currentRoom).emit('user-voice-active', { userId, active: data.active });
    });

    // Handle disconnecting
    socket.on('disconnect', () => {
      if (!currentRoom || !userId) return;

      const room = rooms.get(currentRoom);
      if (room) {
        room.users.delete(userId);
        
        io.to(currentRoom).emit('user-left', {
          userId,
          activeCount: room.users.size
        });

        if (room.users.size === 0) {
          rooms.delete(currentRoom);
        }
      }
    });
  });
}
export default initMultiplayerSockets;
