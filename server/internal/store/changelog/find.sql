-- unnest list_before_levels, join with levels, and aggregate back into array
SELECT
    list_log.timestamp,
    list_log.action,
    list_log.from,
    list_log.to,
    list_log.reason,
    level .id,
    level .name,
    -- pass after through
    list_after_level_ids,
    list_after_level_names,
    -- agg before
    array_remove(array_agg(list_before_level.id), NULL) AS list_before_level_ids,
    array_remove(array_agg(list_before_level.name), NULL) AS list_before_level_names
FROM
    (
        -- unnest list_after_levels, join with levels, and aggregate back into array
        SELECT
            list_log.timestamp,
            list_log.action,
            list_log.from,
            list_log.to,
            list_log.reason,
            list_log.level_id,
            -- agg after
            array_remove(array_agg(list_after_level.id), NULL) AS list_after_level_ids,
            array_remove(array_agg(list_after_level.name), NULL) AS list_after_level_names,
            -- unnest before
            UNNEST(
                CASE
                    WHEN list_log.list_before_level_ids <> '{}' THEN list_log.list_before_level_ids
                    ELSE '{NULL}'
                END
            ) AS list_before_level_id
        FROM
            (
                SELECT
                    list_log.timestamp,
                    list_log.action,
                    list_log.from,
                    list_log.to,
                    list_log.reason,
                    list_log.level_id,
                    -- pass before through
                    list_log.list_before_level_ids,
                    -- unnest after
                    UNNEST(
                        CASE
                            WHEN list_log.list_after_level_ids <> '{}' THEN list_log.list_after_level_ids
                            ELSE '{NULL}'
                        END
                    ) AS list_after_level_id
                FROM
                    list_log
                ORDER BY
                    list_log.timestamp DESC
            ) AS list_log
            LEFT JOIN levels list_after_level ON list_after_level.id = list_log.list_after_level_id
        GROUP BY
            list_log.timestamp,
            list_log.action,
            list_log.from,
            list_log.to,
            list_log.reason,
            list_log.level_id,
            -- group unnest back together
            list_log.list_before_level_ids
        ORDER BY
            list_log.timestamp DESC
    ) AS list_log
    LEFT JOIN levels list_before_level ON list_before_level.id = list_log.list_before_level_id
    LEFT JOIN levels level ON level .id = list_log.level_id
GROUP BY
    list_log.timestamp,
    list_log.action,
    list_log.from,
    list_log.to,
    list_log.reason,
    level .id,
    level .name,
    list_log.list_after_level_ids,
    list_log.list_after_level_names
ORDER BY
    list_log.timestamp DESC