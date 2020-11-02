import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import GameType from '@models/gameType';

import { IRoom } from '../room';
import GameConfig from './config';

@ObjectType({ implements: IRoom, description: '谁是卧底房间' })
class UnderCoverRoom extends IRoom {
  @Field(() => GameConfig, { description: '谁是卧底游戏配置' })
  @prop({ required: true, _id: false })
  gameConfig!: GameConfig;

  @Field(() => GameType, { description: '游戏类型' })
  @prop({ required: true, enum: GameType })
  gameType: GameType = GameType.Undercover;
}

const UnderCoverRoomModel = getModelForClass(UnderCoverRoom);
const UnderCoverRoomModelName = UnderCoverRoomModel.modelName;

export { UnderCoverRoom, UnderCoverRoomModel, UnderCoverRoomModelName };

export default UnderCoverRoom;
