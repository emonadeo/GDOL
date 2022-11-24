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