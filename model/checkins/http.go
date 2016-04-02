package checkins

import (
	"fmt"
	"strconv"

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
