import { Container, Service } from 'typedi';
import { ReturnModelType } from '@typegoose/typegoose';

import logger from '@shared/Logger';
import { randomRoomNumber } from '@shared/random';
import { IRoom } from '@models/room';
import { WerewolfRoomModel } from '@models/werewolf/room';
import { UnderCoverRoomModel } from '@models/undercover/room';

import InputGameConfig from '@input/gameConfig';

import { IRoomService, RoomServiceName } from '../room';

type ModelT = ReturnModelType<typeof IRoom>;

const Models = [WerewolfRoomModel, UnderCoverRoomModel];

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

  async updateRoom(roomNumber: number, what: Partial<IRoom>): Promise<IRoom | null> {
    return this.model.findOneAndUpdate({ roomNumber }, { $set: what }, { new: true });
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
    const room = await this.findByNumber(roomNumber);
    if (!room) {
      logger.error('选择位置失败 %s ，房间不存在', roomNumber);
      throw new Error('选择位置失败');
    }

    const { players, _id: id } = room;

    const set = new Set(players.map(({ position }) => position));

    if (set.has(position)) {
      logger.error('选择位置失败 %s ，座位已有人', roomNumber);
      throw new Error('座位已有人');
    }

    const index = players.findIndex(({ position }) => position === -1);

    if (index === -1) {
      logger.error('%s 未找到空位置 %s', roomNumber, players);
    }

    players[index].position = position;

    return this.model.findByIdAndUpdate(id, { $set: { players } }, { new: true });
  }
}

logger.info('Register RoomSerivce');
const injectModel = (model: ModelT) => {
  logger.info(`  - Register ${model.modelName}${RoomServiceName}`);
  Container.set(`${model.modelName}${RoomServiceName}`, new RoomService(model));
};

Models.forEach((model) => injectModel(model));
