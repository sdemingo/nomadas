package http

import (
	"net/http"
)

func init() {
	http.HandleFunc("/help", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, Help)
	})
}
