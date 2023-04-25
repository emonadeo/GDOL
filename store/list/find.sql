SELECT
	levels.id AS level_id,
	levels.name AS level_name,
	levels.gd_id AS level_gd_id,
	levels.video AS level_video,
	levels.requirement AS level_requirement,
	user.id AS user_id,
	user.name AS user_name,
	user.nationality AS user_nationality,
	verifier.id AS verifier_id,
	verifier.name AS verifier_name,
	verifier.nationality AS verifier_nationality,
	json_group_array(creator.id) AS creator_ids,
	json_group_array(creator.name) AS creator_names,
	json_group_array(creator.nationality) AS creator_nationalities
FROM
	json_each(list_level_ids),
	(SELECT list_level_ids FROM list_log ORDER BY timestamp DESC LIMIT 1)
	JOIN levels ON levels.id = json_each.value
	JOIN users AS user ON levels.user_id = user.id
	JOIN users AS verifier ON levels.verifier_id = verifier.id
	JOIN user_created_level ON levels.id = user_created_level.level_id
	JOIN users AS creator ON user_created_level.user_id = creator.id
GROUP BY levels.id
ORDER BY json_each.key ASC;
