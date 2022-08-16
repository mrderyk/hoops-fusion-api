const { Pool } = require('pg');

// TODO: DRY up this and league leader compute for playoffs.
const pool = new Pool({
  user: process.env.DATABASE_USER ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  database: process.env.DATABASE_NAME ?? 'hoopsfusion',
  password: process.env.DATABASE_PASSWORD ?? 'password',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
});

const SEASON_TOTAL_GAMES = 82;
const MIN_GAME_PERCENTAGE = 70;
const SEASON = '2021-2022';
const SIMPLE_QUALIFYING_CRITERIA = {
  totalSeasonGames: SEASON_TOTAL_GAMES,
  minGamesPlayedPercentage: MIN_GAME_PERCENTAGE,
};
const TABLE_NAME = 'player_stats_per_game_regular';
const TOTALS_TABLE_NAME = 'player_totals_regular';
const LEADERS_TABLE_NAME = 'league_leaders_regular';
const date = new Date()
const nowUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), 0, 0, 0);
const dateUtc = new Date(nowUtc);

const CATEGORIES_TO_QUALIFYING_CRITERIA = {
  'pts': SIMPLE_QUALIFYING_CRITERIA,
  'ast': SIMPLE_QUALIFYING_CRITERIA,
  'reb': SIMPLE_QUALIFYING_CRITERIA,
  'stl': SIMPLE_QUALIFYING_CRITERIA,
  'blk': SIMPLE_QUALIFYING_CRITERIA,
  'ftm': SIMPLE_QUALIFYING_CRITERIA,
  'fg3m': SIMPLE_QUALIFYING_CRITERIA,
  'fgpct': {
    totalSeasonGames: SEASON_TOTAL_GAMES,
    minGamesPlayedPercentage: MIN_GAME_PERCENTAGE,
    rawStat: 'fgm',
    rawStatMinPerGame: 3.65,
  },
  'fg2pct': {
    totalSeasonGames: SEASON_TOTAL_GAMES,
    minGamesPlayedPercentage: MIN_GAME_PERCENTAGE,
    rawStat: 'fg2m',
    rawStatMinPerGame: 2.65,
  },
  'fg3pct': {
    totalSeasonGames: SEASON_TOTAL_GAMES,
    minGamesPlayedPercentage: MIN_GAME_PERCENTAGE,
    rawStat: 'fg3m',
    rawStatMinPerGame: 1.0,
  },
  'ftpct': {
    totalSeasonGames: SEASON_TOTAL_GAMES,
    minGamesPlayedPercentage: MIN_GAME_PERCENTAGE,
    rawStat: 'ftm',
    rawStatMinPerGame: 1.52,
  },
};

const buildSelectSql = (stat, qualifyingCriteria) => {
  const minGamesPlayed = qualifyingCriteria.minGamesPlayedPercentage ? 
    Math.floor(qualifyingCriteria.totalSeasonGames * (qualifyingCriteria.minGamesPlayedPercentage * .01))
    : 1;
  
  // This query is basura.
  // Fix so that if a player was on two more teams, only get TOT entry.
  const baseQuery = `
    SELECT
      ${TABLE_NAME}.player_key,
      ${TABLE_NAME}.team_code,
      ${TABLE_NAME}.${stat} as ${stat}
    FROM ${TABLE_NAME}
    INNER JOIN player_totals_regular
    ON ${TABLE_NAME}.player_key = player_totals_regular.player_key
  `;

  let qualifier = `
    WHERE
      ${TABLE_NAME}.season = '${SEASON}'
      AND player_totals_regular.season = '${SEASON}'
      AND ${TABLE_NAME}.${stat} IS NOT NULL
  `;

  if (qualifyingCriteria.rawStat && qualifyingCriteria.rawStatMinPerGame) {
    qualifier = `${qualifier}
        AND (
          player_totals_regular.g > 57
          OR player_totals_regular.${qualifyingCriteria.rawStat} / 82 >= ${qualifyingCriteria.rawStatMinPerGame}
        )
        AND ${TABLE_NAME}.${qualifyingCriteria.rawStat} >= ${qualifyingCriteria.rawStatMinPerGame}
    `;
  }

  const suffix = `
    GROUP BY
      ${TABLE_NAME}.player_key,
      ${TABLE_NAME}.${stat},
      ${TABLE_NAME}.team_code
    ORDER by ${TABLE_NAME}.${stat} desc
    LIMIT 100;
  `;

  return `${baseQuery} ${qualifier} ${suffix}`;
};

const buildInsertSql = (category, insertData) => {
  const playerKeysAndStats = insertData.map(i => ({
    player_key: i.playerKey,
    stat: i.stat,
  }));

  return `
    INSERT INTO ${LEADERS_TABLE_NAME}
    (
      date,
      category,
      player_keys_and_stats
    ) VALUES (
      '${dateUtc.toISOString()}',
      '${category}',
      '${JSON.stringify(playerKeysAndStats)}'
    );
  `
}

(() => {
  Object.keys(CATEGORIES_TO_QUALIFYING_CRITERIA).forEach(async category => {
    const selectSql = buildSelectSql(category, CATEGORIES_TO_QUALIFYING_CRITERIA[category]);
    const selectResults = await pool.query(selectSql);
    
    const resultToRows = {};
    const insertData = [];

    selectResults.rows.forEach(row => {
      resultToRows[row.player_key] = resultToRows[row.player_key] ?? [];
      resultToRows[row.player_key].push({ teamCode: row.team_code, stat: row[category] });
    });

    Object.keys(resultToRows).forEach(key => {
      const rowMappings = resultToRows[key];
      const totEntry = rowMappings.find(rowMapping => rowMapping.teamCode === 'TOT');

      if (!!totEntry) {
        resultToRows[key] = [totEntry];
      }

      insertData.push({
        playerKey: key,
        stat: !!totEntry ? totEntry.stat : rowMappings[0].stat,
      });
    });

    const insertSql = buildInsertSql(category, insertData.slice(0, 10).sort((a, b) => b.stat - a.stat));
    await pool.query(insertSql);
  });

  
  
})();


/*

SELECT 
  player_stats_per_game_regular.player_key,
  player_stats_per_game_regular.team_code,
  player_stats_per_game_regular.fg3pct
FROM player_stats_per_game_regular
INNER JOIN player_totals_regular
ON player_stats_per_game_regular.player_key = player_totals_regular.player_key
WHERE
  player_stats_per_game_regular.season = '2021-2022'
  AND player_totals_regular.season = '2021-2022'
  AND player_stats_per_game_regular.fg3pct IS NOT NULL
  AND (
    player_totals_regular.g > 57
    OR (player_totals_regular.fg3m / 82.0) > 1.0)
  AND player_totals_regular.fg3m / player_totals_regular.g > 2.0
GROUP BY
  player_stats_per_game_regular.player_key,
  player_stats_per_game_regular.fg3pct,
  player_stats_per_game_regular.team_code
ORDER BY player_stats_per_game_regular.fg3pct desc
LIMIT 30;

*/