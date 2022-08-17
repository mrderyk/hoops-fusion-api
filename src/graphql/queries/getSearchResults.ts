import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';
import joinMonster, { Direction } from 'join-monster';
import { pool } from '../../pool';

const SearchResult = new GraphQLObjectType({
  name: 'PlayerSearchResult',
  extensions: {
    joinMonster: {
      sqlTable: 'players',
      uniqueKey: 'key'
    },
  },
  fields: () => ({
    firstName: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'first_name',
        }
      },
    },
    lastName: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'last_name',
        }
      }
    },
    imgUrl: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'bbref_img_url',
        }
      }
    },
    key: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'key',
        }
      }
    },
    teamCode: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'team_code',
        }
      }
    },
    twitter: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'twitter',
        }
      }
    }
  })
});

export const searchPlayers = {
  type: new GraphQLList(SearchResult),
  args: {
    searchString: { type: GraphQLString },
    hasTwitter: { type: GraphQLBoolean }
  },
  extensions: {
    joinMonster: {
      where: (playersTable: any, args: any, context: any) => {
        console.log(context);
        const searchString = args.searchString;
        let where = `'${searchString}' = ANY(${playersTable}.search_tokens)`;

        if (args.hasTwitter) {
          where = `${where} AND twitter IS NOT NULL`;
        }

        return where;
      },
    }
  },
  resolve: (parent: any, args: any, context: any, resolveInfo: any) => {
    return joinMonster(resolveInfo, {}, (sql: any) => {
      return pool.query(sql);
    })
  }
}