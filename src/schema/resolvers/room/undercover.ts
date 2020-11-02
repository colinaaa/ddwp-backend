import { Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { UnderCoverRoom, UnderCoverRoomModelName } from '@models/undercover/room';

import createAbstractRoom from './base';

const UnderCoverBaseResolver = createAbstractRoom('undercover', UnderCoverRoom);

@Service()
@Resolver(() => UnderCoverRoom)
class UnderCover extends UnderCoverBaseResolver {
  @Inject(`${UnderCoverRoomModelName}${RoomServiceName}`)
  protected readonly service!: RoomService;
}

export default UnderCover;
