package http

import (
	"errors"
	"net/http"

	"model/users"

	"appengine/srv"
)

func init() {
	http.HandleFunc("/", root)
	http.HandleFunc("/logout", logout)
}

func root(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "/welcome", http.StatusMovedPermanently)
}

func logout(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

func RedirectToLogin(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

var adminTmpl = "app/tmpl/adminWelcome.html"
var helpTmpl = "app/tmpl/help.html"

func Welcome(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return "", errors.New(users.ERR_NOTOPERATIONALLOWED)
	}
	return adminTmpl, nil
}

func Help(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return helpTmpl, nil
}
