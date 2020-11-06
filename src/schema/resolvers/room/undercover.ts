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

import createAbstractRoom from './base';

const prefix = 'undercover';

const NotificationTopic = `${RoomServiceName}NOTIFICATION`;
const JoinRoomTopic = `Join${NotificationTopic}`;
type NotificationPayload = Partial<IRoom>;

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
}

export default UnderCover;
