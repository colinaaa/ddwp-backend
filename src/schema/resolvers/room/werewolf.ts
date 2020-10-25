/* eslint-disable class-methods-use-this */
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Int,
  Subscription,
  Root,
  PubSub,
  Publisher,
} from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { WerewolfRoom, WerewolfRoomModelName } from '@models/werewolf/room';
import logger from '@shared/Logger';

import { InputGameConfig } from '../input/gameConfig';

type NotificationPayload = Partial<WerewolfRoom>;
type Notification = NotificationPayload;

const NotificationTopic = `${RoomServiceName}NOTIFICATION`;
const JoinRoomTopic = `Join${NotificationTopic}`;
const BeginGameTopic = `Begin${NotificationTopic}`;
const SelectPosTopic = `Pos${NotificationTopic}`;

@Service()
@Resolver(WerewolfRoom)
class RoomResolver {
  @Inject(`${WerewolfRoomModelName}${RoomServiceName}`)
  private readonly service!: RoomService;

  @Query(() => [WerewolfRoom], { nullable: true })
  async allRooms(): Promise<WerewolfRoom[] | null> {
    return this.service.find();
  }

  @Query(() => WerewolfRoom, { description: '查询房间' })
  async roomByNumber(@Arg('number', () => Int) num: number): Promise<WerewolfRoom> {
    const room = await this.service.findByNumber(num);
    if (!room) {
      logger.error('查询房间 %s 失败', num);
      throw new Error('not found');
    }
    return room;
  }

  @Mutation(() => WerewolfRoom, { description: '创建房间' })
  async createRoom(@Arg('config') config: InputGameConfig): Promise<WerewolfRoom> {
    const room = await this.service.createRoom(config);

    if (!room || !room.roomNumber) {
      logger.error('创建房间失败，模版 %s', config);
      throw new Error('创建房间失败');
    }

    logger.info('create room with number: %s', room.roomNumber);

    return room;
  }

  @Mutation(() => WerewolfRoom, { description: '加入房间' })
  async joinRoom(
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number,
    @PubSub(JoinRoomTopic) publish: Publisher<NotificationPayload>
  ): Promise<WerewolfRoom> {
    const room = await this.service.joinRoom(roomNumber);

    if (!room) {
      logger.error('加入房间 %s 失败', roomNumber);
      throw new Error('加入房间失败');
    }

    await publish(room);

    return room;
  }

  @Mutation(() => WerewolfRoom, { description: '开始游戏' })
  async beginGame(
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number,
    @PubSub(BeginGameTopic) publish: Publisher<NotificationPayload>
  ): Promise<WerewolfRoom> {
    const room = await this.service.beginGame(roomNumber);

    if (!room) {
      logger.error('开始游戏失败 %s', roomNumber);
      throw new Error('开始游戏失败');
    }

    await publish(room);

    return room;
  }

  @Mutation(() => WerewolfRoom, { description: '选择位置' })
  async selectPosition(
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number,
    @Arg('position', () => Int, { description: '位置' }) position: number,
    @PubSub(SelectPosTopic) publish: Publisher<NotificationPayload>
  ): Promise<WerewolfRoom> {
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

    await publish(res);

    return res;
  }

  @Subscription(() => WerewolfRoom, {
    description: '订阅狼人杀房间变化',
    topics: [JoinRoomTopic, BeginGameTopic, SelectPosTopic],
    filter: ({ args, payload }) => args.roomNumber === payload.roomNumber,
  })
  roomUpdated(
    @Root() roomUpdatedPayload: NotificationPayload,
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number
  ): Notification {
    logger.info('subscript on room', roomNumber);
    return roomUpdatedPayload;
  }
}

export default RoomResolver;
