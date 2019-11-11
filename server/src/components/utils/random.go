package utils

import (
	crand "crypto/rand"
	"io"
	"log"
)

// StdChars standard characters allowed in uniuri string.
var StdChars = []byte("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789")

// NewRandomStr returns a new random string of the provided length, consisting of
// standard characters.
func NewRandomStr(length int) string {
	return NewRandomChars(length, StdChars)
}

// StdNumbers base random numbers
var StdNumbers = []byte("0123456789")

// NewRandomNumber return a random number string
func NewRandomNumber(length int) string {
	return NewRandomChars(6, StdNumbers)
}

// NewRandomChars returns a new random string of the provided length, consisting
// of the provided byte slice of allowed characters (maximum 256).
func NewRandomChars(length int, chars []byte) (s string) {
	b := make([]byte, length)
	r := make([]byte, length+(length/4)) // storage for random bytes.
	clen := byte(len(chars))
	maxrb := byte(256 - (256 % len(chars)))
	i := 0
	for {
		if _, err := io.ReadFull(crand.Reader, r); err != nil {
			log.Panic("<NewRandomChars > ", "io.ReadFull - error reading from random source: "+err.Error())
		}
		for _, c := range r {
			if c >= maxrb {
				// Skip this number to avoid modulo bias.
				continue
			}
			b[i] = chars[c%clen]
			i++
			if i == length {
				return string(b)
			}
		}
	}
}
