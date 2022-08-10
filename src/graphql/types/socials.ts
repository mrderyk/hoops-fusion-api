import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const PlayerSocials = new GraphQLObjectType({
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