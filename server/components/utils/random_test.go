package utils_test

import (
	"testing"

	"room.cafe/components/utils"

	"github.com/stretchr/testify/assert"
)

func TestRanddom(t *testing.T) {
	assert := assert.New(t)

	str := utils.NewRandomStr(6)
	assert.Len(str, 6)

	str = utils.NewRandomNumber(6)
	assert.Len(str, 6)
}
