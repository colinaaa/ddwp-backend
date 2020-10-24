import { prop } from '@typegoose/typegoose';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType({ description: '角色' })
class Role {
  @Field({ description: '角色名称' })
  @prop({ required: true })
  name!: string;

  @Field(() => Int, { description: '角色数量' })
  @prop({ required: true, default: 0 })
  count!: number;
}

export { Role };

export default Role;
