import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType
} from 'graphql';
import { pool } from '../db';

const PlayerChartStat = new GraphQLObjectType({
  name: 'PlayerChartStat',
  fields: () => ({
    player_key: {
      type: GraphQLString,
    },
    interval: {
      type: GraphQLString,
    },
    stat: {
      type: GraphQLFloat,
    },
    player_name: {
      type: GraphQLString,
    }
  }),
});

export const getChartData = {
  type: new GraphQLList(PlayerChartStat),
  args: {
    keys: { type: new GraphQLList(GraphQLString) },
    timeframe: { type: GraphQLString },
    interval: { type: GraphQLString },
    category: { type: GraphQLString },
    stat: { type: GraphQLString },
  },
  resolve: async (parent: any, args: any, context: any, resolveInfo: any) => {
    const sql = buildSql(
      args.timeframe,
      args.category,
      args.interval,
      args.stat,
      args.keys
    );
    
    const result = await pool.query(sql);
    return result.rows.map(row => ({
      ...row,
      player_name: `${row.first_name} ${row.last_name}`,
    }));
  },
}

type ChartConfigToTableName = {
  [key: string]: {
    [key: string]: string;
  }
};

const chartConfigToTable: ChartConfigToTableName = {
  regular: {
    per_game: 'player_stats_per_game_regular',
    total: 'player_totals_regular',
  },
  playoffs: {
    per_game: 'player_stats_per_game_playoffs',
    total: 'player_totals_playoffs',
  }
};


const buildSql = (timeframe: string, category: string, interval: string, stat: string, playerKeys: string[]) => {
  const tableName = chartConfigToTable[timeframe][category];
  const stringifiedKeys = `'${playerKeys.join("','")}'`;
  return `
    SELECT
      ${tableName}.${interval} as interval,
      ${tableName}.${stat} as stat,
      ${tableName}.player_key,
      players.first_name,
      players.last_name
    FROM ${tableName}
    INNER JOIN
      players ON players.key = ${tableName}.player_key
    WHERE ${tableName}.player_key IN (${stringifiedKeys})
    ORDER BY ${tableName}.${interval} asc;
  `;
};


