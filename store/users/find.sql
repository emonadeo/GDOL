SELECT
	users_with_score.id,
	users_with_score.name,
	users_with_score.nationality,
	users_with_score.score,
	(
		(row_number() OVER (ORDER BY (score) DESC)) - (
			row_number() OVER (
				PARTITION BY (score)
				ORDER BY (score) DESC
			) - 1
		)
	) AS rank
FROM
	(
		SELECT
			users.id,
			users.name,
			users.nationality,
			SUM(
				gdol_score(
					records_and_verifications.percentage,
					records_and_verifications.rank,
					records_and_verifications.level_requirement
				)
			) AS score
		FROM
			(
				-- Records
				SELECT
					list.rank,
					list.level_requirement,
					records.user_id,
					records.percentage
				FROM
					list
					JOIN records ON records.level_id = list.level_id
				UNION
				-- Verifications
				SELECT
					list.rank,
					list.level_requirement,
					list.verifier_id,
					100 AS percentage
				FROM list
			) AS records_and_verifications
			RIGHT JOIN users ON records_and_verifications.user_id = users.id
		GROUP BY users.id
	) AS users_with_score;
