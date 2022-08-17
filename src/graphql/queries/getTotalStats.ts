import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import joinMonster, { Direction } from 'join-monster';
import { pool } from '../../pool';
import { PlayerTotalsPlayoffs, PlayerTotalsRegular } from '../types/stats';

const baseQuery = (type: GraphQLObjectType) => ({
  type: new GraphQLList(type),
  args: {
    key: { type: GraphQLString }
  },
  extensions: {
    joinMonster: {
      orderBy: [
        { column: 'season', direction: 'asc' as Direction }
      ],
      where: (playersTable: any , args: any, context: any) => {
        const key = args.key;
        return `player_key = '${key}'`
      }
    }
  },
  resolve: (parent: any, args: any, context: any, resolveInfo: any) => {
    return joinMonster(resolveInfo, {}, (sql: any) => {
      return pool.query(sql);
    })
  }
});

export const getPlayerTotalsRegular = {
  ...baseQuery(PlayerTotalsRegular),
};

export const getPlayerTotalsPlayoffs = {
  ...baseQuery(PlayerTotalsPlayoffs),
};
