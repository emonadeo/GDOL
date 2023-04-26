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
	`action` TEXT NOT NULL,
	`level_id` INTEGER NOT NULL,
	`from` INTEGER,
	`to` INTEGER,
	`reason` TEXT,
	CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`)
);
