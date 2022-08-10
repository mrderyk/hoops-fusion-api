import {
  GraphQLList, GraphQLObjectType, GraphQLString
} from 'graphql';
import { pool } from '../db';

const PlayerDirectoryEntry = new GraphQLObjectType({
  name: 'PlayerDirectoryEntry',
  fields: () => ({
    key: {
      type: GraphQLString,
    },
    first_name: {
      type: GraphQLString,
    },
    last_name: {
      type: GraphQLString,
    }
  }),
});

export const getPlayersByLetter = {
  type: new GraphQLList(PlayerDirectoryEntry),
  args: {
    startsWith: { type: GraphQLString }
  },
  resolve: async (parent: any, args: any, context: any, resolveInfo: any) => {
    const sql = buildSql(args.startsWith);
    const result = await pool.query(sql);

    return result.rows.map(row => row);
  }
}

const buildSql = (startsWith: string) => {
  return `
    SELECT
      first_name,
      last_name,
      key
    FROM players
    WHERE last_name LIKE '${startsWith.toUpperCase()}%'
    ORDER BY last_name asc;
  `;
};
