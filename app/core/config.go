package core

type Config struct {
	PublicBlob bool
}

var AppConfig Config

func init() {
	AppConfig = Config{false}
}
