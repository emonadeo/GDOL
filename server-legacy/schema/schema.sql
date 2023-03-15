CREATE TYPE list_log_action AS ENUM ('add', 'archive', 'move');

CREATE TABLE users (
	"id" bigserial primary key,
	"name" text not null unique,
	"nationality" char(2),
	-- https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
	"discord_id" text
);

CREATE TABLE user_has_role (
	"user_id" bigint references users (id) not null,
	"role" text not null
);

CREATE TABLE levels (
	"id" bigserial primary key,
	"name" text not null,
	"gd_id" bigint,
	"user_id" bigint references users (id) not null,
	"verifier_id" bigint references users (id) not null,
	"video" text,
	"requirement" smallint
);

CREATE TABLE user_created_level (
	"user_id" bigint references users (id) not null,
	"level_id" bigint references levels (id) not null
);

CREATE TABLE records (
	"timestamp" timestamp with time zone default now () not null,
	"percentage" smallint not null,
	"video" text,
	"user_id" bigint references users (id) not null,
	"level_id" bigint references levels (id) not null
);

CREATE TABLE list_archive (
	"timestamp" timestamp with time zone default now () not null,
	"level_id" bigint references levels (id) not null
);

CREATE TABLE list_log (
	"id" bigserial primary key,
	"list_level_ids" bigint [ ] not null,
	"timestamp" timestamp with time zone default now () not null,
	"action" list_log_action not null,
	"level_id" bigint references levels (id) not null,
	"from" smallint,
	"to" smallint,
	"reason" text
);

CREATE VIEW list AS
SELECT
	list.rank,
	levels.id,
	levels.name,
	levels.gd_id,
	levels.video,
	levels.requirement,
	users.id AS user_id,
	users.name AS user_name,
	users.nationality AS user_nationality,
	users.discord_id AS user_discord_id,
	verifier.id AS verifier_id,
	verifier.name AS verifier_name,
	verifier.nationality AS verifier_nationality,
	verifier.discord_id AS verifier_discord_id,
	array_remove(array_agg(creators.id), NULL) :: bigint [ ] AS creator_ids,
	array_remove(array_agg(creators.name), NULL) :: text [ ] AS creator_names,
	array_agg(creators.nationality) AS creator_nationalities,
	array_agg(creators.discord_id) AS creator_discord_ids
FROM
	(
		-- UNNEST WITH ORDINALITY is not working with sqlc: https://github.com/kyleconroy/sqlc/issues/1205 
		SELECT
			*,
			generate_subscripts(list.list_level_ids, 1) :: smallint AS rank
		FROM
			(
				SELECT
					list_level_ids
				FROM
					list_log
				ORDER BY
					list_log.timestamp DESC
				LIMIT
					1
			) AS list
	) AS list
	JOIN levels ON levels.id = list.list_level_ids [ list.rank ]
	JOIN users ON users.id = levels.user_id
	JOIN users verifier ON verifier.id = levels.verifier_id
	LEFT JOIN user_created_level ON user_created_level.level_id = levels.id
	LEFT JOIN users creators ON creators.id = user_created_level.user_id
GROUP BY
	list.rank,
	levels.id,
	users.id,
	verifier.id
ORDER BY
	list.rank ASC;

CREATE VIEW users_with_score AS
SELECT
	users. *,
	SUM(calc_score(rank, requirement, percentage)) :: real AS score
FROM
	(
		-- Records
		SELECT
			records.user_id,
			list.rank :: smallint,
			list.requirement,
			records.percentage
		FROM
			list
			JOIN records ON records.level_id = list.id
		UNION
		-- Verifications
		SELECT
			list.verifier_id,
			list.rank :: smallint,
			list.requirement,
			100 :: smallint
		FROM
			list
	) AS records_and_verifications
	RIGHT JOIN users ON records_and_verifications.user_id = users.id
GROUP BY
	users.id
ORDER BY
	SUM(calc_score(rank, requirement, percentage)) DESC;

CREATE VIEW users_with_score_and_rank AS
SELECT
	users_with_score.id,
	users_with_score.name,
	users_with_score.nationality,
	users_with_score.discord_id,
	users_with_score.score,
	row_number() OVER(
		ORDER BY
			users_with_score.score DESC
	) AS rank
FROM
	users_with_score
ORDER BY
	rank ASC;
