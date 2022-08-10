import {
  GraphQLList,
  GraphQLString
} from 'graphql';
import joinMonster, { Direction } from 'join-monster';
import { pool } from '../db';
import { PlayerSocials } from '../types/socials';

export const getPlayerSocials = {
  type: new GraphQLList(PlayerSocials),
  args: {
    key: { type: GraphQLString }
  },
  extensions: {
    joinMonster: {
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
};
