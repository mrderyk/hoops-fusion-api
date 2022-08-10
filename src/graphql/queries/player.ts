import {
  GraphQLList,
  GraphQLString
} from 'graphql';
import joinMonster from 'join-monster';
import { Player } from '../types/player';
import { pool } from '../db';

export const player = {
  type: new GraphQLList(Player),
  args: {
    key: { type: GraphQLString }
  },
  extensions: {
    joinMonster: {
      where: (playersTable: any , args: any, context: any) => {
        const key = args.key;
        return `key = '${key}'`
      }
    }
  },
  resolve: (parent: any, args: any, context: any, resolveInfo: any) => {
    return joinMonster(resolveInfo, {}, (sql: any) => {
      return pool.query(sql);
    })
  }
}