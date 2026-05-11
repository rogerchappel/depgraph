package utils

import "fmt"

// Logger provides simple logging functionality.
type Logger struct {
	Prefix string
}

// NewLogger creates a new Logger instance.
func NewLogger(prefix string) *Logger {
	return &Logger{Prefix: prefix}
}

// Info logs an informational message.
func (l *Logger) Info(message string) {
	fmt.Printf("[%s] INFO: %s\n", l.Prefix, message)
}

// Error logs an error message.
func (l *Logger) Error(message string) {
	fmt.Printf("[%s] ERROR: %s\n", l.Prefix, message)
}
