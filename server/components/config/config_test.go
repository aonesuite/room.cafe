package config_test

import (
	"testing"

	"github.com/stretchr/testify/assert"

	"components/config"
)

func TestLoadConfig(t *testing.T) {
	assert := assert.New(t)
	config.LoadConfig()
	assert.NotNil(config.Env)
	assert.NotNil(config.Env.DefaultTransport)
}
