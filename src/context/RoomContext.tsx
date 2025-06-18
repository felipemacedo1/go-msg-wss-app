import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Room {
  id: string;
  theme: string;
}

interface RoomContextProps {
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
}

const RoomContext = createContext<RoomContextProps>({
  rooms: [],
  setRooms: () => {},
});

export const useRooms = () => useContext(RoomContext);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  return (
    <RoomContext.Provider value={{ rooms, setRooms }}>
      {children}
    </RoomContext.Provider>
  );
};
