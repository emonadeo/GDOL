-- name: UserFindByName :one
SELECT
    *
FROM
    users_with_score_and_rank
WHERE
    users_with_score_and_rank.name = $1;