-- name: RecordsFindByLevelId :many
SELECT
    records.timestamp,
    records.percentage,
    records.video,
    users.id AS user_id,
    users.name AS user_name,
    users.nationality AS user_nationality,
    users.discord_id AS user_discord_id
FROM
    levels
    JOIN records ON records.level_id = levels.id
    JOIN users ON users.id = records.user_id
WHERE
    levels.id = $1
ORDER BY
    records.percentage DESC,
    records.timestamp ASC;