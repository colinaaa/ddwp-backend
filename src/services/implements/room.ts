import { Container, Service } from 'typedi';
import { ReturnModelType } from '@typegoose/typegoose';

import logger from '@shared/Logger';
import { randomRoomNumber } from '@shared/random';
import { IRoom } from '@models/room';
import { WerewolfRoomModel } from '@models/werewolf/room';
import InputGameConfig from '@/schema/resolvers/input/gameConfig';

import { IRoomService, RoomServiceName } from '../room';

type ModelT = ReturnModelType<typeof IRoom>;

const Models = [WerewolfRoomModel];

@Service(RoomServiceName)
class RoomService implements IRoomService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private readonly model: ReturnModelType<typeof IRoom>) {}

  async findByNumber(num: string | number) {
    return this.model.findOne({ roomNumber: +num });
  }

  async find(cond: Partial<IRoom> = {}) {
    return this.model.find(cond);
  }

  async createRoom(gameConfig: InputGameConfig): Promise<IRoom> {
    const { gameType, lineup } = gameConfig;
    const num = await randomRoomNumber();

    const playersNumber = lineup.map(({ count }) => count).reduce((acc, cur) => acc + cur, 0);

    return this.model.create({
      gameType,
      gameConfig,
      players: [],
      playersNumber,
      roomNumber: num,
    });
  }

  async joinRoom(roomNumber: number): Promise<IRoom | null> {
    // TODO: 房间已满
    return this.model.findOneAndUpdate(
      {
        roomNumber,
      },
      { $push: { players: { position: -1 } } },
      { new: true }
    );
  }

  async beginGame(roomNumber: number): Promise<IRoom | null> {
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

  async selectPosition(roomNumber: number, position: number): Promise<IRoom | null> {
    return this.model.findOneAndUpdate(
      { roomNumber },
      { $push: { players: { position } } },
      { new: true }
    );
  }
}

logger.info('Register RoomSerivce');
const injectModel = (model: ModelT) => {
  logger.info(`  - Register ${model.modelName}${RoomServiceName}`);
  Container.set(`${model.modelName}${RoomServiceName}`, new RoomService(model));
};

Models.forEach((model) => injectModel(model));
