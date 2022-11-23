package main

import (
	"fmt"
	"net"

	"github.com/emonadeo/gdol/internal/server"
	"github.com/labstack/echo/v5"
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
)

func main() {
	server, err := server.Init()
	if err != nil {
		panic(err.Error())
	}

	serverConfig := echo.StartConfig{
		Address:    ":3000", // TODO: Make configurable
		HideBanner: true,
		HidePort:   true,
		ListenerAddrFunc: func(addr net.Addr) {
			fmt.Printf(banner, version, addr)
		},
	}

	serverConfig.Start(server)
	// TODO: HTTPS
	// serverConfig.StartTLS(server, "", "")
}
