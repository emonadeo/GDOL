-- name: ListFind :many
SELECT levels.*,
    users.*,
    verifier.*
FROM (
        SELECT list_log.list_level_ids
        FROM list_log
        ORDER BY list_log.timestamp DESC
        LIMIT 1
    ) AS latest_list_log,
    UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY AS list_level_id
    JOIN levels ON levels.id = list_level_id
    JOIN users ON users.id = levels.user_id
    JOIN users verifier ON verifier.id = levels.verifier_id
ORDER BY ordinality ASC;
-- name: ListFindCreators :many
SELECT users.*
FROM user_created_level
    JOIN users ON users.id = user_created_level.user_id
WHERE user_created_level.level_id = $1;