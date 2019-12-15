package log

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestLogger(t *testing.T) {
	assert := assert.New(t)

	log := New()
	assert.NotNil(log)

	log.WithField("f1", "f1 value").Info("test")
	log.WithFields(Fields{"a": 1, "b": 2}).Info("test info")

	log = New("custom-req-id")
	assert.NotNil(log)

	log.WithField("f2", "f2 value").Info("test")
	log.WithFields(Fields{"a": 1, "b": 2}).Info("test info2")
}
