import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { Room } from '@models/room';
import LineUp from '@models/lineup';
import logger from '@shared/Logger';

@Service()
@Resolver(Room)
class RoomResolver {
  @Inject(RoomServiceName)
  private readonly service!: RoomService;

  @Query(() => [Room], { nullable: true })
  async allRooms(): Promise<Room[] | null> {
    return this.service.find();
  }

  @Query(() => Room, { description: '查询房间' })
  async roomByNumber(@Arg('number') num: number): Promise<Room> {
    const room = await this.service.findByNumber(num);
    if (!room) {
      logger.error('查询房间 %s 失败', num);
      throw new Error('not found');
    }
    return room;
  }

  @Mutation(() => Room, { description: '创建房间' })
  async createRoom(@Arg('lineup') lineup: LineUp): Promise<Room> {
    const room = await this.service.createRoom(lineup);

    if (!room || !room.roomNumber) {
      logger.error('创建房间失败，模版 %s', lineup);
      throw new Error('创建房间失败');
    }

    logger.info('create room with number: %s', room.roomNumber);

    return room;
  }

  @Mutation(() => Room, { description: '加入房间' })
  async joinRoom(@Arg('roomNumber', { description: '房间号' }) roomNumber: number): Promise<Room> {
    const room = await this.service.joinRoom(roomNumber);

    if (!room) {
      logger.error('加入房间 %s 失败', roomNumber);
      throw new Error('加入房间失败');
    }

    return room;
  }

  @Mutation(() => Room, { description: '开始游戏' })
  async beginGame(@Arg('roomNumber', { description: '房间号' }) roomNumber: number): Promise<Room> {
    const room = await this.service.beginGame(roomNumber);

    if (!room) {
      logger.error('开始游戏失败 %s', roomNumber);
      throw new Error('开始游戏失败');
    }

    return room;
  }

  @Mutation(() => Room, { description: '选择位置' })
  async selectPosition(
    @Arg('roomNumber', { description: '房间号' }) roomNumber: number,
    @Arg('position', { description: '位置' }) position: number
  ): Promise<Room> {
    const room = await this.roomByNumber(roomNumber);

    if (position > room.playersNumber) {
      logger.error('位置已经有人了 %s: %s', roomNumber, position);
      throw new Error('位置已经有人了');
    }

    const set = new Set<number>(room.players.map((i) => i.position));

    if (set.has(position)) {
      logger.error('位置已经有人了 %s: %s', roomNumber, position);
      throw new Error('位置已经有人了');
    }

    const res = await this.service.selectPosition(roomNumber, position);

    if (!res) {
      logger.error('选择位置失败 %s: %s', roomNumber, position);
      throw new Error('选择失败');
    }

    return res;
  }
}

export default RoomResolver;
