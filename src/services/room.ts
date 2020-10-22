import InputGameConfig from '@/schema/resolvers/input/gameConfig';
import { IRoom } from '@models/room';

export const RoomServiceName = 'RoomService';

export interface IRoomService {
  /**
   * find - find a room by condition
   * @async
   * @param cond the condtion for find
   */
  find(cond?: Partial<IRoom>): Promise<IRoom[] | null>;

  findByNumber(num: string | number): Promise<IRoom | null>;

  createRoom(config: InputGameConfig): Promise<IRoom>;

  joinRoom(roomNumber: number): Promise<IRoom | null>;

  beginGame(roomNumber: number): Promise<IRoom | null>;

  selectPosition(roomNumber: number, position: number): Promise<IRoom | null>;
}

export default IRoomService;
