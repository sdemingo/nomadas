package points

import (
	"encoding/json"
	"fmt"
	"time"

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
	url, err := wr.GetMIMEHandler("/points/add")
	if err != nil {
		return infoTmpl, fmt.Errorf("points: newpoint: %v", err)
	}
	tc["HandlerURL"] = url
	return newPointTmpl, nil
}

func AddPoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	srv.Log(wr, "Me estan añadiendo un nuevo punto")

	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: addpoint: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	err := wr.ParseMIMEChunks()
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
	}

	point := new(Point)
	point.TimeStamp = time.Now()
	point.UserId = wr.NU.ID()
	err = json.Unmarshal([]byte(wr.Values.Get("jsonPoint")), point)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
	}

	err = addPoint(wr, point)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
	}

	// TODO:
	// assign point.ImageKey

	tc["Content"] = point
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
