package db

import (
	"database/sql/driver"
	"fmt"
	"reflect"
	"regexp"
	"strings"
	"time"
	"unicode"
)

var (
	sqlRegexp = regexp.MustCompile(`(\$\d+)|\?`)
)

const packageFlag = "room.cafe"

type logger interface {
	Print(v ...interface{})
}

// LogWriter log writer interface
type LogWriter interface {
	Println(v ...interface{})
}

// Logger default logger
type Logger struct {
	LogWriter
	XReqID string
}

// NowFunc returns current time, this function is exported in order to be able
// to give the flexibility to the developer to customize it according to their
// needs, e.g:
//    NowFunc = func() time.Time {
//      return time.Now().UTC()
//    }
var NowFunc = func() time.Time {
	return time.Now()
}

// Print format & print log
func (logger Logger) Print(values ...interface{}) {
	if len(values) == 0 {
		return
	}

	level := values[0]
	source := fmt.Sprintf("%v", values[1])
	if paths := strings.Split(source, packageFlag); len(paths) >= 2 {
		source = packageFlag + strings.Join(paths[1:len(paths)], "")
		source = strings.Replace(source, ")", "", -1)
	}
	currentTime := "[" + logger.XReqID + "] \033[33m[" + NowFunc().Format("2006-01-02 15:04:05.999999") + "]\033[0m\t[DATABASE]"
	source = fmt.Sprintf("\033[35m(%v)\033[0m", source)
	messages := []interface{}{currentTime, source}

	if level == "sql" {
		// duration
		messages = append(messages, fmt.Sprintf("\033[36;1m[%.2fms]\033[0m", float64(values[2].(time.Duration).Nanoseconds()/1e4)/100.0))
		// sql
		var sql string
		var formattedValues []string

		for _, value := range values[4].([]interface{}) {
			indirectValue := reflect.Indirect(reflect.ValueOf(value))
			if indirectValue.IsValid() {
				value = indirectValue.Interface()
				if t, ok := value.(time.Time); ok {
					formattedValues = append(formattedValues, fmt.Sprintf("'%v'", t.Format(time.RFC3339)))
				} else if b, ok := value.([]byte); ok {
					if str := string(b); isPrintable(str) {
						formattedValues = append(formattedValues, fmt.Sprintf("'%v'", str))
					} else {
						formattedValues = append(formattedValues, "'<binary>'")
					}
				} else if r, ok := value.(driver.Valuer); ok {
					if value, err := r.Value(); err == nil && value != nil {
						formattedValues = append(formattedValues, fmt.Sprintf("'%v'", value))
					} else {
						formattedValues = append(formattedValues, "NULL")
					}
				} else {
					// Limiting output length
					output := fmt.Sprintf("'%v'", value)
					if len(output) > 300 {
						output = output[:300] + "...'"
					}
					output = strings.Replace(output, "\n", `\n`, -1)
					formattedValues = append(formattedValues, output)
				}
			} else {
				formattedValues = append(formattedValues, fmt.Sprintf("'%v'", value))
			}
		}

		var formattedValuesLength = len(formattedValues)
		for index, value := range sqlRegexp.Split(values[3].(string), -1) {
			sql += value
			if index < formattedValuesLength {
				sql += formattedValues[index]
			}
		}

		messages = append(messages, sql)
	} else {
		messages = append(messages, "\033[31;1m")
		messages = append(messages, values[2:]...)
		messages = append(messages, "\033[0m")
	}
	logger.Println(messages...)
}

func isPrintable(s string) bool {
	for _, r := range s {
		if !unicode.IsPrint(r) {
			return false
		}
	}
	return true
}
