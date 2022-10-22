CREATE TYPE list_log_action AS ENUM ('add', 'move', 'delete');

CREATE TABLE
	users (
		"id" bigserial primary key,
		"name" text not null unique,
		"nationality" char(2) -- https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
	);

CREATE TABLE
	levels (
		"id" bigserial primary key,
		"name" text not null,
		"gd_id" bigint not null,
		"user_id" bigint references users (id) not null,
		"verifier_id" bigint references users (id) not null,
		"video" text,
		"requirement" smallint
	);

CREATE TABLE
	user_created_level (
		"user_id" bigint references users (id) not null,
		"level_id" bigint references levels (id) not null
	);

CREATE TABLE
	records (
		"timestamp" timestamp default now (),
		"percentage" smallint,
		"video" text,
		"user_id" bigint references users (id) not null,
		"level_id" bigint references levels (id) not null
	);

CREATE TABLE
	list_archive (
		"timestamp" timestamp default now (),
		"level_id" bigint references levels (id) not null
	);

CREATE TABLE
	list_log (
		"id" bigserial primary key,
		"list_level_ids" bigint[] not null,
		"timestamp" timestamp default now (),
		"action" list_log_action not null,
		"level_id" bigint references levels (id) not null,
		"from" smallint,
		"to" smallint,
		"reason" text
	);
