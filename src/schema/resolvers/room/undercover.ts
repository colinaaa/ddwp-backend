import { Resolver, Mutation, Arg } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { UnderCoverRoom, UnderCoverRoomModelName } from '@models/undercover/room';
import { IRoom } from '@models/room';
import { InputGameConfig } from '@input/gameConfig';
import logger from '@shared/Logger';

import createAbstractRoom from './base';

const prefix = 'undercover';

const UnderCoverBaseResolver = createAbstractRoom(prefix, UnderCoverRoom);

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

    await this.service.joinRoom(room.roomNumber);

    logger.info('create room with number: %s', room.roomNumber);

    return room;
  }
}

export default UnderCover;
