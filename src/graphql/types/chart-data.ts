import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList
} from 'graphql';

const ChartingStat = new GraphQLObjectType({
  name: 'ChartingStat',
  fields: () => ({
    playerKey: {
      type: GraphQLString,
    },
    season: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLFloat,
    }
  }),
  
});

export const PerGameRegularChartData = new GraphQLObjectType({
  name: 'PerGameRegularChartData',
  extensions: {
    joinMonster: {
      sqlTable: 'player_stats_per_game_regular',
      uniqueKey: 'key',
    },
  },
  fields: () => ({
    ppg: {
      type: ChartingStat,
      extensions: {
        joinMonster: {
          sqlDeps: ['player_key', 'season', 'ptspg']
        }
      },
      resolve: table => ({
        playerKey: table.player_key,
        season: table.season,
        value: table.ptspg
      })
    }
  })
});