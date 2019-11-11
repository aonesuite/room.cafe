package utils_test

import (
	"testing"

	"components/utils"

	"github.com/stretchr/testify/assert"
)

func TestTruncate(t *testing.T) {
	assert := assert.New(t)

	str := utils.Truncate("1234567890", 6)
	assert.Equal(str, "123456")

	str = utils.Truncate("1234567890", 12)
	assert.Equal(str, "1234567890")
}
