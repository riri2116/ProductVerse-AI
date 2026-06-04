import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useConfigurator } from './ConfiguratorContext';

export interface RemoteCursor {
  userId: string;
  name: string;
  avatar: string;
  x: number;
  y: number;
  z: number;
}

export interface CollaborativeMember {
  userId: string;
  name: string;
  avatar: string;
  voiceActive?: boolean;
}

interface MultiplayerContextType {
  socket: Socket | null;
  activeUsers: CollaborativeMember[];
  remoteCursors: Record<string, RemoteCursor>;
  voiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  broadcastCursor: (x: number, y: number, z: number) => void;
  broadcastMaterialChange: (partName: string, config: any) => void;
  broadcastComment: (comment: any) => void;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { projectId, updateMaterial, comments } = useConfigurator();

  const [activeUsers, setActiveUsers] = useState<CollaborativeMember[]>([]);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, RemoteCursor>>({});
  const [voiceActive, setVoiceActiveState] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token || !user || !projectId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setActiveUsers([]);
      setRemoteCursors({});
      return;
    }

    // Connect to the socket server
    const socket = io('http://localhost:3001', {
      transports: ['websocket']
    });
    socketRef.current = socket;

    // Join room
    socket.emit('join-project', {
      projectId,
      userId: user.id,
      name: user.name,
      avatar: user.avatar
    });

    // Realtime events
    socket.on('active-users', (usersList: { userId: string; cursor: any }[]) => {
      // Setup member list, fetch details
      const list: CollaborativeMember[] = usersList.map(item => ({
        userId: item.userId,
        name: item.userId === user.id ? user.name : 'Team Member',
        avatar: item.userId === user.id ? (user.avatar || '') : 'https://api.dicebear.com/7.x/bottts/svg?seed=' + item.userId
      }));
      setActiveUsers(list);
    });

    socket.on('user-joined', (data: { userId: string; name: string; avatar: string }) => {
      setActiveUsers(prev => {
        if (prev.find(u => u.userId === data.userId)) return prev;
        return [...prev, { userId: data.userId, name: data.name, avatar: data.avatar }];
      });
    });

    socket.on('user-left', (data: { userId: string }) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
      setRemoteCursors(prev => {
        const copy = { ...prev };
        delete copy[data.userId];
        return copy;
      });
    });

    socket.on('cursor-update', (cursor: RemoteCursor) => {
      setRemoteCursors(prev => ({
        ...prev,
        [cursor.userId]: cursor
      }));
    });

    socket.on('material-updated', (data: { partName: string; config: any }) => {
      // Update local configuration without triggering loop
      // We check if it is different, and edit it.
      // Use config parameter keys to update
      Object.keys(data.config).forEach((key: any) => {
        updateMaterial(data.partName, key, data.config[key]);
      });
    });

    socket.on('user-voice-active', (data: { userId: string; active: boolean }) => {
      setActiveUsers(prev => prev.map(u => u.userId === data.userId ? { ...u, voiceActive: data.active } : u));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [projectId, token]);

  const setVoiceActive = (active: boolean) => {
    setVoiceActiveState(active);
    if (socketRef.current) {
      socketRef.current.emit('voice-signal', { active });
    }
  };

  const broadcastCursor = (x: number, y: number, z: number) => {
    if (socketRef.current) {
      socketRef.current.emit('cursor-move', { x, y, z });
    }
  };

  const broadcastMaterialChange = (partName: string, config: any) => {
    if (socketRef.current) {
      socketRef.current.emit('material-change', { partName, config });
    }
  };

  const broadcastComment = (comment: any) => {
    if (socketRef.current) {
      socketRef.current.emit('comment-post', comment);
    }
  };

  return (
    <MultiplayerContext.Provider value={{
      socket: socketRef.current, activeUsers, remoteCursors, voiceActive, setVoiceActive,
      broadcastCursor, broadcastMaterialChange, broadcastComment
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) throw new Error('useMultiplayer must be used inside a MultiplayerProvider');
  return context;
};
