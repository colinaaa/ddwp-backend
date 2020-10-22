import { ObjectType } from 'type-graphql';

import IGameConfig from '@models/config';
// import GameType from '@models/gameType';

@ObjectType({ implements: IGameConfig, description: '狼人杀游戏配置' })
class WerewolfConfig extends IGameConfig {}

export { WerewolfConfig };

export default WerewolfConfig;
