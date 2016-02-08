package points

import (
	"fmt"
	"strings"
	"time"

	"appengine/data"
	"appengine/srv"
)

type Point struct {
	Id        int64 `datastore:"-"`
	UserId    int64
	Name      string
	Desc      string
	TimeStamp time.Time `json:"`
	Lat       float32   `json:",string"`
	Lon       float32   `json:",string"`
	ImageKey  string    `json:"`
	Tags      []string  `datastore:"-"`
}

func (p *Point) IsValid() bool {
	strings.Trim(p.Name, " \t")

	return (p.Name != "") &&
		(p.Desc != "") &&
		(p.Lat != 0.0) &&
		(p.Lon != 0.0)
}

func (p *Point) ID() int64 {
	return p.Id
}

func (p *Point) SetID(id int64) {
	p.Id = id
}

type PointBuffer []*Point

func NewPointBuffer() PointBuffer {
	return make([]*Point, 0)
}

func (v PointBuffer) At(i int) data.DataItem {
	return data.DataItem(v[i])
}

func (v PointBuffer) Set(i int, t data.DataItem) {
	v[i] = t.(*Point)
}

func (v PointBuffer) Len() int {
	return len(v)
}

func addPoint(wr srv.WrapperRequest, p *Point) error {
	q := data.NewConn(wr, "points")
	err := q.Put(p)
	if err != nil {
		return fmt.Errorf("putpoint: %v", err)
	}

	err = addPointTags(wr, p)
	if err != nil {
		return fmt.Errorf("putpoint: %v", err)
	}

	return nil
}

func deletePoint(wr srv.WrapperRequest, p *Point) error {
	return nil
}

func getPointById(wr srv.WrapperRequest, id int64) (*Point, error) {
	p := new(Point)
	p.Id = id
	q := data.NewConn(wr, "points")
	err := q.Get(p)
	if err != nil {
		return nil, fmt.Errorf("getpointbyid: %v", err)
	}

	p.Tags, err = getPointTags(wr, p)
	if err != nil {
		return nil, fmt.Errorf("getpointbyid: %v", err)
	}
	return p, nil
}

func getPointsByOwner(wr srv.WrapperRequest, id int64) ([]*Point, error) {
	ps := NewPointBuffer()
	q := data.NewConn(wr, "points")
	q.AddFilter("UserId =", id)
	err := q.GetMany(&ps)
	if err != nil {
		return nil, fmt.Errorf("getpointsbyowner: %v", err)
	}

	for i := range ps {
		ps[i].Tags, err = getPointTags(wr, ps[i])
		if err != nil {
			return nil, fmt.Errorf("getpointbyowner: %v", err)
		}
	}
	return ps, nil
}
