import { ObjectType, Field } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';

import Role from './role';

@ObjectType()
export class Player {
  @Field(() => Role, { description: '角色' })
  @prop({ required: false })
  role?: Role;

  @Field({ description: '位置' })
  @prop({ required: true })
  position!: number;
}

export const PlayerModel = getModelForClass(Player);

export default Player;
