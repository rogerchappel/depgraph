package ui

// FormatUser formats a user name for display.
func FormatUser(name string) string {
	return "User: " + name
}

// Button represents a UI button.
type Button struct {
	Label string
}

// NewButton creates a new Button.
func NewButton(label string) *Button {
	return &Button{Label: label}
}

// Render returns the HTML representation.
func (b *Button) Render() string {
	return "<button>" + b.Label + "</button>"
}
