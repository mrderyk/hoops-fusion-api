import { GraphQLSchema } from 'graphql'
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { getAllPlayerKeys } from './queries/getAllPlayerKeys';
import { getPlayersByLetter } from './queries/getPlayersByLetter';
import { player } from './queries/player';
import { searchPlayers } from './queries/search';
import { getPlayerStatsPerGame, getPlayerStatsPerGamePlayoffs } from './queries/per_game_stats';
import { getPlayerTotalsRegular, getPlayerTotalsPlayoffs } from './queries/total_stats';
import { getPlayerSocials } from './queries/socials';
import { getChartData } from './queries/chart-data';
import { getLeagueLeaders } from './queries/getLeagueLeaders'

const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: GraphQLString,
      resolve: () => 'Hello world!'
    },
    getPlayersByLetter,
    searchPlayers,
    player,
    getAllPlayerKeys,
    getPlayerStatsPerGame,
    getPlayerStatsPerGamePlayoffs,
    getPlayerTotalsRegular,
    getPlayerTotalsPlayoffs,
    getPlayerSocials,
    getChartData,
    getLeagueLeaders,
  })
})

export const schema = new GraphQLSchema({
  description: 'Hoops Fusion Schema',
  query: QueryRoot
})