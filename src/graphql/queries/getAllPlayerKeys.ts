import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { pool } from '../../pool';

const PlayerKeyEntry = new GraphQLObjectType({
  name: 'PlayerKeyEntry',
  fields: () => ({
    key: {
      type: GraphQLString,
    },
  }),
});

export const getAllPlayerKeys = {
  type: new GraphQLList(PlayerKeyEntry),
  resolve: async (parent: any, args: any, context: any, resolveInfo: any) => {
    const sql = buildSql(args.startsWith);
    const result = await pool.query(sql);

    return result.rows.map(row => row);
  }
}

const buildSql = (startsWith: string) => {
  return `
    SELECT
      key
    FROM players
  `;
};
