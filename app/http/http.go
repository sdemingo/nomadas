package http

import (
	"net/http"

	"appengine/srv"
)

func init() {
	http.HandleFunc("/logout", logout)
}

func logout(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

func RedirectToLogin(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

var baseTmpl = "app/tmpl/base.html"
var helpTmpl = "app/tmpl/help.html"

func Help(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return helpTmpl, nil
}
