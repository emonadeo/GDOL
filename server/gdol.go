package gdol

import (
	"fmt"
	"net"
	"os"

	"github.com/emonadeo/gdol/internal/core"
	"github.com/emonadeo/gdol/internal/server"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/spf13/viper"
)

const (
	version = `2.0.0-alpha.1`
	banner  = `  ____  ____  _______
 / ___||  _ \ \  __  |
| (|_ || |_) | \ \ | |
 \____||____/   \ \| |
 _____   ___   _ \   |  
|  _  | / _ \ | | \  |   
| |_| || (_) || |__\ |
|_____| \___/ |____|\| %s
Serving API on %s
`
	keyPort   = "port"
	keySecret = "secret"

	keyPostgresUrl = "postgres_url"
	keyRedisUrl    = "redis_url"

	keyDiscordClientId     = "discord_client_id"
	keyDiscordClientSecret = "discord_client_secret"
	keyDiscordWebhookUrl   = "discord_webhook_url"
)

// appWrapper serves as a private core.App instance wrapper.
type appWrapper struct {
	core.App
}

type GDOL struct {
	*appWrapper

	env  string
	port string
}

func New() *GDOL {
	// Load .env files according to https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
	env := os.Getenv("GDOL_ENV")
	if env == "" {
		env = "development"
	}
	godotenv.Load(".env." + env + ".local")
	if env != "test" {
		godotenv.Load(".env.local")
	}
	godotenv.Load(".env." + env)
	godotenv.Load() // The Original .env

	// Setup Config
	v := viper.New()
	v.SetConfigName("gdol")
	v.SetConfigType("yaml")
	v.AddConfigPath(".")

	// Config Defaults
	v.SetDefault(keyPort, "80")

	// Env
	v.SetEnvPrefix("gdol")
	v.BindEnv(keyPort)
	v.BindEnv(keySecret)
	v.BindEnv(keyPostgresUrl)
	v.BindEnv(keyPostgresUrl)
	v.BindEnv(keyRedisUrl)
	v.BindEnv(keyDiscordClientId)
	v.BindEnv(keyDiscordClientSecret)
	v.BindEnv(keyDiscordWebhookUrl)

	err := v.ReadInConfig()
	if err != nil {
		panic(err.Error())
	}

	gdol := &GDOL{
		env:  env,
		port: v.GetString(keyPort),
	}

	app, err := core.NewApp(core.Config{
		Secret: v.GetString(keySecret),

		PostgresUrl: v.GetString(keyPostgresUrl),
		RedisUrl:    v.GetString(keyRedisUrl),

		DiscordClientId:     v.GetString(keyDiscordClientId),
		DiscordClientSecret: v.GetString(keyDiscordClientSecret),
		DiscordWebhookUrl:   v.GetString(keyDiscordWebhookUrl),
	})
	if err != nil {
		panic(err.Error())
	}

	gdol.appWrapper = &appWrapper{app}

	return gdol
}

func (gdol GDOL) Start() {
	server, err := server.New(gdol.appWrapper.App)
	if err != nil {
		panic(err.Error())
	}

	if gdol.env == "development" {
		server.Debug = true
		server.Use(middleware.Logger())
	}

	serverConfig := echo.StartConfig{
		Address:    fmt.Sprintf(":%s", gdol.port),
		HideBanner: true,
		HidePort:   true,
		ListenerAddrFunc: func(addr net.Addr) {
			fmt.Printf(banner, version, addr)
		},
	}

	err = serverConfig.Start(server)
	if err != nil {
		panic(err.Error())
	}
	// TODO: HTTPS
	// err = serverConfig.StartTLS(server, "", "")
}
