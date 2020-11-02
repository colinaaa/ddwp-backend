import { Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { WerewolfRoom, WerewolfRoomModelName } from '@models/werewolf/room';

import createAbstractRoom from './base';

const WerewolfBaseResolver = createAbstractRoom('werewolf', WerewolfRoom);

@Service()
@Resolver(() => WerewolfRoom)
class Werewolf extends WerewolfBaseResolver {
  @Inject(`${WerewolfRoomModelName}${RoomServiceName}`)
  protected readonly service!: RoomService;
}

export default Werewolf;
