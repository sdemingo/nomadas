package http

import (
	"net/http"

	"model/points"
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

	// Points and tags
	http.HandleFunc("/points/new", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, points.NewPoint)
	})
	http.HandleFunc("/points/add", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, points.AddPoint)
	})
	http.HandleFunc("/points/tags/add", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, points.AddTag)
	})
	http.HandleFunc("/points/tags/list", func(w http.ResponseWriter, r *http.Request) {
		AppHandler(w, r, points.GetListTags)
	})
}
