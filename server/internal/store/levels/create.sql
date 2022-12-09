-- name: LevelsCreate :exec
WITH rows AS (
    INSERT INTO
        levels (
            "name",
            "gd_id",
            "user_id",
            "verifier_id",
            "video",
            "requirement"
        )
    VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        ) RETURNING "id"
)
INSERT INTO
    user_created_level ("user_id", "level_id")
SELECT
    unnest($7 :: bigint [ ]),
    id
FROM
    rows;