package config

import (
	"io"
	"strings"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/spf13/afero"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

// Config viper.Vpier alias
type Config = viper.Viper

type FlagValueSet = viper.FlagValueSet
type FlagValue = viper.FlagValue

var v *Config

func init() {
	v = viper.New()
}

func OnConfigChange(run func(in fsnotify.Event)) { v.OnConfigChange(run) }
func WatchConfig()                               { v.WatchConfig() }
func SetConfigFile(in string)                    { v.SetConfigFile(in) }
func SetEnvPrefix(in string)                     { v.SetEnvPrefix(in) }
func ConfigFileUsed() string                     { return v.ConfigFileUsed() }
func AddConfigPath(in string)                    { v.AddConfigPath(in) }
func AddRemoteProvider(provider, endpoint, path string) error {
	return v.AddRemoteProvider(provider, endpoint, path)
}
func AddSecureRemoteProvider(provider, endpoint, path, secretkeyring string) error {
	return v.AddSecureRemoteProvider(provider, endpoint, path, secretkeyring)
}
func SetTypeByDefaultValue(enable bool)                      { v.SetTypeByDefaultValue(enable) }
func Get(key string) interface{}                             { return v.Get(key) }
func Sub(key string) *Config                                 { return v.Sub(key) }
func GetString(key string) string                            { return v.GetString(key) }
func GetBool(key string) bool                                { return v.GetBool(key) }
func GetInt(key string) int                                  { return v.GetInt(key) }
func GetInt32(key string) int32                              { return v.GetInt32(key) }
func GetInt64(key string) int64                              { return v.GetInt64(key) }
func GetFloat64(key string) float64                          { return v.GetFloat64(key) }
func GetTime(key string) time.Time                           { return v.GetTime(key) }
func GetDuration(key string) time.Duration                   { return v.GetDuration(key) }
func GetStringSlice(key string) []string                     { return v.GetStringSlice(key) }
func GetStringMap(key string) map[string]interface{}         { return v.GetStringMap(key) }
func GetStringMapString(key string) map[string]string        { return v.GetStringMapString(key) }
func GetStringMapStringSlice(key string) map[string][]string { return v.GetStringMapStringSlice(key) }
func GetSizeInBytes(key string) uint                         { return v.GetSizeInBytes(key) }
func UnmarshalKey(key string, rawVal interface{}) error      { return v.UnmarshalKey(key, rawVal) }
func Unmarshal(rawVal interface{}) error                     { return v.Unmarshal(rawVal) }
func UnmarshalExact(rawVal interface{}) error                { return v.UnmarshalExact(rawVal) }
func BindPFlags(flags *pflag.FlagSet) error                  { return v.BindPFlags(flags) }
func BindPFlag(key string, flag *pflag.Flag) error           { return v.BindPFlag(key, flag) }
func BindFlagValues(flags FlagValueSet) (err error)          { return v.BindFlagValues(flags) }
func BindFlagValue(key string, flag FlagValue) error         { return v.BindFlagValue(key, flag) }
func BindEnv(input ...string) error                          { return v.BindEnv(input...) }
func IsSet(key string) bool                                  { return v.IsSet(key) }
func AutomaticEnv()                                          { v.AutomaticEnv() }
func SetEnvKeyReplacer(r *strings.Replacer)                  { v.SetEnvKeyReplacer(r) }
func RegisterAlias(alias string, key string)                 { v.RegisterAlias(alias, key) }
func InConfig(key string) bool                               { return v.InConfig(key) }
func SetDefault(key string, value interface{})               { v.SetDefault(key, value) }
func Set(key string, value interface{})                      { v.Set(key, value) }
func ReadInConfig() error                                    { return v.ReadInConfig() }
func MergeInConfig() error                                   { return v.MergeInConfig() }
func ReadConfig(in io.Reader) error                          { return v.ReadConfig(in) }
func MergeConfig(in io.Reader) error                         { return v.MergeConfig(in) }
func WriteConfig() error                                     { return v.WriteConfig() }
func SafeWriteConfig() error                                 { return v.SafeWriteConfig() }
func WriteConfigAs(filename string) error                    { return v.WriteConfigAs(filename) }
func SafeWriteConfigAs(filename string) error                { return v.SafeWriteConfigAs(filename) }
func ReadRemoteConfig() error                                { return v.ReadRemoteConfig() }
func WatchRemoteConfig() error                               { return v.WatchRemoteConfig() }
func WatchRemoteConfigOnChannel() error                      { return v.WatchRemoteConfigOnChannel() }
func AllKeys() []string                                      { return v.AllKeys() }
func AllSettings() map[string]interface{}                    { return v.AllSettings() }
func SetFs(fs afero.Fs)                                      { v.SetFs(fs) }
func SetConfigName(in string)                                { v.SetConfigName(in) }
func SetConfigType(in string)                                { v.SetConfigType(in) }
func Debug()                                                 { v.Debug() }
