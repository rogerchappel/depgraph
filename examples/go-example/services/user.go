package services

import (
	"example.com/depgraph-demo/utils"
	"example.com/depgraph-demo/ui"
)

// User represents a user entity.
type User struct {
	Name  string
	Email string
}

// UserService handles user-related operations.
type UserService struct {
	logger *utils.Logger
	users  []User
}

// NewUserService creates a new UserService.
func NewUserService() *UserService {
	return &UserService{
		logger: utils.NewLogger("UserService"),
		users:  []User{},
	}
}

// Validate checks user credentials.
func (s *UserService) Validate(username, password string) bool {
	s.logger.Info("Validating " + username)
	return true
}

// GetAll returns all users.
func (s *UserService) GetAll() []User {
	return s.users
}

// Add adds a new user.
func (s *UserService) Add(name, email string) {
	formatted := ui.FormatUser(name)
	s.logger.Info("Adding " + formatted)
	s.users = append(s.users, User{Name: name, Email: email})
}
