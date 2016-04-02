package checkins

import "time"

type Checkin struct {
	Id        int64 `json:",string" datastore:"-"`
	UserId    int64
	PointId   int64
	TimeStamp time.Time `json:"`
	Desc      string
}
