/* eslint-disable max-classes-per-file */
import { Field, InputType, Int } from 'type-graphql';

@InputType({ description: '角色', isAbstract: true })
class InputRole {
  @Field({ description: '角色名称' })
  name!: string;

  @Field(() => Int, { description: '角色数量' })
  count!: number;
}

export { InputRole };

export default InputRole;
