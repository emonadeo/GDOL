-- Create "users" table
CREATE TABLE `users` (
	`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name` TEXT NOT NULL,
	`nationality` TEXT,
	`discord_id` TEXT
);
-- Create "levels" table
CREATE TABLE `levels` (
	`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`name` TEXT NOT NULL,
	`gd_id` INTEGER,
	`user_id` INTEGER NOT NULL,
	`verifier_id` INTEGER NOT NULL,
	`video` TEXT,
	`requirement` INTEGER,
	CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
	CONSTRAINT `verifier_id` FOREIGN KEY (`verifier_id`) REFERENCES `users` (`id`)
);
-- Create "user_created_level" table
CREATE TABLE `user_created_level` (
	`user_id` INTEGER NOT NULL,
	`level_id` INTEGER NOT NULL,
	PRIMARY KEY (`user_id`, `level_id`),
	CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
	CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
);
-- Create "records" table
CREATE TABLE `records` (
	`timestamp` INTEGER NOT NULL,
	`percentage` INTEGER NOT NULL,
	`video` TEXT,
	`user_id` INTEGER NOT NULL,
	`level_id` INTEGER NOT NULL,
	PRIMARY KEY (`user_id`, `level_id`),
	CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
	CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
);
-- Create "list_archive" table
CREATE TABLE `list_archive` (
	`level_id` INTEGER NOT NULL,
	`timestamp` INTEGER NOT NULL,
	PRIMARY KEY (`level_id`),
	CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
);
-- Create "list_log" table
CREATE TABLE `list_log` (
	`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	`list_level_ids` TEXT NOT NULL,
	`timestamp` INTEGER NOT NULL,
	`action` TEXT CHECK (`action` IN ('add', 'archive', 'move')) NOT NULL,
	`level_id` INTEGER NOT NULL,
	`from` INTEGER,
	`to` INTEGER,
	`reason` TEXT,
	CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
);
-- Create "list" view
CREATE VIEW list AS
	SELECT
		row_number() OVER (ORDER BY json_each.key ASC) AS rank,
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
		(
			SELECT
				list_level_ids
			FROM list_log
			ORDER BY timestamp DESC
			LIMIT 1
		)
		JOIN levels ON levels.id = json_each.value
		JOIN users AS user ON levels.user_id = user.id
		JOIN users AS verifier ON levels.verifier_id = verifier.id
		JOIN user_created_level ON levels.id = user_created_level.level_id
		JOIN users AS creator ON user_created_level.user_id = creator.id
	GROUP BY levels.id
	ORDER BY json_each.key ASC;
