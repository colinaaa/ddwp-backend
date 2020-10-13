import LineUp from '@models/lineup';
import { Room } from '@models/room';

export const RoomServiceName = 'RoomService';

export interface IRoomService {
  /**
   * find - find a room by condition
   * @async
   * @param cond the condtion for find
   */
  find(cond?: Partial<Room>): Promise<Room[] | null>;

  findByNumber(num: string | number): Promise<Room | null>;

  createRoom(lineup: LineUp): Promise<Room>;

  joinRoom(roomNumber: number): Promise<Room | null>;

  beginGame(roomNumber: number): Promise<Room | null>;

  selectPosition(roomNumber: number, position: number): Promise<Room | null>;
}

export default IRoomService;
