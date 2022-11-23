-- name: UserFindByName :one
SELECT users4.id,
    users4.name,
    users4.nationality,
    users4.verified_id,
    users4.verified_name,
    users4.published_id,
    users4.published_name,
    users4.created_id,
    users4.created_name,
    array_remove(array_agg(records.timestamp), NULL)::text [] AS record_timestamps,
    array_remove(array_agg(records.percentage), NULL)::int [] AS record_percentage,
    array_remove(array_agg(records.video), NULL)::text [] as record_video,
    array_remove(array_agg(record_level.id), NULL)::bigint [] as record_level_id,
    array_remove(array_agg(record_level.name), NULL)::text [] as record_level_name,
    SUM(
        calc_score(
            get_rank(record_level.id),
            record_level.requirement,
            records.percentage
        )
    )::float AS score
FROM (
        SELECT users3.id,
            users3.name,
            users3.nationality,
            users3.verified_id,
            users3.verified_name,
            users3.published_id,
            users3.published_name,
            array_remove(array_agg(created.id), NULL)::bigint [] AS created_id,
            array_remove(array_agg(created.name), NULL)::text [] AS created_name
        FROM (
                SELECT users2.id,
                    users2.name,
                    users2.nationality,
                    users2.verified_id,
                    users2.verified_name,
                    array_remove(array_agg(published.id), NULL)::bigint [] AS published_id,
                    array_remove(array_agg(published.name), NULL)::text [] AS published_name
                FROM (
                        SELECT users1.id,
                            users1.name,
                            users1.nationality,
                            array_remove(array_agg(verified.id), NULL)::bigint [] AS verified_id,
                            array_remove(array_agg(verified.name), NULL)::text [] AS verified_name
                        FROM (
                                SELECT users.id,
                                    users.name,
                                    users.nationality
                                FROM users
                                WHERE users.name = $1
                            ) AS users1
                            LEFT JOIN levels verified ON verified.verifier_id = users1.id
                        GROUP BY users1.id,
                            users1.name,
                            users1.nationality
                    ) AS users2
                    LEFT JOIN levels published ON published.user_id = users2.id
                GROUP BY users2.id,
                    users2.name,
                    users2.nationality,
                    users2.verified_id,
                    users2.verified_name
            ) AS users3
            LEFT JOIN user_created_level ON user_created_level.user_id = users3.id
            LEFT JOIN levels created ON user_created_level.level_id = created.id
        GROUP BY users3.id,
            users3.name,
            users3.nationality,
            users3.verified_id,
            users3.verified_name,
            users3.published_id,
            users3.published_name
    ) AS users4
    LEFT JOIN records ON records.user_id = users4.id
    LEFT JOIN levels record_level ON record_level.id = records.level_id
GROUP BY users4.id,
    users4.name,
    users4.nationality,
    users4.verified_id,
    users4.verified_name,
    users4.published_id,
    users4.published_name,
    users4.created_id,
    users4.created_name
ORDER BY score DESC;