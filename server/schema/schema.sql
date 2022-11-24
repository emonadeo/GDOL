CREATE TYPE list_log_action AS ENUM ('add', 'move', 'delete');

CREATE TABLE users (
	"id" bigserial primary key,
	"name" text not null unique,
	"nationality" char(2),
	-- https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
	"discord_id" text
);

CREATE TABLE roles (
	"id" smallserial primary key,
	"name" text not null unique,
	"permissions" text [ ]
);

CREATE TABLE user_has_role (
	"user_id" bigint references users (id) not null,
	"role_id" smallint references roles (id) not null
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
	"timestamp" timestamp default now (),
	"percentage" smallint,
	"video" text,
	"user_id" bigint references users (id) not null,
	"level_id" bigint references levels (id) not null
);

CREATE TABLE list_archive (
	"timestamp" timestamp default now (),
	"level_id" bigint references levels (id) not null
);

CREATE TABLE list_log (
	"id" bigserial primary key,
	"list_level_ids" bigint [ ] not null,
	"timestamp" timestamp default now (),
	"action" list_log_action not null,
	"level_id" bigint references levels (id) not null,
	"from" smallint,
	"to" smallint,
	"reason" text
);

CREATE VIEW users_with_score AS
SELECT
	users.id,
	users.name,
	users.nationality,
	users.discord_id,
	SUM(
		calc_score(
			get_rank(levels.id),
			levels.requirement,
			records.percentage
		)
	) :: float AS score
FROM
	users
	JOIN records ON users.id = records.user_id
	JOIN levels ON levels.id = records.level_id
GROUP BY
	users.id
ORDER BY
	score DESC;

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

CREATE
OR REPLACE VIEW list AS
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
	array_agg(creators.id) :: bigint [ ] AS creators_id,
	array_agg(creators.name) :: text [ ] AS creators_name,
	array_agg(creators.nationality) AS creators_nationality,
	array_agg(creators.discord_id) AS creators_discord_id
FROM
	(
		-- UNNEST WITH ORDINALITY is not working with sqlc: https://github.com/kyleconroy/sqlc/issues/1205 
		SELECT
			*,
			generate_subscripts(list.list_level_ids, 1) AS rank
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
	JOIN user_created_level ON user_created_level.level_id = levels.id
	JOIN users creators ON creators.id = user_created_level.user_id
GROUP BY
	list.rank,
	levels.id,
	users.id,
	verifier.id
ORDER BY
	list.rank ASC;

CREATE
OR REPLACE FUNCTION get_rank(level_id bigint) RETURNS smallint LANGUAGE SQL IMMUTABLE RETURNS NULL ON NULL INPUT AS $$
SELECT
	ordinality AS rank
FROM
	(
		SELECT
			list_log.list_level_ids
		FROM
			list_log
		ORDER BY
			list_log.timestamp DESC
		LIMIT
			1
	) AS latest_list_log,
	UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY
WHERE
	unnest = level_id $$;

SELECT
	users.name,
	SUM(
		calc_score(
			get_rank(levels.id),
			levels.requirement,
			records.percentage
		)
	) AS score
FROM
	users
	JOIN records ON users.id = records.user_id
	JOIN levels ON levels.id = records.level_id
GROUP BY
	users.id
ORDER BY
	score DESC;