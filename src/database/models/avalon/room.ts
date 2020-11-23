import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import GameType from '@models/gameType';

import { IRoom } from '../room';
import GameConfig from './config';

@ObjectType({ implements: IRoom, description: '阿瓦隆房间' })
class AvalonRoom extends IRoom {
  @Field(() => GameConfig, { description: '阿瓦隆游戏配置' })
  @prop({ required: true, _id: false })
  gameConfig!: GameConfig;

  @Field(() => GameType, { description: '游戏类型' })
  @prop({ required: true, enum: GameType })
  gameType: GameType = GameType.Avalon;
}

const AvalonRoomModel = getModelForClass(AvalonRoom);
const AvalonRoomModelName = AvalonRoomModel.modelName;

export { AvalonRoom, AvalonRoomModel, AvalonRoomModelName };

export default AvalonRoom;
