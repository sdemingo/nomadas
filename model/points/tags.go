package points

import (
	"fmt"

	"appengine/data"
	"appengine/srv"
)

// Point Tag Model

type Tag struct {
	Id   int64 `datastore:"-"`
	Name string
}

func (t Tag) ID() int64 {
	return t.Id
}

func (t *Tag) SetID(id int64) {
	t.Id = id
}

type TagBuffer []*Tag

func NewTagBuffer() TagBuffer {
	return make([]*Tag, 0)
}

func (v TagBuffer) At(i int) data.DataItem {
	return data.DataItem(v[i])
}

func (v TagBuffer) Set(i int, t data.DataItem) {
	v[i] = t.(*Tag)
}

func (v TagBuffer) Len() int {
	return len(v)
}

type PointTag struct {
	Id      int64 `json:",string" datastore:"-"`
	PointId int64
	TagId   int64
}

func (ut PointTag) ID() int64 {
	return ut.Id
}

func (ut *PointTag) SetID(id int64) {
	ut.Id = id
}

type PointTagBuffer []*PointTag

func NewPointTagBuffer() PointTagBuffer {
	return make([]*PointTag, 0)
}

func (v PointTagBuffer) At(i int) data.DataItem {
	return data.DataItem(v[i])
}

func (v PointTagBuffer) Set(i int, t data.DataItem) {
	v[i] = t.(*PointTag)
}

func (v PointTagBuffer) Len() int {
	return len(v)
}

// Add new tag to the database
func addTag(wr srv.WrapperRequest, t *Tag) error {
	q := data.NewConn(wr, "tags")
	err := q.Put(t)
	if err != nil {
		return fmt.Errorf("addtag: %v", err)
	}
	return nil
}

// Return a tag
func getTagById(wr srv.WrapperRequest, id int64) (*Tag, error) {
	t := new(Tag)
	t.Id = id
	q := data.NewConn(wr, "tags")
	err := q.Get(t)
	if err != nil {
		return nil, fmt.Errorf("gettagbyid: %v", err)
	}
	return t, nil
}

// Return all tags stored in database by a user. If userId is less
// than zero its return all tags in the database
func getAllTags(wr srv.WrapperRequest, userId int64) (TagBuffer, error) {
	var err error

	tags := NewTagBuffer()
	q := data.NewConn(wr, "tags")
	if userId < 0 {
		err = q.GetMany(&tags)
	}
	if err != nil {
		return nil, fmt.Errorf("getalltags: %v", err)
	}
	return tags, nil
}

// Return the points of the user session that have all tags in the array
func getPointsByTags(wr srv.WrapperRequest, tags []string) (PointBuffer, error) {
	return nil, nil
}

// Add the tags of the point to the database
func addPointTags(wr srv.WrapperRequest, q *Point) error {

	return nil
}

// Return the tags of the point
func getPointTags(wr srv.WrapperRequest, q *Point) ([]string, error) {
	return nil, nil

}
