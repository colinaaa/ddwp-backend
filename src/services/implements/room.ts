import { Container, Service } from 'typedi';

import logger from '@shared/Logger';
import { randomRoomNumber } from '@shared/random';
import { Room, RoomModel } from '@models/room';
import { LineUp } from '@models/lineup';

import { IRoomService, RoomServiceName } from '../room';

@Service(RoomServiceName)
class RoomService implements IRoomService {
  private readonly model = RoomModel;

  async findByNumber(num: string | number) {
    return this.model.findOne({ roomNumber: +num });
  }

  async find(cond: Partial<Room> = {}) {
    return this.model.find(cond);
  }

  async createRoom(lineup: LineUp): Promise<Room> {
    const num = await randomRoomNumber();

    return this.model.create({
      lineup,
      roomNumber: num,
      playersNumber: 1,
      isBegin: false,
      players: [],
    });
  }

  async joinRoom(roomNumber: number): Promise<Room | null> {
    return this.model.findOneAndUpdate(
      { roomNumber },
      { $inc: { playersNumber: 1 }, $push: { players: { position: -1 } } }
    );
  }
}

logger.info('Register RoomSerivce');
Container.set(RoomServiceName, new RoomService());
