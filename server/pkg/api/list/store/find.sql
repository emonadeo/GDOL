-- name: ListFind :many
SELECT levels.id,
    levels.gd_id,
    levels.name,
    users.name as user,
    levels.video
FROM (
        SELECT *
        FROM list_log
        ORDER BY list_log.timestamp DESC
        LIMIT 1
    ) AS latest_list_log,
    UNNEST(list_level_ids) WITH ORDINALITY
    JOIN levels ON levels.id = unnest
    JOIN users ON users.id = levels.user_id
ORDER BY ordinality ASC;