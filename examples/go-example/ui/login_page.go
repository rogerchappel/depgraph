package ui

import (
	"example.com/depgraph-demo/services"
	"example.com/depgraph-demo/utils"
)

// LoginPage represents the login page UI.
type LoginPage struct {
	auth   *services.Auth
	logger *utils.Logger
}

// NewLoginPage creates a new LoginPage.
func NewLoginPage() *LoginPage {
	return &LoginPage{
		auth:   services.NewAuth(),
		logger: utils.NewLogger("LoginPage"),
	}
}

// Render returns the HTML representation.
func (p *LoginPage) Render() string {
	btn := NewButton("Login")
	return "<form>" + btn.Render() + "</form>"
}

// HandleSubmit processes the login form.
func (p *LoginPage) HandleSubmit(username, password string) {
	success := p.auth.Login(username, password)
	if success {
		p.logger.Info("Login successful")
	} else {
		p.logger.Error("Login failed")
	}
}
