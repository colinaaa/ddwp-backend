import { registerEnumType } from 'type-graphql';

import Gender from '@models/gender';
import LineUp from '@models/lineup';
import WerewolfRole from '@models/werewolf/role';
import GameType from '@models/gameType';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'gender of user/student',
});

registerEnumType(LineUp, {
  name: 'LineUp',
  description: '狼人杀阵容组合',
});

registerEnumType(WerewolfRole, {
  name: 'WerewolfRole',
  description: '狼人杀角色',
});

registerEnumType(GameType, {
  name: 'GameType',
  description: '游戏类型',
});
