import { Field, InputType, Int } from 'type-graphql';

import GameType from '@models/gameType';

import { InputRole } from './role';

@InputType({ description: '创建游戏配置', isAbstract: true })
abstract class InputGameConfig {
  @Field(() => Int, { description: '总人数' })
  totalNumber!: number;

  @Field(() => GameType, { description: '游戏类型' })
  gameType!: GameType;

  @Field(() => [InputRole], { description: '阵容', defaultValue: [] })
  lineup!: Array<InputRole>;
}

export { InputGameConfig };

export default InputGameConfig;
