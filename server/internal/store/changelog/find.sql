-- name: ChangelogFind :many
SELECT
    list_log_2.timestamp,
    list_log_2.action,
    list_log_2.from,
    list_log_2.to,
    list_log_2.reason,
    llevel.id AS level_id,
    llevel.name AS level_name,
    list_log_2.list_level_ids,
    list_log_2.list_level_names,
    COALESCE(
        LEAD(list_log_2.list_level_ids) OVER (
            ORDER BY
                list_log_2.timestamp DESC
        ),
        '{}'
    ) :: bigint [ ] AS list_before_level_ids,
    COALESCE(
        LEAD(list_log_2.list_level_names) OVER (
            ORDER BY
                list_log_2.timestamp DESC
        ),
        '{}'
    ) :: text [ ] AS list_before_level_names
FROM
    (
        SELECT
            list_log.timestamp,
            list_log.action,
            list_log.from,
            list_log.to,
            list_log.reason,
            list_log.level_id,
            array_remove(array_agg(list_level.id), NULL) :: bigint [ ] AS list_level_ids,
            array_remove(array_agg(list_level.name), NULL) :: text [ ] AS list_level_names
        FROM
            list_log,
            UNNEST(
                CASE
                    WHEN list_log.list_level_ids <> '{}' THEN list_log.list_level_ids
                    ELSE '{NULL}'
                END :: bigint [ ]
            ) AS list_level_id
            LEFT JOIN levels list_level ON list_level.id = list_level_id
        GROUP BY
            list_log.id
    ) AS list_log_2
    JOIN levels llevel ON llevel.id = list_log_2.level_id
ORDER BY
    list_log_2.timestamp DESC;