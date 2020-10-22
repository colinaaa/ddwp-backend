import { Field, InterfaceType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

import { Role } from './role';

@InterfaceType({ description: '创建游戏配置', isAbstract: true })
abstract class IGameConfig {
  @Field({ description: '总人数' })
  @prop({ required: true })
  totalNumber!: number;

  @Field(() => [Role], { description: '阵容', defaultValue: [] })
  @prop({ required: true, type: [Role] })
  lineup!: Array<Role>;
}

export { IGameConfig };

export default IGameConfig;
