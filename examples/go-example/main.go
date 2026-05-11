package main

import (
	"fmt"
	"example.com/depgraph-demo/core"
	"example.com/depgraph-demo/ui"
	"example.com/depgraph-demo/utils"
)

func main() {
	logger := utils.NewLogger("App")
	auth := core.NewAuth()
	loginPage := ui.NewLoginPage()

	logger.Info("App initialized")
	fmt.Println(loginPage.Render())

	_ = auth
}
