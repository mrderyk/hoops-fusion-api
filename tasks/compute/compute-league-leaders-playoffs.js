const { Pool } = require('pg');

const connectConfig = {
  user: process.env.DATABASE_USER ?? 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  database: process.env.DATABASE_NAME ?? 'hoopsfusion',
  password: process.env.DATABASE_PASSWORD ?? 'password',
  port: parseInt(process.env.DATABASE_PORT ?? '5432'),
};

if (process.env.NODE_ENV === 'production') {
  connectConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(connectConfig);

const SEASON = '2021-2022';
const SIMPLE_QUALIFYING_CRITERIA = {
  totalSeasonGames: 16,
};
const TABLE_NAME = 'player_stats_per_game_playoffs';
const TOTALS_TABLE_NAME = 'player_totals_playoffs';
const LEADERS_TABLE_NAME = 'league_leaders_playoffs';
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
  'fgpct': SIMPLE_QUALIFYING_CRITERIA,
  'fg2pct': SIMPLE_QUALIFYING_CRITERIA,
  'fg3pct': SIMPLE_QUALIFYING_CRITERIA,
  'ftpct': SIMPLE_QUALIFYING_CRITERIA,
};

const buildSelectSql = (stat, qualifyingCriteria) => {
  // This query is basura.
  // Fix so that if a player was on two more teams, only get TOT entry.
  const baseQuery = `
    SELECT
      ${TABLE_NAME}.player_key,
      ${TABLE_NAME}.team_code,
      ${TABLE_NAME}.${stat} as ${stat}
    FROM ${TABLE_NAME}
    INNER JOIN ${TOTALS_TABLE_NAME}
    ON ${TABLE_NAME}.player_key = ${TOTALS_TABLE_NAME}.player_key
  `;

  let qualifier = `
    WHERE
      ${TABLE_NAME}.season = '${SEASON}'
      AND ${TOTALS_TABLE_NAME}.season = '${SEASON}'
      AND ${TABLE_NAME}.${stat} IS NOT NULL
  `;

  if (qualifyingCriteria.rawStat && qualifyingCriteria.rawStatMinPerGame) {
    qualifier = `${qualifier}
        AND (
          ${TOTALS_TABLE_NAME}.g > 57
          OR ${TOTALS_TABLE_NAME}.${qualifyingCriteria.rawStat} / 82 >= ${qualifyingCriteria.rawStatMinPerGame}
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
