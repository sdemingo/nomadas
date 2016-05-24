package users

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	"app/core"
	"model/checkins"
	"model/points"

	"appengine/srv"
)

// Templates

var newTmpl = "model/users/tmpl/edit.html"
var viewTmpl = "model/users/tmpl/view.html"
var infoTmpl = "app/tmpl/info.html"
var listTmpl = "model/users/tmpl/listUsers.html"

func Main(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return infoTmpl, nil
}

func GetList(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return viewTmpl, fmt.Errorf("users: getlist: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	wr.R.ParseForm()
	nus, err := getAllUsers(wr)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: getlist: %v", err)
	}

	tc["Content"] = nus

	return listTmpl, nil
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

		tc["TotalCheckins"] = 0
		tc["TotalPoints"] = 0

		// fetch all checkins to show lastest
		fetchUsersCheckins(wr, tc)

		// fetch all tags for point searches
		tags, err := points.GetAllTags(wr, -1)
		if err != nil {
			return infoTmpl, fmt.Errorf("users: getone: %v", err)
		}
		tc["AllTagsNames"] = tags

	} else {
		if wr.NU.GetRole() < core.ROLE_ADMIN {
			return infoTmpl, fmt.Errorf("users: getone: %s", core.ERR_NOTOPERATIONALLOWED)
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
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return viewTmpl, fmt.Errorf("users: add: %s", core.ERR_NOTOPERATIONALLOWED)
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

func Delete(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("users: deleteuser: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	id, err := strconv.ParseInt(sid, 10, 64)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: deleteuser: bad id: %v", err)
	}

	user, err := getUserById(wr, id)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: deleteuser: %v", err)
	}

	err = deleteUser(wr, user)
	if err != nil {
		return infoTmpl, fmt.Errorf("users: deleteuser: %v", err)
	}

	tc["Content"] = user

	return infoTmpl, nil
}

func fetchUsersCheckins(wr srv.WrapperRequest, tc map[string]interface{}) {
	cs, err := checkins.GetCheckinsByUser(wr, wr.NU.ID())
	if err != nil {
		return
	}
	if len(cs) > 5 {
		cs = cs[:5]
	}

	tc["Checkins"] = cs
	tc["TotalCheckins"] = len(cs)

	pointNames := make([]string, 0)
	for _, c := range cs {
		p, err := points.GetPointById(wr, c.PointId)
		if err != nil {
			pointNames = append(pointNames, "Desconocido")
		} else {
			pointNames = append(pointNames, p.Name)
		}
	}

	tc["PointNames"] = pointNames
	ps, err := points.GetPointsByOwner(wr, wr.NU.ID())
	if err != nil {
		return
	}
	tc["TotalPoints"] = len(ps)
}
