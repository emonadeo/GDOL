package core

import "github.com/emonadeo/gdol/internal/store"

type Config struct {
	Secret string

	PostgresUrl string
	RedisUrl    string

	DiscordClientId     string
	DiscordClientSecret string
	DiscordWebhookUrl   string
}

type App struct {
	Config Config
	Store  *store.Store
}

func NewApp(config Config) (App, error) {
	store, err := store.New(config.PostgresUrl)
	if err != nil {
		return App{}, err
	}

	return App{
		Config: config,
		Store:  store,
	}, nil
}
