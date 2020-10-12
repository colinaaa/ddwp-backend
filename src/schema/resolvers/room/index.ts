import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { Room } from '@models/room';
import { Error } from 'mongoose';
import LineUp from '@models/lineup';
import logger from '@shared/Logger';

@Service()
@Resolver(Room)
class RoomResolver {
  @Inject(RoomServiceName)
  private readonly service!: RoomService;

  @Query(() => [Room], { nullable: 'items' })
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
}

export default RoomResolver;
