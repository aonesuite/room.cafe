package log

import (
	"bytes"
	"fmt"
	"runtime"
	"sort"
	"strings"
)

const (
	nocolorCode = 0
	redCode     = 31
	greenCode   = 32
	yellowCode  = 33
	blueCode    = 36
	grayCode    = 37
)

// TextFormatter formats logs into text
type TextFormatter struct {
	// Disable timestamp logging. useful when output is redirected to logging
	// system that already adds timestamps.
	DisableTimestamp bool

	// TimestampFormat to use for display when a full timestamp is printed
	TimestampFormat string

	// The fields are sorted by default for a consistent output. For applications
	// that log extremely frequently and don't use the JSON formatter this may not
	// be desired.
	DisableSorting bool

	// QuoteEmptyFields will wrap empty fields in quotes if true
	QuoteEmptyFields bool

	// CallerSkip runtime caller skip
	CallerSkip int
}

func prefixFieldClashes(data Fields) {
	if t, ok := data["time"]; ok {
		data["fields.time"] = t
	}

	if m, ok := data["msg"]; ok {
		data["fields.msg"] = m
	}

	if l, ok := data["level"]; ok {
		data["fields.level"] = l
	}
}

// Format renders a single log entry
func (f *TextFormatter) Format(entry *Entry) ([]byte, error) {
	var b *bytes.Buffer
	keys := make([]string, 0, len(entry.Data))
	for k := range entry.Data {
		if k != "x-reqid" {
			keys = append(keys, k)
		}
	}

	if !f.DisableSorting {
		sort.Strings(keys)
	}

	if entry.Buffer != nil {
		b = entry.Buffer
	} else {
		b = &bytes.Buffer{}
	}

	prefixFieldClashes(entry.Data)

	fmt.Fprintf(b, "[%v] ", entry.Data["x-reqid"])

	timestampFormat := f.TimestampFormat
	if timestampFormat == "" {
		timestampFormat = defaultTimestampFormat
	}

	if !f.DisableTimestamp {
		currentTime := entry.Time.Format(timestampFormat)
		fmt.Fprintf(b, "\033[33m[%s]\033[0m\t", currentTime)
	}

	if f.CallerSkip == 0 {
		f.CallerSkip = 5
	}
	if _, file, line, ok := runtime.Caller(f.CallerSkip); ok {
		fmt.Fprintf(b, "\033[35m(%s:%d)\033[0m ", file, line)
	}

	var levelColor int
	switch entry.Level {
	case DebugLevel:
		levelColor = grayCode
	case WarnLevel:
		levelColor = yellowCode
	case ErrorLevel, FatalLevel, PanicLevel:
		levelColor = redCode
	default:
		levelColor = blueCode
	}

	levelText := strings.ToUpper(entry.Level.String())

	fmt.Fprintf(b, "\x1b[%dm[%s]\x1b[0m %-44s ", levelColor, levelText, entry.Message)

	for _, k := range keys {
		v := entry.Data[k]
		fmt.Fprintf(b, " \x1b[%dm%s\x1b[0m=", levelColor, k)
		f.appendValue(b, v)
	}

	b.WriteByte('\n')
	return b.Bytes(), nil
}

func (f *TextFormatter) needsQuoting(text string) bool {
	if f.QuoteEmptyFields && len(text) == 0 {
		return true
	}
	for _, ch := range text {
		if !((ch >= 'a' && ch <= 'z') ||
			(ch >= 'A' && ch <= 'Z') ||
			(ch >= '0' && ch <= '9') ||
			ch == '-' || ch == '.' || ch == '_' || ch == '/' || ch == '@' || ch == '^' || ch == '+') {
			return true
		}
	}
	return false
}

func (f *TextFormatter) appendKeyValue(b *bytes.Buffer, key string, value interface{}) {
	if b.Len() > 0 {
		b.WriteByte(' ')
	}
	b.WriteString(key)
	b.WriteByte('=')
	f.appendValue(b, value)
}

func (f *TextFormatter) appendValue(b *bytes.Buffer, value interface{}) {
	stringVal, ok := value.(string)
	if !ok {
		stringVal = fmt.Sprint(value)
	}

	if !f.needsQuoting(stringVal) {
		b.WriteString(stringVal)
	} else {
		b.WriteString(fmt.Sprintf("%q", stringVal))
	}
}
