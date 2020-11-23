import { ObjectType } from 'type-graphql';

import IGameConfig from '@models/config';

@ObjectType({ implements: IGameConfig, description: '阿瓦隆游戏配置' })
class AvalonConfig extends IGameConfig {}

export { AvalonConfig };

export default AvalonConfig;
