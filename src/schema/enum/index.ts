import { registerEnumType } from 'type-graphql';

import Gender from '@models/gender';

registerEnumType(Gender, {
  name: 'Gender',
  description: 'gender of user/student',
});
