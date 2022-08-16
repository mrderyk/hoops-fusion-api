import {
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { pool } from '../../pool';

const StatLeaders = new GraphQLObjectType({
  name: 'StatLeaders',
  fields: () => ({
    leaders: {
      type: new GraphQLList(LeagueLeaderEntry),
    },
    category: {
      type: GraphQLString,
    },
  }),
})

const LeagueLeaderEntry = new GraphQLObjectType({
  name: 'LeagueLeaderEntry',
  fields: () => ({
    key: {
      type: GraphQLString,
    },
    first_name: {
      type: GraphQLString,
    },
    last_name: {
      type: GraphQLString,
    },
    img_url: {
      type: GraphQLString,
    },
    stat: {
      type: GraphQLFloat,
    }
  }),
});

interface DbPlayerKeyAndStat {
  stat: string;
  player_key: string;
}

interface DbPlayer {
  key: string;
  first_name: string;
  last_name: string;
  img_url: string;
}

interface CompiledLeagueLeaderEntry extends DbPlayer {
  stat: number;
}

export const getLeagueLeaders = {
  type: StatLeaders,
  args: {
    period: { type: GraphQLString },
    statType: { type: GraphQLString },
    season: { type: GraphQLString },
  },
  resolve: async (parent: any, args: any, context: any, resolveInfo: any) => {
    const selectLeadersSql = buildSelectLeadersSql(args.period, args.statType, args.season);
    const selectLeadersResult = await pool.query(selectLeadersSql);
    const leagueLeaderEntries = selectLeadersResult.rows[0].player_keys_and_stats.map(
      (playerKeyAndStat: DbPlayerKeyAndStat) => ({
        key: playerKeyAndStat.player_key,
        stat: parseFloat(playerKeyAndStat.stat),
      })
    );

    const playerKeys = leagueLeaderEntries.map(
      (leagueLeaderEntry: Partial<CompiledLeagueLeaderEntry>) => leagueLeaderEntry.key
    );
    const selectPlayersSql = buildSelectPlayersSql(playerKeys);
  
    const players = await pool.query(selectPlayersSql);

    players.rows.forEach((player: DbPlayer) => {
      const matchingLeagueLeader = leagueLeaderEntries.find((leagueLeaderEntry: Partial<CompiledLeagueLeaderEntry>) => {
        return leagueLeaderEntry.key === player.key;
      });

      matchingLeagueLeader['first_name'] = player.first_name;
      matchingLeagueLeader['last_name'] = player.last_name;
      matchingLeagueLeader['img_url'] = player.img_url;
    });

    console.log(leagueLeaderEntries);

    return {
      category: args.statType,
      leaders: leagueLeaderEntries,
    }
  }
}

const buildSelectLeadersSql = (period: string, statType: string, season?: string) => {
  const normalizedSeason = season ?? '2021-2022'; // TODO: make this default dynamic;
  const tableName = period === 'playoffs' ? 'league_leaders_playoffs' : 'league_leaders_regular';
  const date = new Date();

  date.setUTCHours(0,0,0,0);
  
  return `
    SELECT
      * 
    FROM ${tableName}
    WHERE
      date >= '${date.toISOString()}'
      AND category = '${statType}'
  `;
};

const buildSelectPlayersSql = (playerKeys: string[]) => {
  const stringifiedKeys = `'${playerKeys.join("','")}'`;
  return `
    SELECT
      key,
      first_name,
      last_name,
      bbref_img_url as img_url
    FROM players
    WHERE key IN (${stringifiedKeys});
  `;
};
