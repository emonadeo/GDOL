-- name: GetList :many
SELECT *
FROM "list_log";
-- name: GetUserByID :one
SELECT *
FROM "users"
WHERE "id" = $1;
-- name: GetUserByName :one
SELECT *
FROM "users"
WHERE "name" = $1;
-- name: GetUserIdByName :one
SELECT "id"
FROM "users"
WHERE "name" = $1;
-- name: HasUserWithName :one
SELECT EXISTS(
		SELECT 1
		FROM "users"
		WHERE "name" = $1
	);
-- SEED
-- name: InsertUser :one
INSERT INTO "users" ("name", "nationality")
VALUES ($1, $2)
RETURNING "id";
-- name: InsertLevel :one
INSERT INTO "levels" (
		"name",
		"gd_id",
		"user_id",
		"verifier_id",
		"video",
		"requirement"
	)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING "id";
-- name: InsertUserCreatedLevel :exec
INSERT INTO "user_created_level" ("user_id", "level_id")
VALUES ($1, $2);
-- name: InsertListLog :one
INSERT INTO "list_log" (
		"action",
		"list_level_ids",
		"level_id",
		"from",
		"to",
		"reason"
	)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING "id";
-- name: InsertRecords :exec
INSERT INTO "records" (
		"percentage",
		"video",
		"user_id",
		"level_id"
	)
VALUES ($1, $2, $3, $4);
-- name: HasRecord :one
SELECT EXISTS(
		SELECT 1
		FROM "records"
		WHERE "user_id" = $1
			AND "level_id" = $2
	);