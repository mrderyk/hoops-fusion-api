import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import joinMonster, { Direction } from 'join-monster';
import { pool } from '../../pool';

const PlayerSocials = new GraphQLObjectType({
  name: 'PlayerSocials',
  fields: () => ({
    playerKey: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'player_key',
        }
      },
    },
    youtubeVideoIds: {
      type: new GraphQLList(GraphQLString),
      extensions: {
        joinMonster: {
          sqlColumn: 'youtube_video_ids',
        }
      },
    },
  }),
  extensions: {
    joinMonster: {
      sqlTable: 'player_socials',
      uniqueKey: 'player_key',
    },
  },
});

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
