import { Field, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import GameType from '@models/gameType';

import { IRoom } from '../room';
import WerewolfConfig from './config';

@ObjectType({ implements: IRoom, description: '狼人杀房间' })
class WerewolfRoom extends IRoom {
  @Field(() => WerewolfConfig, { description: '狼人杀游戏配置' })
  @prop({ required: true })
  gameConfig!: WerewolfConfig;

  @Field(() => GameType, { description: '游戏类型' })
  @prop({ required: true, enum: GameType })
  gameType: GameType = GameType.Werewolf;
}

const WerewolfRoomModel = getModelForClass(WerewolfRoom);
const WerewolfRoomModelName = WerewolfRoomModel.modelName;

export { WerewolfRoom, WerewolfRoomModel, WerewolfRoomModelName };

export default WerewolfRoom;
