import { ObjectType } from 'type-graphql';

import IGameConfig from '@models/config';

@ObjectType({ implements: IGameConfig, description: '谁是卧底游戏配置' })
class UnderCoverConfig extends IGameConfig {}

export { UnderCoverConfig };

export default UnderCoverConfig;
