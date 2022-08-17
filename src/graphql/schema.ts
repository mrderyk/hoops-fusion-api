import { GraphQLSchema } from 'graphql'
import { GraphQLObjectType, GraphQLString } from 'graphql'
import { getAllPlayerKeys } from './queries/getAllPlayerKeys';
import { getPlayersByLetter } from './queries/getPlayersByLetter';
import { getPlayer } from './queries/getPlayer';
import { searchPlayers } from './queries/getSearchResults';
import { getPlayerStatsPerGame, getPlayerStatsPerGamePlayoffs } from './queries/getPerGameStats';
import { getPlayerTotalsRegular, getPlayerTotalsPlayoffs } from './queries/getTotalStats';
import { getPlayerSocials } from './queries/getPlayerSocials';
import { getChartData } from './queries/getChartData';
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
    getPlayer,
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