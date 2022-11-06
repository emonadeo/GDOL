-- name: LevelFindRecords :many
SELECT r.timestamp,
    r.percentage,
    r.video,
    r.user_id,
    users.name,
    users.nationality
FROM (
        SELECT *
        FROM records
        WHERE records.level_id = $1
    ) AS r
    JOIN users ON users.id = r.user_id
ORDER BY r.percentage DESC,
    r.timestamp ASC;