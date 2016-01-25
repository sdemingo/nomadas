package http

import (
	"net/http"
)

func init() {
	http.HandleFunc("/welcome", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, Welcome)
	})
	http.HandleFunc("/help", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, Help)
	})

}
