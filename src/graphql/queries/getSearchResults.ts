import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import { pool } from '../../pool';

const SearchResult = new GraphQLObjectType({
  name: 'PlayerSearchResult',
  fields: () => ({
    firstName: {
      type: GraphQLString,
    },
    lastName: {
      type: GraphQLString,
    },
    imgUrl: {
      type: GraphQLString,
    },
    key: {
      type: GraphQLString,
    },
    teamCode: {
      type: GraphQLString,
    },
    twitter: {
      type: GraphQLString,
    },
    highlights: {
      type: GraphQLList(GraphQLString),
    }
  })
});

export const searchPlayers = {
  type: new GraphQLList(SearchResult),
  args: {
    searchString: { type: GraphQLString },
    hasTwitter: { type: GraphQLBoolean },
    hasHighlights: { type: GraphQLBoolean }
  },
  resolve: async (parent: any, args: any, context: any, resolveInfo: any) => {
    const sql = buildSql(args.searchString, args.hasTwitter, args.hasHighlights);
    const results = await pool.query(sql);
    return results.rows.map((row: any) => {
      const searchResult = {
        firstName: row.first_name,
        lastName: row.last_name,
        imgUrl: row.bbref_img_url,
        key: row.key,
        teamCode: row.team_code,
      };

      if (row.twitter) {
        (searchResult as any)['twitter'] = row.twitter;
      }

      if (row.youtube_video_ids) {
        (searchResult as any)['highlights'] = row.youtube_video_ids;
      }

      return searchResult;
    })
  }
};

const buildSql = (searchString: string, hasTwitter: boolean, hasHighlights: boolean): string => {
  const fields = [
    'players.first_name',
    'players.last_name',
    'players.bbref_img_url',
    'players.key',
    'players.team_code',
    'players.twitter',
  ];

  const tables = [
    'players'
  ];

  const conditions = [
    `'${searchString}' = ANY(players.search_tokens)`
  ];

  if (hasTwitter) {
    conditions.push('players.twitter IS NOT NULL');
  }

  if (hasHighlights) {
    fields.push('player_socials.youtube_video_ids');
    tables.push('player_socials');
    conditions.push('player_socials.youtube_video_ids IS NOT NULL')
    conditions.push('player_socials.player_key = players.key');
  }

  const query = `
    SELECT ${fields.join(',')}
    FROM ${tables}
    WHERE ${conditions.join(' AND ')}
  `; 
   console.log(query);
  return query;
};
