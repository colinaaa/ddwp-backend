import { Resolver } from 'type-graphql';
import { Inject, Service } from 'typedi';

import RoomService, { RoomServiceName } from '@services/room';
import { AvalonRoom, AvalonRoomModelName } from '@models/avalon/room';

import { createAbstractRoom } from './base';

const AvalonBaseResolver = createAbstractRoom('avalon', AvalonRoom);

@Service()
@Resolver(() => AvalonRoom)
class Avalon extends AvalonBaseResolver {
  @Inject(`${AvalonRoomModelName}${RoomServiceName}`)
  protected readonly service!: RoomService;
}

export { Avalon };

export default Avalon;
