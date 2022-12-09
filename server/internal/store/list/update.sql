-- name: ListUpdateFindCurrentListLevelIds :one
SELECT
    list_level_ids
FROM
    list_log
ORDER BY
    list_log.timestamp DESC
LIMIT
    1;

-- name: ListUpdateInsert :exec
INSERT INTO
    list_log (
        "list_level_ids",
        "action",
        "level_id",
        "from",
        "to",
        "reason"
    )
VALUES
    ($1, $2, $3, $4, $5, $6);

-- name: ListUpdateDeleteArchive :exec
DELETE FROM
    list_archive
WHERE
    level_id = $1;

-- name: ListUpdateInsertArchive :exec
INSERT INTO
    list_archive (level_id)
VALUES
    ($1);