import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

export const Player = new GraphQLObjectType({
  name: 'Player',
  extensions: {
    joinMonster: {
      sqlTable: 'players',
      uniqueKey: 'key',
    },
  },
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    key: {
      type: GraphQLString,
    },
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
      },
    },
    position: {
      type: GraphQLString,
    },
    imgUrl: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'bbref_img_url',
        },
      },
    },
    birthCity: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'birth_city',
        },
      },
    },
    birthState: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'birth_state',
        },
      },   
    },
    birthCountry: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'birth_country',
        },
      },
    },
    number: {
      type: GraphQLInt,
      extensions: {
        joinMonster: {
          sqlColumn: 'number',
        },
      },
    },
    dob: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'dob',
        },
      },
      resolve: player => {
        const date = new Date(player.dob);
        return date.toLocaleString('default', {month: 'short', day: 'numeric', year: 'numeric'});
      }
    },
    height: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'height',
        },
      },
      resolve: player => `${Math.floor(player.height / 12)}' ${player.height % 12}"`
    },
    weight: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'weight',
        },
      },
      resolve: player => `${player.weight}lbs`
    },
    team: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'team_code',
        },
      },
    },
    draftYear: {
      type: GraphQLInt,
      extensions: {
        joinMonster: {
          sqlColumn: 'draft_year',
        },
      },
    },
    twitter: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'twitter',
        },
      },
    },
    instagram: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'instagram',
        },
      },
    },
    fullName: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlDeps: ['first_name', 'last_name']
        }
      },
      resolve: player => `${player.first_name} ${player.last_name}`
    }
  })
});