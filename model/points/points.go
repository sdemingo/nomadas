package points

import (
	"fmt"
	"html/template"
	"strings"
	"time"

	"appengine/data"
	"appengine/srv"

	"github.com/russross/blackfriday"
)

type Point struct {
	Id        int64 `json:",string" datastore:"-"`
	UserId    int64
	Name      string
	Desc      string
	TimeStamp time.Time `json:"`
	Lat       float32   `json:",string"`
	Lon       float32   `json:",string"`
	ImageKey  string    `json:"`
	Tags      []string  `datastore:"-"`
	NChecks   int       `datastore:"-"`
}

func (p *Point) IsValid() bool {
	strings.Trim(p.Name, " \t")

	return (p.Name != "") &&
		(p.Desc != "") &&
		(p.Lat != 0.0) &&
		(p.Lon != 0.0)
}

func (p *Point) HasTag(tag string) bool {
	for _, t := range p.Tags {
		if tag == t {
			return true
		}
	}
	return false
}

func (p *Point) GetHTMLDesc() template.HTML {
	in := []byte(p.Desc)
	return template.HTML(string(blackfriday.MarkdownBasic(in)))
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

	image := wr.MIMEChunks["Image"]
	if len(image) > 0 {
		p.ImageKey = string(image[0].BlobKey)
	}

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
	q := data.NewConn(wr, "points")

	err := deletePointTags(wr, p)
	if err != nil {
		return fmt.Errorf("deletepoint: %v", err)
	}

	if p.ImageKey != "" {
		q.DeleteBlob(p.ImageKey)
	}
	err = q.Delete(p)
	if err != nil {
		return fmt.Errorf("deletepoint: %v", err)
	}
	return nil
}

func updatePoint(wr srv.WrapperRequest, id int64, newp *Point) error {

	oldp, err := GetPointById(wr, id)
	if err != nil {
		return fmt.Errorf("updatepoint: %v", err)
	}
	oldp.Desc = newp.Desc
	oldp.Name = newp.Name

	// update tags
	err = deletePointTags(wr, oldp)
	if err != nil {
		return fmt.Errorf("updatepoint: %v", err)
	}
	oldp.Tags = newp.Tags
	err = addPointTags(wr, oldp)
	if err != nil {
		return fmt.Errorf("updatepoint: %v", err)
	}

	// update image
	image := wr.MIMEChunks["Image"]
	if len(image) > 0 {
		q := data.NewConn(wr, "")
		newImageKey := string(image[0].BlobKey)
		q.DeleteBlob(oldp.ImageKey)
		oldp.ImageKey = newImageKey
	}

	q := data.NewConn(wr, "points")
	err = q.Put(oldp)
	if err != nil {
		return fmt.Errorf("updatepoint: %v", err)
	}

	return nil
}

func filterPoints(points []*Point, tags []string) {
	// TODO:
	// select points of the array which all tags in the tags array
}

func GetPointById(wr srv.WrapperRequest, id int64) (*Point, error) {
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

func GetPointsByOwner(wr srv.WrapperRequest, id int64) ([]*Point, error) {
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
