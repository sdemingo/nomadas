package http

import (
	"errors"
	"fmt"
	"net/http"

	"app/core"
	"model/points"

	"appengine/data"
	"appengine/srv"
)

func init() {
	http.HandleFunc("/logout", logout)
	http.HandleFunc("/blob", serveBlob)
}

func logout(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

func serveBlob(w http.ResponseWriter, r *http.Request) {
	wr := srv.NewWrapperRequest(w, r)

	if !core.AppConfig.PublicBlob {
		err := getCurrentUser(&wr)
		if err != nil {
			RedirectToLogin(w, wr.R)
			return
		}
	}

	q := data.NewConn(wr, "")
	bytes, _ := q.ReadBlob(r.FormValue("id"))
	w.Write(bytes)
}

func RedirectToLogin(w http.ResponseWriter, r *http.Request) {
	srv.RedirectUserLogin(w, r)
}

var baseTmpl = "app/tmpl/base.html"
var helpTmpl = "app/tmpl/help.html"
var adminTmpl = "app/tmpl/admin.html"

func Help(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return helpTmpl, nil
}

func Welcome(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_GUEST {
		return "", errors.New(core.ERR_NOTOPERATIONALLOWED)
	}
	return baseTmpl, nil
}

func Admin(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return "", errors.New(core.ERR_NOTOPERATIONALLOWED)
	}

	tags, err := points.GetAllTags(wr, -1)
	if err != nil {
		return adminTmpl, fmt.Errorf("app: admin: %v", err)
	}
	tc["AllTagsNames"] = tags
	return adminTmpl, nil
}
