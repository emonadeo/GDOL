package main

import "github.com/emonadeo/gdol/pkg/api"

func main() {
	err := api.Start()
	if err != nil {
		panic(err.Error())
	}
}
