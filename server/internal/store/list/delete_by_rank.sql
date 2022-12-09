-- name: ListDeleteByRankPushLog :one
INSERT INTO
  list_log (
    "list_level_ids",
    "action",
    "level_id",
    "from",
    "reason"
  )
SELECT
  array_remove(list_level_ids, list_level_ids [ $1 ]),
  'delete',
  list_level_ids [ $1 ],
  $1,
  $2
FROM
  list_log
ORDER BY
  timestamp DESC
LIMIT
  1 RETURNING level_id;

-- name: ListDeleteByRankPushArchive :exec
INSERT INTO
  list_archive ("level_id")
VALUES
  ($1);