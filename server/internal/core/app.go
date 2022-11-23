package core

import "github.com/emonadeo/gdol/internal/store"

type App struct {
	Store *store.Store
}

func NewApp() (App, error) {
	store, err := store.New()
	if err != nil {
		return App{}, err
	}
	return App{
		Store: store,
	}, nil
}
