package checkins

import (
	"fmt"
	"sort"
	"strings"
	"time"

	"appengine/data"
	"appengine/srv"
)

const (
	CHECKINDATEFORMAT = "January 2006"
	MAXCHECKINSTOSHOW = 5
)

var localMonths = map[string]string{
	"January":   "Enero",
	"February":  "Febrero",
	"March":     "Marzo",
	"April":     "Abril",
	"May":       "Mayo",
	"June":      "Junio",
	"July":      "Julio",
	"Augoust":   "Agosto",
	"September": "Septiembre",
	"October":   "Octubre",
	"November":  "Noviembre",
	"December":  "Diciembre",
}

type Checkin struct {
	Id        int64 `json:",string" datastore:"-"`
	UserId    int64
	UserName  string
	PointId   int64     `json:",string"`
	RawStamp  string    `datastore:"-"`
	TimeStamp time.Time `json:",`
	Desc      string
}

func (c *Checkin) GetTimeStamp() string {
	s := c.TimeStamp.Format(CHECKINDATEFORMAT)
	for eM, lM := range localMonths {
		if strings.Contains(s, eM) {
			s = strings.Replace(s, eM, lM, 1)
		}
	}
	return s
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

func (c CheckinBuffer) Less(i, j int) bool {
	return c[i].TimeStamp.After(c[j].TimeStamp)
}

func (c CheckinBuffer) Swap(i, j int) {
	c[i], c[j] = c[j], c[i]
}

func addCheckin(wr srv.WrapperRequest, c *Checkin) error {

	q := data.NewConn(wr, "checkins")

	err := q.Put(c)
	if err != nil {
		return fmt.Errorf("addcheckins: %v", err)
	}

	return nil
}

func deleteCheckin(wr srv.WrapperRequest, c *Checkin) error {
	// TODO
	return nil
}

func GetCheckinById(wr srv.WrapperRequest, id int64) (*Checkin, error) {
	// TODO
	return nil, nil
}

func GetCheckinsByPoint(wr srv.WrapperRequest, id int64) ([]*Checkin, error) {
	cs := NewCheckinBuffer()
	q := data.NewConn(wr, "checkins")
	q.AddFilter("PointId =", id)
	err := q.GetMany(&cs)
	if err != nil {
		return nil, fmt.Errorf("getcheckinsbypoint: %v", err)
	}

	sort.Sort(cs)

	return cs, nil
}

func GetCheckinsByUser(wr srv.WrapperRequest, id int64) ([]*Checkin, error) {
	cs := NewCheckinBuffer()
	q := data.NewConn(wr, "checkins")
	q.AddFilter("UserId =", id)
	err := q.GetMany(&cs)
	if err != nil {
		return nil, fmt.Errorf("getcheckinsbyuser: %v", err)
	}

	sort.Sort(cs)

	return cs, nil
}
