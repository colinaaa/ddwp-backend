import { Resolver, Mutation, Arg, PubSub, Publisher, Int } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { UnderCoverRoom, UnderCoverRoomModelName } from '@models/undercover/room';
import { IRoom } from '@models/room';
import { InputGameConfig } from '@input/gameConfig';
import logger from '@shared/Logger';
import { randomWords } from '@models/undercover/words';
import redisClient from '@shared/redis';
import shuffle from '@shared/shuffle';

import { createAbstractRoom, OutTopic, JoinRoomTopic, NotificationPayload } from './base';

const prefix = 'undercover';

const UnderCoverBaseResolver = createAbstractRoom(prefix, UnderCoverRoom);

const redisKeyPrefix = 'k:undercover';
const wordListKey = (roomNumber: number) => `${redisKeyPrefix}:${roomNumber}:wordlist`;

@Service()
@Resolver(() => UnderCoverRoom)
class UnderCover extends UnderCoverBaseResolver {
  @Inject(`${UnderCoverRoomModelName}${RoomServiceName}`)
  protected readonly service!: RoomService;

  @Mutation(() => UnderCoverRoom, {
    name: `${prefix}CreateRoom`,
    description: '创建房间',
  })
  async createRoom(@Arg('config') config: InputGameConfig): Promise<IRoom> {
    const room = await this.service.createRoom(config);

    if (!room || !room.roomNumber) {
      logger.error('创建房间失败，模版 %s', config);
      throw new Error('创建房间失败');
    }

    const { roomNumber, playersNumber } = room;

    await redisClient.del(wordListKey(roomNumber));

    const [word1, word2] = randomWords();

    const wordList = shuffle<string>([...Array(playersNumber - 1).fill(word1), word2]);

    await redisClient.lpush(wordListKey(roomNumber), wordList.slice(1));

    await this.service.joinRoom(roomNumber, { position: -1, role: wordList[0] });

    logger.info('create room with number: %s', room.roomNumber);

    return room;
  }

  @Mutation(() => UnderCoverRoom, {
    name: `${prefix}JoinRoom`,
    description: '加入房间',
  })
  async joinRoom(
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number,
    @PubSub(JoinRoomTopic) publish: Publisher<NotificationPayload>
  ): Promise<IRoom> {
    const role = await redisClient.lpop(wordListKey(roomNumber));

    const room = await this.service.joinRoom(roomNumber, { position: -1, role });

    if (!room) {
      logger.error('加入房间 %s 失败', roomNumber);
      throw new Error('加入房间失败');
    }

    await publish(room);
    return room;
  }

  @Mutation(() => UnderCoverRoom, {
    name: `${prefix}SomeoneOut`,
    description: '选择玩家出局',
  })
  async someoneOut(
    @Arg('roomNumber', () => Int, { description: '房间号' }) roomNumber: number,
    @Arg('index', () => Int, { description: '座位号' }) index: number,
    @PubSub(OutTopic) publish: Publisher<NotificationPayload>
  ): Promise<IRoom> {
    const room = await this.roomByNumber(roomNumber);

    const { players } = room;

    const i = players.findIndex(({ position }) => position === index);

    players[i].isOut = !players[i].isOut;

    const alive = players.filter(({ isOut, role }) => !isOut && role).map(({ role }) => role);
    const aliveSet = new Set(alive);

    if (alive.length === 2 || aliveSet.size === 1) {
      await this.service.updateRoom(roomNumber, { isEnd: true });
      await publish({ ...room, isEnd: true });
      return room;
    }

    const newRoom = await this.service.updateRoom(roomNumber, { players });

    if (!newRoom) {
      logger.error('选择出局失败 %s', roomNumber);
      throw new Error('选择出局失败');
    }

    await publish(newRoom);

    return newRoom;
  }
}

export default UnderCover;
