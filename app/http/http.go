package http

import (
	"chex/model/users"
	"errors"
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

func Welcome(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_GUEST {
		return "", errors.New(users.ERR_NOTOPERATIONALLOWED)
	}
	return baseTmpl, nil
}
