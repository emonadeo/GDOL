-- name: ChangelogFind :many
SELECT
    list_log_2.timestamp,
    list_log_2.action,
    list_log_2.from,
    list_log_2.to,
    list_log_2.reason,
    llevel.id AS level_id,
    llevel.name AS level_name,
    list_log_2.list_after_level_ids,
    list_log_2.list_after_level_names,
    list_log_2.list_before_level_ids,
    list_log_2.list_before_level_names
FROM
    (
        SELECT
            list_log_1.timestamp,
            list_log_1.action,
            list_log_1.from,
            list_log_1.to,
            list_log_1.reason,
            list_log_1.level_id,
            list_log_1.list_after_level_ids,
            list_log_1.list_after_level_names,
            array_remove(array_agg(list_before_level_id), NULL) :: bigint [ ] AS list_before_level_ids,
            array_remove(array_agg(list_before_level.name), NULL) :: text [ ] AS list_before_level_names
        FROM
            (
                SELECT
                    list_log.timestamp,
                    list_log.action,
                    list_log.from,
                    list_log.to,
                    list_log.reason,
                    list_log.level_id,
                    list_before_level_ids,
                    array_remove(array_agg(list_after_level_id), NULL) :: bigint [ ] AS list_after_level_ids,
                    array_remove(array_agg(list_after_level.name), NULL) :: text [ ] AS list_after_level_names
                FROM
                    list_log,
                    UNNEST(
                        CASE
                            WHEN list_log.list_after_level_ids <> '{}' THEN list_log.list_after_level_ids
                            ELSE '{NULL}'
                        END :: bigint [ ]
                    ) AS list_after_level_id
                    LEFT JOIN levels list_after_level ON list_after_level.id = list_after_level_id
                GROUP BY
                    list_log.id
            ) AS list_log_1,
            UNNEST(
                CASE
                    WHEN list_log_1.list_before_level_ids <> '{}' THEN list_log_1.list_before_level_ids
                    ELSE '{NULL}'
                END :: bigint [ ]
            ) AS list_before_level_id
            LEFT JOIN levels list_before_level ON list_before_level.id = list_before_level_id
        GROUP BY
            list_log_1.timestamp,
            list_log_1.action,
            list_log_1.from,
            list_log_1.to,
            list_log_1.reason,
            list_log_1.level_id,
            list_log_1.list_after_level_ids,
            list_log_1.list_after_level_names
    ) AS list_log_2
    JOIN levels llevel ON llevel.id = list_log_2.level_id
ORDER BY
    list_log_2.timestamp DESC;