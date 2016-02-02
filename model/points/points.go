package points

import (
	"fmt"
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
	Tags      []string
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
	return nil
}

func deletePoint(wr srv.WrapperRequest, p *Point) error {
	return nil
}

func getPointById(wr srv.WrapperRequest, id int64) (*Point, error) {
	return nil, nil
}

func getPointsByOwner(wr srv.WrapperRequest, id int64) ([]*Point, error) {
	return nil, nil
}
