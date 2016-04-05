package checkins

import (
	"fmt"
	"time"

	"appengine/data"
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

func (c *Checkin) GetTimeStamp() string {
	return c.TimeStamp.Format(CHECKINDATEFORMAT)
}

func (c *Checkin) ID() int64 {
	return c.Id
}

func (c *Checkin) SetID(id int64) {
	c.Id = id
}

type CheckinBuffer []*Checkin

func NewCheckinBuffer() CheckinBuffer {
	return make([]*Checkin, 0)
}

func (c CheckinBuffer) At(i int) data.DataItem {
	return data.DataItem(c[i])
}

func (c CheckinBuffer) Set(i int, t data.DataItem) {
	c[i] = t.(*Checkin)
}

func (c CheckinBuffer) Len() int {
	return len(c)
}

func addCheckin(wr srv.WrapperRequest, c *Checkin) error {

	q := data.NewConn(wr, "checkins")

	err := q.Put(c)
	if err != nil {
		return fmt.Errorf("addcheckins: %v", err)
	}

	return nil
}

func GetCheckinsByPoint(wr srv.WrapperRequest, id int64) ([]*Checkin, error) {
	cs := NewCheckinBuffer()
	q := data.NewConn(wr, "checkins")
	q.AddFilter("PointId =", id)
	err := q.GetMany(&cs)
	if err != nil {
		return nil, fmt.Errorf("getcheckinsbypoint: %v", err)
	}

	return cs, nil
}
