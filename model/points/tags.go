package points

import (
	"model/users"

	"appengine/data"
	"appengine/srv"
)

// Point Tag Model
type PointTag struct {
	Id      int64 `json:",string" datastore:"-"`
	PointId int64
	Tag     string
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

// Return the points of the user session that have all tags in the array
func getPointsByTags(wr srv.WrapperRequest, tags []string) (PointBuffer, error) {
	ps := NewPointBuffer()
	qTagsAll := NewPointTagBuffer()

	qry := data.NewConn(wr, "questions-tags")
	qry.GetMany(&qTagsAll)

	filtered := make(map[int64]int)
	for _, tag := range tags {
		for _, qt := range qTagsAll {
			if qt.Tag == tag {
				if _, ok := filtered[qt.PointId]; !ok {
					filtered[qt.PointId] = 1
				} else {
					filtered[qt.PointId]++
				}
			}
		}
	}

	for id, _ := range filtered {
		if filtered[id] == len(tags) {
			p, err := getPointById(wr, id)
			if err != nil {
				return ps, err
			}

			// only append the points of the session user
			//if wr.NU.IsAdmin() || q.AuthorId == wr.NU.Id {
			if wr.NU.GetRole() == users.ROLE_ADMIN || p.UserId == wr.NU.ID() {
				ps = append(ps, p)
			}
		}
	}

	return ps, nil
}

// Add the tags of the point to the database
func addPointTags(wr srv.WrapperRequest, q *Point) error {
	for _, tag := range q.Tags {
		qry := data.NewConn(wr, "points-tags")
		qt := &PointTag{PointId: q.Id, Tag: tag}
		err := qry.Put(qt)
		if err != nil {
			return err
		}
	}
	return nil
}

// Return the tags of the point
func getPointTags(wr srv.WrapperRequest, q *Point) ([]string, error) {
	var tags []string
	questionTags := NewPointTagBuffer()

	qry := data.NewConn(wr, "points-tags")
	qry.AddFilter("PointId =", q.Id)
	err := qry.GetMany(&questionTags)
	if err != nil {
		return tags, err
	}

	tags = make([]string, 0)
	for _, qtag := range questionTags {
		tags = append(tags, qtag.Tag)
	}

	return tags, nil

}
