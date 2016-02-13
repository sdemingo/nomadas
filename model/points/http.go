package points

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"app/users"

	"appengine/srv"
)

// Templates
var infoTmpl = "app/tmpl/info.html"
var newPointTmpl = "model/points/tmpl/newPoint.html"
var viewPointTmpl = "model/points/tmpl/viewPoint.html"

func GetListPoints(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {

	wr.Parse()

	// TODO
	// Check if the request has tags param for search

	id := wr.NU.ID()
	points, err := getPointsByOwner(wr, id)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: getlistpoints: %v", err)
	}

	tc["Content"] = points
	return infoTmpl, nil
}

func GetOnePoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return viewPointTmpl, fmt.Errorf("points: getonepoint: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	id, err := strconv.ParseInt(sid, 10, 64)
	if sid == "" || err != nil {
		return viewPointTmpl, fmt.Errorf("points: getonepoint: bad id")
	}

	point, err := getPointById(wr, id)
	if err != nil {
		return viewPointTmpl, fmt.Errorf("points: getonepoint: %v", err)
	}

	tc["Content"] = point
	return viewPointTmpl, nil
}

func NewPoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: newpoint: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	if sid != "" {
		id, err := strconv.ParseInt(sid, 10, 64)
		if err != nil {
			return viewPointTmpl, fmt.Errorf("points: newpoint: bad id: %v", err)
		}
		point, err := getPointById(wr, id)
		if err != nil {
			return viewPointTmpl, fmt.Errorf("points: getonepoint: %v", err)
		}

		tc["Content"] = point
	}

	tags, err := GetAllTags(wr, -1)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: getlisttags: %v", err)
	}
	tc["AllTagsNames"] = tags

	return newPointTmpl, nil
}

func NewUploadHandler(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	u, err := wr.GetMIMEHandler("/points/add")
	if err != nil {
		return infoTmpl, fmt.Errorf("points: newpoint: %v", err)
	}

	tc["Content"] = u
	return infoTmpl, nil
}

func AddPoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: addpoint: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	err := wr.ParseMIMEChunks()
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
	}

	// Creating a new point
	point := new(Point)
	point.TimeStamp = time.Now()

	point.UserId = wr.NU.ID()
	err = json.Unmarshal([]byte(wr.Values.Get("jsonPoint")), point)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
	}
	if !point.IsValid() {
		return infoTmpl, fmt.Errorf("points: addpoint: any point field has not valid value")
	}

	sid := wr.Values.Get("Id")
	if sid != "" {
		// Editing a point with id. Recover last commited
		id, err := strconv.ParseInt(sid, 10, 64)
		if err != nil {
			return viewPointTmpl, fmt.Errorf("points: addpoint: bad id: %v", err)
		}
		err = updatePoint(wr, id, point)
		if err != nil {
			return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
		}
	} else {
		err = addPoint(wr, point)
		if err != nil {
			return infoTmpl, fmt.Errorf("points: addpoint: %v", err)
		}
	}

	tc["Content"] = point
	return infoTmpl, nil
}

func DeletePoint(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: deletepoint: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	id, err := strconv.ParseInt(sid, 10, 64)
	if err != nil {
		return viewPointTmpl, fmt.Errorf("points: deletepoint: bad id: %v", err)
	}

	point, err := getPointById(wr, id)
	if err != nil {
		return viewPointTmpl, fmt.Errorf("points: deletepoint: %v", err)
	}

	err = deletePoint(wr, point)
	if err != nil {
		return infoTmpl, fmt.Errorf("points: deletepoint: %v", err)
	}

	tc["Content"] = point

	return infoTmpl, nil
}

func GetListTags(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < users.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("points: getlisttags: %s", users.ERR_NOTOPERATIONALLOWED)
	}

	wr.R.ParseForm()
	tags, err := GetAllTags(wr, -1)
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
