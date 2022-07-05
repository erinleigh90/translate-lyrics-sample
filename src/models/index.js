// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Song } = initSchema(schema);

export {
  Song
};