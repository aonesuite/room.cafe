package utils

import (
	"components/log"
	"time"
)

// WithShortRetry 执行某个函数，如果返回错误，那么2s 后重试, 重试5次
func WithShortRetry(f func() error) {
	for tries := 0; tries < 5; tries++ {
		err := f()
		if err == nil {
			return
		}

		log.Errorf("try %d failed %v, retrying...", tries, err)
		time.Sleep(2 * time.Second)
	}

	log.Error("time up!!!")
}

// WithRetryTimesInterval 重试
func WithRetryTimesInterval(f func() error, times, intervalSec int) {
	for tries := 0; tries < times; tries++ {
		err := f()
		if err == nil {
			return
		}

		time.Sleep(time.Duration(intervalSec) * time.Second)
	}
}

// WithRetry 执行某个函数，如果返回错误，那么在 10 分钟内重复执行，每执行一次，sleep 的时间左移一位
func WithRetry(f func() error) {
	const timeout = 10 * time.Minute
	deadline := time.Now().Add(timeout)

	for tries := 0; time.Now().Before(deadline); tries++ {
		err := f()
		if err == nil {
			return
		}

		log.Errorf("try %d failed %v, retrying...", tries, err)
		time.Sleep(time.Second << uint(tries))
	}
	log.Error("timeout!!!")
}
