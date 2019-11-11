package utils

import (
	"sync"
)

type SecurityMap struct {
	lock *sync.RWMutex
	data map[string]interface{}
}

func NewSecurityMap() *SecurityMap {
	return &SecurityMap{&sync.RWMutex{}, make(map[string]interface{}, 0)}
}

func (sm *SecurityMap) Set(key string, value interface{}) {
	sm.lock.Lock()
	sm.data[key] = value
	sm.lock.Unlock()
}

func (sm *SecurityMap) Get(key string) (value interface{}) {
	sm.lock.RLock()
	value = sm.data[key]
	sm.lock.RUnlock()
	return
}

func (sm *SecurityMap) Has(key string) bool {
	sm.lock.RLock()
	_, ok := sm.data[key]
	sm.lock.RUnlock()
	return ok

}

func (sm *SecurityMap) Edit(key string, fn func(key string, value interface{}) (interface{}, error)) error {
	sm.lock.Lock()
	value := sm.data[key]
	valueEdited, err := fn(key, value)
	if err != nil {
		sm.lock.Unlock()
		return err
	}
	sm.data[key] = valueEdited
	sm.lock.Unlock()
	return nil
}

func (sm *SecurityMap) Range(fn func(key string, value interface{}) bool) {
	sm.lock.RLock()
	for k, v := range sm.data {
		b := fn(k, v)
		if !b {
			break
		}
	}
	sm.lock.RUnlock()
	return
}
