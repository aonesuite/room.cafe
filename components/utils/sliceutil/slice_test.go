package sliceutil

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestIsInStringSlice(t *testing.T) {
	assert.Equal(t, true, IsInStringSlice([]string{"1", "2"}, "1"))
	assert.Equal(t, false, IsInStringSlice([]string{"1", "2"}, "3"))
	assert.Equal(t, false, IsInStringSlice([]string{}, "3"))
}

func TestIsInUintSlice(t *testing.T) {
	assert.Equal(t, true, IsInUintSlice([]uint{1, 2}, 2))
	assert.Equal(t, false, IsInUintSlice([]uint{1, 2}, 3))
	assert.Equal(t, false, IsInUintSlice([]uint{}, 2))
}
