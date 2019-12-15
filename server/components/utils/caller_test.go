package utils_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"room.cafe/components/utils"
)

func TestCaller(t *testing.T) {
	caller := utils.Caller()
	assert.Equal(t, "TestCaller", caller)
}
