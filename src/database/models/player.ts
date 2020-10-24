import { Field, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

@ObjectType({ description: '游戏玩家' })
class Player {
  @Field({ description: '角色', nullable: true })
  @prop({ required: false })
  role?: string;

  @Field(() => Int, { description: '位置' })
  @prop({ required: true })
  position!: number;
}

export { Player };

export default Player;
