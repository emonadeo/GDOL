-- Create "users" table
CREATE TABLE `users` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `nationality` text NULL, `discord_id` text NULL);
-- Create "levels" table
CREATE TABLE `levels` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `name` text NOT NULL, `gd_id` integer NULL, `user_id` integer NOT NULL, `verifier_id` integer NOT NULL, `video` text NULL, `requirement` integer NULL, CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`), CONSTRAINT `verifier_id` FOREIGN KEY (`verifier_id`) REFERENCES `users` (`id`));
-- Create "user_created_level" table
CREATE TABLE `user_created_level` (`user_id` integer NOT NULL, `level_id` integer NOT NULL, PRIMARY KEY (`user_id`, `level_id`), CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`), CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`));
-- Create "records" table
CREATE TABLE `records` (`timestamp` integer NOT NULL, `percentage` integer NOT NULL, `video` text NULL, `user_id` integer NOT NULL, `level_id` integer NOT NULL, PRIMARY KEY (`user_id`, `level_id`), CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`), CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`));
-- Create "list_archive" table
CREATE TABLE `list_archive` (`level_id` integer NOT NULL, `timestamp` integer NOT NULL, PRIMARY KEY (`level_id`), CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`));
-- Create "list_log" table
CREATE TABLE `list_log` (`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT, `list_level_ids` text NOT NULL, `timestamp` integer NOT NULL, `action` text NOT NULL, `level_id` integer NOT NULL, `from` integer NULL, `to` integer NULL, `reason` text NULL, CONSTRAINT `level_id` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`));
