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
      players: [],
    });
  }

  async joinRoom(roomNumber: number): Promise<Room | null> {
    // TODO: 房间已满
    return this.model.findOneAndUpdate(
      {
        roomNumber,
      },
      { $inc: { playersNumber: 1 } },
      { new: true }
    );
  }

  async beginGame(roomNumber: number): Promise<Room | null> {
    const room = await this.findByNumber(roomNumber);

    if (!room) {
      return null;
    }

    if (room.canBegin()) {
      const { _id: id } = room;
      return this.model.findByIdAndUpdate(id, { $set: { isBegin: true } }, { new: true });
    }

    throw new Error('还不能开始游戏');
  }

  async selectPosition(roomNumber: number, position: number): Promise<Room | null> {
    return this.model.findOneAndUpdate(
      { roomNumber },
      { $push: { players: { position } } },
      { new: true }
    );
  }
}

logger.info('Register RoomSerivce');
Container.set(RoomServiceName, new RoomService());
