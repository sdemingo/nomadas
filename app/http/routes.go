package http

import (
	"net/http"

	"model/checkins"
	"model/points"
	"model/users"
)

var routes map[string]bool

var directRoutes map[string]bool

func init() {
	routes = make(map[string]bool)

	directRoutes = map[string]bool{
		"/":              true,
		"/logout":        true,
		"/admin":         true,
		"/blob":          true,
		"/points/export": true,
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		routes["/"] = true
		AppHandler(w, r, Welcome)
	})
	http.HandleFunc("/help", func(w http.ResponseWriter, r *http.Request) {
		routes["/help"] = true
		AppHandler(w, r, Help)
	})
	http.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		routes["/admin"] = true
		AppHandler(w, r, Admin)
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
	http.HandleFunc("/points/edit", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/edit"] = true
		AppHandler(w, r, points.NewPoint)
	})
	http.HandleFunc("/points/upload", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/upload"] = true
		AppHandler(w, r, points.NewUploadHandler)
	})
	http.HandleFunc("/points/delete", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/delete"] = true
		AppHandler(w, r, points.DeletePoint)
	})
	http.HandleFunc("/points/get", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/get"] = true
		AppHandler(w, r, points.GetOnePoint)
	})
	http.HandleFunc("/points/add", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/add"] = true
		AppHandler(w, r, points.AddPoint)
	})
	http.HandleFunc("/points/list", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/list"] = true
		AppHandler(w, r, points.GetListPoints)
	})
	http.HandleFunc("/points/export", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/export"] = true
		AppHandler(w, r, points.ExportListPoints)
	})
	http.HandleFunc("/points/tags/add", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/tags/add"] = true
		AppHandler(w, r, points.AddTag)
	})
	http.HandleFunc("/points/tags/list", func(w http.ResponseWriter, r *http.Request) {
		routes["/points/tags/list"] = true
		AppHandler(w, r, points.GetListTags)
	})

	// Checkins
	http.HandleFunc("/checkins/edit", func(w http.ResponseWriter, r *http.Request) {
		routes["/checkins/edit"] = true
		AppHandler(w, r, checkins.NewCheckin)
	})
	http.HandleFunc("/checkins/new", func(w http.ResponseWriter, r *http.Request) {
		routes["/checkins/new"] = true
		AppHandler(w, r, checkins.AddCheckin)
	})
	http.HandleFunc("/checkins/delete", func(w http.ResponseWriter, r *http.Request) {
		routes["/checkins/delete"] = true
		AppHandler(w, r, checkins.DeleteCheckin)
	})
}
