package log

import (
	"context"
	"encoding/base64"
	"encoding/binary"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

var pid = uint32(time.Now().UnixNano() % 4294967291)

// GenReqID is a random generate string func
func GenReqID() string {
	var b [12]byte
	binary.LittleEndian.PutUint32(b[:], pid)
	binary.LittleEndian.PutUint64(b[4:], uint64(time.Now().UnixNano()))
	return base64.URLEncoding.EncodeToString(b[:])
}

// --------------------------------------------------------------------

const defaultTimestampFormat = "2006-01-02 15:04:05.999999"

// Fields type, used to pass to `WithFields`.
type Fields = log.Fields

// Level type
type Level = log.Level

// These are the different logging levels. You can set the logging level to log
const (
	// PanicLevel level, highest level of severity. Logs and then calls panic with the message passed to Debug, Info, ...
	PanicLevel = log.PanicLevel
	// FatalLevel level. Logs and then calls `os.Exit(1)`. It will exit even if the logging level is set to Panic.
	FatalLevel = log.FatalLevel
	// ErrorLevel level. Logs. Used for errors that should definitely be noted.
	// Commonly used for hooks to send errors to an error tracking service.
	ErrorLevel = log.ErrorLevel
	// WarnLevel level. Non-critical entries that deserve eyes.
	WarnLevel = log.WarnLevel
	// InfoLevel level. General operational entries about what's going on inside the application.
	InfoLevel = log.InfoLevel
	// DebugLevel level. Usually only enabled when debugging. Very verbose logging.
	DebugLevel = log.DebugLevel
)

// Formatter aliases log.Formatter
type Formatter = log.Formatter

// TextFormatter formats logs into text aliases log.TextFormatter

// // JSONFormatter formats logs into parsable json aliases log.JSONFormatter
// type JSONFormatter = log.JSONFormatter

// Entry aliases log.Entry
type Entry = log.Entry

// Hook aliases log.Hook
type Hook = log.Hook

// --------------------------------------------------------------------

// Logger type
type Logger struct {
	entry *Entry
	reqID string
}

// New return logger
func New(o ...interface{}) *Logger {
	var reqID string

	if len(o) > 0 && o[0] != nil {
		a := o[0]

		l, ok := a.(*Logger)
		if ok {
			return l
		}

		if reqID, ok = a.(string); !ok {
			if context, ok := a.(*gin.Context); ok {
				reqID = context.Writer.Header().Get("X-Reqid")
			}
		}
	}

	if len(reqID) == 0 {
		reqID = GenReqID()
	}

	_log := log.New()
	_log.Formatter = &TextFormatter{}
	// _log.Formatter = &JSONFormatter{}

	return &Logger{_log.WithField("x-reqid", reqID), reqID}
}

// NewContext new context with logger
func NewContext(ctx context.Context, l *Logger) context.Context {
	return context.WithValue(ctx, 0, l)
}

// --------------------------------------------------------------------

// ReqID return x-reqid
func (logger *Logger) ReqID() string {
	return logger.reqID
}

// Xput xput
func (logger *Logger) Xput(logs []string) {
	if xLog, exists := logger.entry.Data["X-Log"]; exists {
		if ll, ok := xLog.([]string); ok {
			ll = append(ll, logs...)
		}
	} else {
		logger.entry.Data["X-Log"] = logs
	}
}

// SetLevel set logger level
func (logger *Logger) SetLevel(level Level) {
	logger.entry.Logger.SetLevel(level)
}

// SetFormatter set logger formatter
func (logger *Logger) SetFormatter(formatter Formatter) {
	logger.entry.Logger.Formatter = formatter
}

// AddHook adds a hook to the standard logger hooks.
func (logger *Logger) AddHook(hook Hook) {
	logger.entry.Logger.AddHook(hook)
}

// String returns the string representation from the reader and ultimately the formatter.
func (logger *Logger) String() (string, error) {
	return logger.entry.String()
}

// WithError add an error as single field (using the key defined in ErrorKey) to the Entry.
func (logger *Logger) WithError(err error) *Logger {
	return logger.WithField(log.ErrorKey, err)
}

// WithField add a single field to the Entry.
func (logger *Logger) WithField(key string, value interface{}) *Logger {
	return logger.WithFields(Fields{key: value})
}

// WithFields add a map of fields to the Entry.
func (logger *Logger) WithFields(fields Fields) *Logger {
	return &Logger{logger.entry.WithFields(fields), logger.reqID}
}

// Debug logs a message at level Debug
func (logger *Logger) Debug(args ...interface{}) {
	logger.entry.Debug(fmt.Sprintln(args...))
}

// Print logs a message at level Info
func (logger *Logger) Print(args ...interface{}) {
	logger.entry.Print(args...)
}

// Info logs a message at level Info
func (logger *Logger) Info(args ...interface{}) {
	logger.entry.Info(fmt.Sprintln(args...))
}

// Warn logs a message at level Warn
func (logger *Logger) Warn(args ...interface{}) {
	logger.entry.Warn(fmt.Sprintln(args...))
}

// Warning logs a message at level Warn
func (logger *Logger) Warning(args ...interface{}) {
	logger.entry.Warning(fmt.Sprintln(args...))
}

// Error logs a message at level Error
func (logger *Logger) Error(args ...interface{}) {
	logger.entry.Error(fmt.Sprintln(args...))
}

// Fatal logs a message at level Fatal
func (logger *Logger) Fatal(args ...interface{}) {
	logger.entry.Fatal(fmt.Sprintln(args...))
}

// Panic logs a message at level Panic
func (logger *Logger) Panic(args ...interface{}) {
	logger.entry.Panic(fmt.Sprintln(args...))
}

// Entry Printf family functions

// Debugf logs a message at level Debug
func (logger *Logger) Debugf(format string, args ...interface{}) {
	logger.entry.Debugf(format, args...)
}

// Infof logs a message at level Info
func (logger *Logger) Infof(format string, args ...interface{}) {
	logger.entry.Infof(format, args...)
}

// Printf logs a message at level Info
func (logger *Logger) Printf(format string, args ...interface{}) {
	logger.entry.Printf(format, args...)
}

// Warnf logs a message at level Warn
func (logger *Logger) Warnf(format string, args ...interface{}) {
	logger.entry.Warnf(format, args...)
}

// Warningf logs a message at level Warn
func (logger *Logger) Warningf(format string, args ...interface{}) {
	logger.entry.Warningf(format, args...)
}

// Errorf logs a message at level Error
func (logger *Logger) Errorf(format string, args ...interface{}) {
	logger.entry.Errorf(format, args...)
}

// Fatalf logs a message at level Fatal
func (logger *Logger) Fatalf(format string, args ...interface{}) {
	logger.entry.Fatalf(format, args...)
}

// Panicf logs a message at level Panic
func (logger *Logger) Panicf(format string, args ...interface{}) {
	logger.entry.Panicf(format, args...)
}

// Entry Println family functions

// Debugln logs a message at level Debug
func (logger *Logger) Debugln(args ...interface{}) {
	logger.entry.Debugln(fmt.Sprintln(args...))
}

// Infoln logs a message at level Info
func (logger *Logger) Infoln(args ...interface{}) {
	logger.entry.Infoln(fmt.Sprintln(args...))
}

// Println logs a message at level Info
func (logger *Logger) Println(args ...interface{}) {
	logger.entry.Println(fmt.Sprintln(args...))
}

// Warnln logs a message at level Warn
func (logger *Logger) Warnln(args ...interface{}) {
	logger.entry.Warnln(fmt.Sprintln(args...))
}

// Warningln logs a message at level Warn
func (logger *Logger) Warningln(args ...interface{}) {
	logger.entry.Warningln(fmt.Sprintln(args...))
}

// Errorln logs a message at level Error
func (logger *Logger) Errorln(args ...interface{}) {
	logger.entry.Errorln(fmt.Sprintln(args...))
}

// Fatalln logs a message at level Fatal
func (logger *Logger) Fatalln(args ...interface{}) {
	logger.entry.Fatalln(fmt.Sprintln(args...))
}

// Panicln logs a message at level Panic
func (logger *Logger) Panicln(args ...interface{}) {
	logger.entry.Panicln(fmt.Sprintln(args...))
}
