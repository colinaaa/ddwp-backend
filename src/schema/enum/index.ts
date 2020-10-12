import { registerEnumType } from 'type-graphql';

import Gender from '@models/gender';
import LineUp from '@models/lineup';
import Role from '@models/role';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'gender of user/student',
});

registerEnumType(LineUp, {
  name: 'LineUp',
  description: '狼人杀阵容组合',
});

registerEnumType(Role, {
  name: 'Role',
  description: '狼人杀角色',
});
