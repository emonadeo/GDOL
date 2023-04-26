SELECT
	list_log.timestamp,
	list_log.action,
	list_log."from",
	list_log."to",
	list_log.reason,
	level.id AS level_id,
	level.name AS level_name,
	list_level_ids,
	json_group_array(list_levels.name) AS list_level_names
FROM
	json_each(list_log.list_level_ids),
	list_log
	JOIN levels AS level ON level.id = list_log.level_id
	JOIN levels AS list_levels ON list_levels.id = json_each.value
GROUP BY list_log.id
ORDER BY list_log.timestamp DESC;

