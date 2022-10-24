package main

import (
	"context"
	dbsql "database/sql"
	"encoding/json"
	"os"
	"path/filepath"
	"strconv"

	"github.com/emonadeo/gdol/pkg/generated/sqlc"

	_ "github.com/lib/pq"
)

type User struct {
	Banned bool
	Id     int
	Name   string
}

type Level struct {
	Id        int    `json:"id"`
	Level_id  int    `json:"level_id"`
	Name      string `json:"name"`
	Position  int    `json:"position"`
	Publisher User   `json:"publisher"`
	Creators  []User `json:"creators"`
	Verifier  User   `json:"verifier"`
	Video     string `json:"video"`
	Records   []struct {
		Id          int `json:"id"`
		Nationality struct {
			Country_code string `json:"country_code"`
			Nation       string `json:"nation"`
			Subdivision  string `json:"subdivision"`
		} `json:"nationality"`
		Player   User   `json:"player"`
		Progress int    `json:"progress"`
		Status   string `json:"status"`
		Video    string `json:"video"`
	} `json:"records"`
}

func main() {
	ctx := context.Background()

	db, err := dbsql.Open("postgres", "user=example password=example dbname=gdol sslmode=disable")
	if err != nil {
		panic(err)
	}

	queries := sqlc.New(db)

	tx, err := db.Begin()
	if err != nil {
		panic(err)
	}

	file, err := filepath.Abs("pkg/generated/pointercrate/_list.json")
	if err != nil {
		panic(err)
	}
	listRaw, err := os.ReadFile(file)
	if err != nil {
		panic(err)
	}
	list := []int{}
	err2 := json.Unmarshal(listRaw, &list)
	if err2 != nil {
		panic(err2)
	}

	currentLevelIds := []int64{}
	for i, v := range list {
		levelRaw, err := os.ReadFile("pkg/generated/pointercrate/" + strconv.Itoa(v) + ".json")
		if err != nil {
			panic(err)
		}
		level := Level{}
		err1 := json.Unmarshal(levelRaw, &level)
		if err1 != nil {
			panic(err1)
		}

		// Insert users
		publisherId := seedUser(queries, ctx, level.Publisher)
		verifierId := seedUser(queries, ctx, level.Verifier)
		creatorIds := seedUsers(queries, ctx, level.Creators)

		// Insert level
		levelId, err := queries.InsertLevel(ctx, sqlc.InsertLevelParams{
			Name:       level.Name,
			GdID:       int64(level.Level_id),
			UserID:     publisherId,
			VerifierID: verifierId,
			Video: dbsql.NullString{
				String: level.Video,
				Valid:  level.Video != "",
			},
			Requirement: dbsql.NullInt16{
				Int16: 100,
				Valid: true,
			},
		})

		if err != nil {
			panic(err)
		}

		currentLevelIds = append(currentLevelIds, levelId)

		// Link creators
		for _, creatorId := range creatorIds {
			err := queries.InsertUserCreatedLevel(ctx, sqlc.InsertUserCreatedLevelParams{
				UserID:  creatorId,
				LevelID: levelId,
			})
			if err != nil {
				panic(err)
			}
		}

		// Insert level log
		_, err = queries.InsertListLog(ctx, sqlc.InsertListLogParams{
			Action:       sqlc.ListLogActionAdd,
			LevelID:      levelId,
			ListLevelIds: currentLevelIds,
			From: dbsql.NullInt16{
				Int16: 0,
				Valid: false,
			},
			To: dbsql.NullInt16{
				Int16: int16(i + 1),
				Valid: true,
			},
		})

		if err != nil {
			panic(err)
		}
	}

	tx.Commit()
}

func seedUser(qry *sqlc.Queries, ctx context.Context, user User) int64 {
	userExists, err := qry.HasUserWithName(ctx, user.Name)
	if err != nil {
		panic(err)
	}

	if userExists {
		id, err := qry.GetUserIdByName(ctx, user.Name)
		if err != nil {
			panic(err)
		}
		return id
	}

	id, err := qry.InsertUser(ctx, sqlc.InsertUserParams{
		Name:        user.Name,
		Nationality: dbsql.NullString{Valid: false},
	})
	if err != nil {
		panic(err)
	}
	return id
}

func seedUsers(qry *sqlc.Queries, ctx context.Context, users []User) []int64 {
	ids := []int64{}
	for _, user := range users {
		ids = append(ids, seedUser(qry, ctx, user))
	}
	return ids
}