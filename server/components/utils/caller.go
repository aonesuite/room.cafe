package utils

import (
	"runtime"
	"strings"
	"time"

	"components/log"
)

// Caller 返回上一层调用者的函数信息
// 例如：
// func abc() {
//	Caller()  这里就会返回 abc
// }
func Caller() (name string) {
	pc, _, _, ok := runtime.Caller(1)
	details := runtime.FuncForPC(pc)
	if ok && details != nil {
		i := strings.LastIndex(details.Name(), ".")
		if i != -1 {
			name = details.Name()[i+1:]
		} else {
			name = details.Name()
		}
	} else {
		name = "unknown"
	}
	return
}

// FuncTrace 记录函数的执行时间
func FuncTrace(xl *log.Logger) func() {
	pc, _, _, _ := runtime.Caller(1)
	funcname := runtime.FuncForPC(pc).Name()
	funcname = funcname[strings.LastIndex(funcname, ".")+1:]

	startAt := time.Now()
	xl.Infof("[%s] -----> begin at %+v", funcname, startAt)
	return func() {
		xl.Infof("[%s] <----- end takes %+v", funcname, time.Since(startAt))
	}
}
