package checkins

import (
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"app/core"
	"model/points"

	"appengine/srv"
)

// Templates
var infoTmpl = "app/tmpl/info.html"
var newCheckinTmpl = "model/checkins/tmpl/newCheckin.html"

//var viewPointTmpl = "model/points/tmpl/viewPoint.html"

func NewCheckin(wr srv.WrapperRequest, tc map[string]interface{}) (string, error) {
	if wr.NU.GetRole() < core.ROLE_ADMIN {
		return infoTmpl, fmt.Errorf("checkins: newcheckin: %s", core.ERR_NOTOPERATIONALLOWED)
	}

	wr.Parse()
	sid := wr.Values.Get("id")
	if sid != "" {
		id, err := strconv.ParseInt(sid, 10, 64)
		if err != nil {
			return infoTmpl, fmt.Errorf("checkins: newcheckin: bad point id: %v", err)
		}
		point, err := points.GetPointById(wr, id)
		if err != nil {
			return infoTmpl, fmt.Errorf("checkins: getonepoint: %v", err)
		}

		tc["Content"] = point
	}

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

	checkin.UserId = wr.NU.ID()
	checkin.TimeStamp, _ = time.Parse(CHECKINDATEFORMAT, checkin.RawStamp)

	err = addCheckin(wr, checkin)
	if err != nil {
		return infoTmpl, fmt.Errorf("checkins: addcheckin: %v", err)
	}

	tc["Content"] = checkin
	return infoTmpl, nil
}
