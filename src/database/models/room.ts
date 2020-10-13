import { ObjectType, Field } from 'type-graphql';
import { prop, getModelForClass } from '@typegoose/typegoose';

import LineUp, { mapLineupToPlayerNumbers } from './lineup';
import Player from './player';

@ObjectType({ description: ' 游戏房间' })
export class Room {
  @Field({ description: '房间号' })
  @prop({ required: true })
  roomNumber!: number;

  @Field({ description: '密码' })
  @prop({ required: false })
  password?: string;

  @Field({ description: '玩家人数' })
  @prop({ required: true })
  playersNumber!: number;

  @Field(() => LineUp, { description: '阵容' })
  @prop({ required: true })
  lineup!: LineUp;

  @Field(() => [Player], { description: '玩家信息', nullable: true })
  @prop({ required: false, default: [], type: Player })
  players!: Array<Player>;

  @Field({ description: '是否开始', defaultValue: true })
  @prop({ required: false, default: false })
  isBegin?: boolean;

  @Field({ description: '是否结束', defaultValue: false })
  @prop({ required: false, default: false })
  isEnd?: boolean;

  public canBegin(): boolean {
    return !this.isBegin && this.playersNumber === mapLineupToPlayerNumbers(this.lineup);
  }
}

export const RoomModel = getModelForClass(Room);

export default Room;
