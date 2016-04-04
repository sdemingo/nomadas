package checkins

import (
	"chex/appengine/data"
	"fmt"
	"time"

	"appengine/srv"
)

const CHECKINDATEFORMAT = "January 2006"

type Checkin struct {
	Id        int64 `json:",string" datastore:"-"`
	UserId    int64
	PointId   int64     `json:",string"`
	RawStamp  string    `datastore:"-"`
	TimeStamp time.Time `json:",`
	Desc      string
}

func (c *Checkin) ID() int64 {
	return c.Id
}

func (c *Checkin) SetID(id int64) {
	c.Id = id
}

func addCheckin(wr srv.WrapperRequest, c *Checkin) error {

	q := data.NewConn(wr, "checkins")

	err := q.Put(c)
	if err != nil {
		return fmt.Errorf("addcheckins: %v", err)
	}

	return nil
}
