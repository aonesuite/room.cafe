package config

import (
	"net/http"
)

// Env 全局的配置变量
var Env config

type config struct {
	DefaultTransport http.RoundTripper `yaml:"-" json:"-"`
}

// LoadConfig 加载配置文件
func LoadConfig() {
	conf := config{DefaultTransport: http.DefaultTransport}

	Env = conf
}
