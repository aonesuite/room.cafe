package rpc

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewTransportTimeout(t *testing.T) {
	assert := assert.New(t)
	tr := NewTransportTimeout(10, 30)
	assert.NotEmpty(tr)
}

func TestNewTransportTimeoutWithConnsPool(t *testing.T) {
	assert := assert.New(t)
	tr := NewTransportTimeoutWithConnsPool(10, 30, 100)
	assert.NotEmpty(tr)
}
