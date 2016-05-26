package checkins

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"app/core"

	"appengine/srv"
)

// Templates
var infoTmpl = "app/tmpl/info.html"
var newCheckinTmpl = "model/checkins/tmpl/newCheckin.html"

// var viewPointTmpl = "model/points/tmpl/viewPoint.html"

func NewCheckin(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("checkins: newcheckin: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()

	pointId := wr.Values.Get("id")

	tc["Content"] = pointId
	return newCheckinTmpl, nil
}

func AddCheckin(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("checkins: addcheckin: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	checkin := new(Checkin)
	decoder := json.NewDecoder(wr.R.Body)
	err := decoder.Decode(checkin)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: addcheckinss: %v", err)
	}

	info := wr.NU.GetInfo()
	checkin.UserId = wr.NU.ID()
	if _, ok := info["Username"]; !ok {
		checkin.UserName = "Anónimo"
	} else {
		checkin.UserName = info["Username"]
	}

	checkin.TimeStamp, _ = time.Parse(CHECKINDATEFORMAT, checkin.RawStamp)

	err = addCheckin(wr, checkin)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: addcheckin: %v", err)
	}

	tc["Content"] = checkin
	return infoTmpl, nil
}

func DeleteCheckin(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("checkins: deletecheckin: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	id, err := strconv.ParseInt(sid, 10, 64)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: deletecheckin: bad id: %v", err)
	}

	c, err := GetCheckinById(wr, id)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: deletecheckin: %v", err)
	}

	err = deleteCheckin(wr, c)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: deletecheckin: %v", err)
	}

	tc["Content"] = c

	return infoTmpl, nil
}
