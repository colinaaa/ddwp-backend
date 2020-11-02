import { Field, Int, InterfaceType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';

import { LineUp } from './lineup';
import Player from './player';
import GameType from './gameType';
import IGameConfig from './config';

@InterfaceType({ description: ' 游戏房间' })
class IRoom {
  @Field(() => Int, { description: '房间号' })
  @prop({ required: true })
  roomNumber!: number;

  @Field({ description: '密码' })
  @prop({ required: false })
  password?: string;

  @Field(() => Int, { description: '玩家人数' })
  @prop({ required: true })
  playersNumber!: number;

  @Field(() => GameType, { description: '游戏类型' })
  @prop({ required: true, enum: GameType })
  gameType!: GameType;

  @Field(() => IGameConfig, { description: '游戏配置' })
  @prop({ required: true, _id: false })
  gameConfig!: IGameConfig;

  @Field(() => LineUp, {
    description: '阵容',
    deprecationReason: '改为多个游戏，使用GameConfig',
    nullable: true,
  })
  @prop({ required: false, enum: LineUp })
  lineup?: LineUp;

  @Field(() => [Player], { description: '玩家信息', nullable: true })
  @prop({ required: false, default: [], type: Player, _id: false })
  players!: Array<Player>;

  @Field({ description: '是否开始', defaultValue: true })
  @prop({ required: false, default: false })
  isBegin?: boolean;

  @Field({ description: '是否结束', defaultValue: false })
  @prop({ required: false, default: false })
  isEnd?: boolean;

  public canBegin(): boolean {
    return !this.isBegin && this.playersNumber === this.players.length;
  }
}

export { IRoom };

export default IRoom;
