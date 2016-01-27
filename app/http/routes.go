package http

import (
	"net/http"

	"model/users"
)

func init() {
	http.HandleFunc("/help", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, Help)
	})

	// Users routes
	http.HandleFunc("/users/me", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, users.GetOne)
	})
	http.HandleFunc("/users/add", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, users.Add)
	})
}
