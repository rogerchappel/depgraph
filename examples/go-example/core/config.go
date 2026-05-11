package core

import (
	"example.com/depgraph-demo/core"
)

// AppConfig holds application configuration.
type AppConfig struct {
	Debug       bool
	AuthEnabled bool
}

// LoadConfig loads the application configuration.
func LoadConfig() AppConfig {
	return AppConfig{
		Debug:       true,
		AuthEnabled: true,
	}
}

// InitAuth initializes the authentication system.
func InitAuth() *core.Auth {
	config := LoadConfig()
	if !config.AuthEnabled {
		panic("Auth is disabled")
	}
	return core.NewAuth()
}
