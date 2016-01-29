package http

import (
	"net/http"

	"model/points"
	"model/users"
)

var routes map[string]bool

func init() {
	routes = make(map[string]bool)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		routes["/"] = true
		AppHandler(w, r, Welcome)
	})
	http.HandleFunc("/help", func(w http.ResponseWriter, r *http.Request) {
		routes["/help"] = true
		AppHandler(w, r, Help)
	})

	// Users routes
	http.HandleFunc("/users/me", func(w http.ResponseWriter, r *http.Request) {
		routes["/users/me"] = true
		AppHandler(w, r, users.GetOne)
	})
	http.HandleFunc("/users/add", func(w http.ResponseWriter, r *http.Request) {
		routes["/users/add"] = true
		AppHandler(w, r, users.Add)
	})

	// Points and tags
	http.HandleFunc("/points/new", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/new"] = true
		AppHandler(w, r, points.NewPoint)
	})
	http.HandleFunc("/points/add", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/add"] = true
		AppHandler(w, r, points.AddPoint)
	})
	http.HandleFunc("/points/tags/add", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/tags/add"] = true
		AppHandler(w, r, points.AddTag)
	})
	http.HandleFunc("/points/tags/list", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/tags/list"] = true
		AppHandler(w, r, points.GetListTags)
	})
}
