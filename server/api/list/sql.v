module list

const (
	qry_list = '
		SELECT
			levels.id,
			levels.name,
			levels.gd_id,
			levels.video,
			levels.requirement,
			users.id,
			users.name,
			users.nationality,
			verifier.id,
			verifier.name,
			verifier.nationality
		FROM (
			SELECT *
			FROM list_log
			ORDER BY list_log.timestamp DESC LIMIT 1
		) AS latest_list_log,
		UNNEST(list_level_ids) WITH ORDINALITY
		JOIN levels ON levels.id = unnest
		JOIN users ON users.id = levels.user_id
		JOIN users verifier ON verifier.id = levels.verifier_id
		ORDER BY ordinality ASC;
	'

	qry_level_by_rank = '
		SELECT
			levels.id,
			levels.name,
			levels.gd_id,
			levels.video,
			levels.requirement,
			users.id,
			users.name,
			users.nationality,
			verifier.id,
			verifier.name,
			verifier.nationality
		FROM (
			SELECT list_level_ids[$1] AS list_level_id FROM list_log
			ORDER BY list_log.timestamp DESC
			LIMIT 1
		) AS _
		JOIN levels ON levels.id = list_level_id
		JOIN users ON users.id = levels.user_id
		JOIN users verifier ON verifier.id = levels.verifier_id
	'

	qry_creators = '
		SELECT
			users.id,
			users.name,
			users.nationality
		FROM
			user_created_level
			JOIN users ON users.id = user_created_level.user_id
		WHERE
			user_created_level.level_id = $1;
	'
)
