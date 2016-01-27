package users

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"appengine/srv"
)

// Templates

var newTmpl = "model/users/tmpl/edit.html"
var viewTmpl = "model/users/tmpl/view.html"
var infoTmpl = "model/users/tmpl/info.html"
var mainTmpl = "model/users/tmpl/main.html"

func Main(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return mainTmpl, nil
}

func GetList(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < ROLE_ADMIN {
		return viewTmpl, fmt.Errorf("users: getlist: %s", ERR_NOTOPERATIONALLOWED)
	}

	wr.R.ParseForm()
	nus, err := getUsers(wr, wr.R.Form)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: getlist: %v", err)
	}

	tc["Content"] = nus

	return infoTmpl, nil
}

func GetOne(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	var id int64
	var err error

	wr.R.ParseForm()
	if strings.HasSuffix(wr.R.URL.Path, "/me") {
		if wr.NU.ID() > 0 {
			id = wr.NU.ID()
			nu, err := getUserById(wr, id)
			if err != nil {
				return viewTmpl, fmt.Errorf("users: getone: %v", err)
			}
			tc["Content"] = nu
		} else {
			tc["Content"] = wr.NU
		}
	} else {
		if wr.NU.GetRole() < ROLE_ADMIN {
			return infoTmpl, fmt.Errorf("users: getone: %s", ERR_NOTOPERATIONALLOWED)
		}

		id, err = strconv.ParseInt(wr.R.Form["id"][0], 10, 64)
		if err != nil {
			return infoTmpl, fmt.Errorf("%v: %s", err, ERR_USERNOTFOUND)
		}

		nu, err := getUserById(wr, id)
		if err != nil {
			return viewTmpl, fmt.Errorf("users: getone: %v", err)
		}

		tc["UserProfile"] = true
		tc["Content"] = nu
	}

	return viewTmpl, nil
}

func New(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	tc["ImportForm"] = true
	return newTmpl, nil
}

func Add(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < ROLE_ADMIN {
		return viewTmpl, fmt.Errorf("users: add: %s", ERR_NOTOPERATIONALLOWED)
	}

	nu := new(NUser)

	decoder := json.NewDecoder(wr.R.Body)
	err := decoder.Decode(nu)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: add: %v", err)
	}

	err = putUser(wr, nu)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: add: %v", err)
	}

	tc["Content"] = nu

	return infoTmpl, nil
}
