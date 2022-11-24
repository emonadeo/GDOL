-- name: UserFind :many
SELECT
    users.id,
    users.name,
    users.nationality,
    SUM(
        calc_score(
            get_rank(levels.id),
            levels.requirement,
            records.percentage
        )
    ) :: float AS score
FROM
    users
    JOIN records ON users.id = records.user_id
    JOIN levels ON levels.id = records.level_id
GROUP BY
    users.id
ORDER BY
    score DESC;