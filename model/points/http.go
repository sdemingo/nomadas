package points

import (
	"encoding/json"
	"fmt"

	"model/users"

	"appengine/srv"
)

// Templates
var infoTmpl = "app/tmpl/info.html"
var newPointTmpl = "model/points/tmpl/newPoint.html"

func GetListPoints(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {

	return infoTmpl, nil
}

func GetOnePoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {

	return infoTmpl, nil
}

func NewPoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	return newPointTmpl, nil
}

func AddPoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {

	return infoTmpl, nil
}

func GetListTags(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: getlisttags: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	wr.R.ParseForm()
	tags, err := getAllTags(wr, -1)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: getlisttags: %v", err)
	}
	tc["Content"] = tags

	return infoTmpl, nil
}

func AddTag(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: addtag: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	tag := new(Tag)

	decoder := json.NewDecoder(wr.R.Body)
	err := decoder.Decode(tag)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addtag: %v", err)
	}
	err = addTag(wr, tag)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addtag: %v", err)
	}

	tc["Content"] = tag
	return infoTmpl, nil
}
