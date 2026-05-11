package core

import (
	"example.com/depgraph-demo/utils"
	"example.com/depgraph-demo/services"
)

// Auth handles authentication.
type Auth struct {
	logger      *utils.Logger
	userService *services.UserService
}

// NewAuth creates a new Auth instance.
func NewAuth() *Auth {
	return &Auth{
		logger:      utils.NewLogger("Auth"),
		userService: services.NewUserService(),
	}
}

// Login attempts to authenticate a user.
func (a *Auth) Login(username, password string) bool {
	a.logger.Info("Login attempt for " + username)
	return a.userService.Validate(username, password)
}
