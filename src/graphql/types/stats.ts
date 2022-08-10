import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const perGameBaseType = {
  fields: () => ({
    fg2a: {
      type: GraphQLFloat,
    }, 
    fg2m: {
      type: GraphQLFloat,
    }, 
    fg2pct: {
      type: GraphQLFloat,
    }, 
    fg3a: {
      type: GraphQLFloat,
    }, 
    fg3m: {
      type: GraphQLFloat,
    }, 
    fg3pct: {
      type: GraphQLFloat,
    }, 
    fga: {
      type: GraphQLFloat,
    }, 
    fgm: {
      type: GraphQLFloat,
    }, 
    fgpct: {
      type: GraphQLFloat,
    }, 
    fta: {
      type: GraphQLFloat,
    }, 
    ftm: {
      type: GraphQLFloat,
    }, 
    ftpct: {
      type: GraphQLFloat,
    }, 
    oreb: {
      type: GraphQLFloat,
    }, 
    dreb: {
      type: GraphQLFloat,
    }, 
    reb: {
      type: GraphQLFloat,
    }, 
    ast: {
      type: GraphQLFloat,
    }, 
    pts: {
      type: GraphQLFloat,
    }, 
    tov: {
      type: GraphQLFloat,
    }, 
    stl: {
      type: GraphQLFloat,
    }, 
    blk: {
      type: GraphQLFloat,
    }, 
    blka: {
      type: GraphQLFloat,
    }, 
    foulp: {
      type: GraphQLFloat,
    }, 
    mins: {
      type: GraphQLFloat,
    },
    season: {
      type: GraphQLString,
    },
    teamCode: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'team_code',
        }
      },
    },
    age: {
      type: GraphQLInt,
    },
  })
};

const totalsBaseType = {
  fields: () => ({
    fg2a: {
      type: GraphQLFloat,
    }, 
    fg2m: {
      type: GraphQLFloat,
    }, 
    fg2pct: {
      type: GraphQLFloat,
    }, 
    fg3a: {
      type: GraphQLFloat,
    }, 
    fg3m: {
      type: GraphQLFloat,
    }, 
    fg3pct: {
      type: GraphQLFloat,
    }, 
    fga: {
      type: GraphQLFloat,
    }, 
    fgm: {
      type: GraphQLFloat,
    }, 
    fgpct: {
      type: GraphQLFloat,
    }, 
    fta: {
      type: GraphQLFloat,
    }, 
    ftm: {
      type: GraphQLFloat,
    }, 
    ftpct: {
      type: GraphQLFloat,
    }, 
    oreb: {
      type: GraphQLFloat,
    }, 
    dreb: {
      type: GraphQLFloat,
    }, 
    reb: {
      type: GraphQLFloat,
    }, 
    ast: {
      type: GraphQLFloat,
    }, 
    pts: {
      type: GraphQLFloat,
    }, 
    tov: {
      type: GraphQLFloat,
    }, 
    stl: {
      type: GraphQLFloat,
    }, 
    blk: {
      type: GraphQLFloat,
    },
    foulp: {
      type: GraphQLFloat,
    }, 
    mins: {
      type: GraphQLFloat,
    },
    trpDbl: {
      type: GraphQLInt,
      extensions: {
        joinMonster: {
          sqlColumn: 'trpdbl',
        }
      },
    },
    season: {
      type: GraphQLString,
    },
    teamCode: {
      type: GraphQLString,
      extensions: {
        joinMonster: {
          sqlColumn: 'team_code',
        }
      },
    },
    age: {
      type: GraphQLInt,
    },
  })
};

export const PlayerStatsPerGameRegular = new GraphQLObjectType({
  ...perGameBaseType,
  name: 'PlayerStatsPerGame',
  extensions: {
    joinMonster: {
      sqlTable: 'player_stats_per_game_regular',
      uniqueKey: 'key',
    },
  },
});

export const PlayerStatsPerGamePlayoffs = new GraphQLObjectType({
  ...perGameBaseType,
  name: 'PlayerStatsPerGamePlayoffs',
  extensions: {
    joinMonster: {
      sqlTable: 'player_stats_per_game_playoffs',
      uniqueKey: 'key',
    },
  },
});

export const PlayerTotalsRegular = new GraphQLObjectType({
  ...totalsBaseType,
  name: 'PlayerTotalsRegular',
  extensions: {
    joinMonster: {
      sqlTable: 'player_totals_regular',
      uniqueKey: 'key',
    },
  },
});

export const PlayerTotalsPlayoffs = new GraphQLObjectType({
  ...totalsBaseType,
  name: 'PlayerTotalsPlayoffs',
  extensions: {
    joinMonster: {
      sqlTable: 'player_totals_playoffs',
      uniqueKey: 'key',
    },
  },
});
