CREATE TYPE list_log_action AS ENUM ('add', 'move', 'delete');
CREATE TABLE users (
	"id" bigserial primary key,
	"name" text not null unique,
	"nationality" char(2), -- https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
	"discord_id" text
);
CREATE TABLE roles (
	"id" smallserial primary key,
	"name" text not null unique,
	"permissions" text []
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
	"list_level_ids" bigint [] not null,
	"timestamp" timestamp default now (),
	"action" list_log_action not null,
	"level_id" bigint references levels (id) not null,
	"from" smallint,
	"to" smallint,
	"reason" text
);
CREATE OR REPLACE FUNCTION calc_score(
		rank smallint,
		requirement smallint,
		percentage smallint
	) RETURNS float AS $$
declare beaten_score float := 0;
b constant float := 6.273;
c constant float := 1.0099685;
d constant float := 31.152;
e constant float := 1.168;
f constant float := 100.39;
g constant float := 1.036;
h constant float := 25.071;
l constant float := 3.912023005428146;
begin if 55 < rank
and rank <= 150 then beaten_score = 56.191 * 2 ^((54.147 - (rank + 3.2)) * (l / 99)) + b;
elseif 35 < rank
and rank <= 55 then beaten_score = 212.61 * g ^(1 - rank) + h;
elseif 20 < rank
and rank <= 35 then beaten_score = (250 - 83.389) * c ^(2 - rank) - d;
elseif 0 < rank
and rank <= 20 then beaten_score = (250 - f) * e ^(1 - rank) + f;
end if;
if percentage != 100
and rank <= 75 then return beaten_score * 5 ^((percentage - requirement) / (100 - requirement)) / 10;
end if;
return beaten_score;
end $$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_rank(level_id bigint) RETURNS smallint LANGUAGE SQL IMMUTABLE RETURNS NULL ON NULL INPUT AS $$
SELECT ordinality AS rank
FROM (
		SELECT list_log.list_level_ids
		FROM list_log
		ORDER BY list_log.timestamp DESC
		LIMIT 1
	) AS latest_list_log,
	UNNEST(latest_list_log.list_level_ids) WITH ORDINALITY
WHERE unnest = level_id $$;
SELECT users.name,
	SUM(
		calc_score(
			get_rank(levels.id),
			levels.requirement,
			records.percentage
		)
	) AS score
FROM users
	JOIN records ON users.id = records.user_id
	JOIN levels ON levels.id = records.level_id
GROUP BY users.id
ORDER BY score DESC;