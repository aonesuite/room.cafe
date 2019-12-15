package utils

import "strings"

// Truncate a given text after a given length if text is longer than length
func Truncate(str string, limit int) string {
	chars := strings.Split(str, "")
	if len(chars) > limit {
		return strings.Join(chars[:limit], "")
	}
	return str
}
