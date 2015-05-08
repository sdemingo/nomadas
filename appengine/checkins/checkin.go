package checkins

import (
	"time"
	"fmt"
        "bytes"
	"encoding/json"
)


type Checkin struct{
	Id int64           `datastore:"-"`  // ignored by datastore
	Username string    `datastore:"-"`  // ignored by datastore
	Stamp TimeStamp    `datastore:"-"` // ignored by datastore

	UserId int64
	PointId int64
	DBStamp time.Time     `json:"-"`      // ignored by json (only for the DB)
	Nights int
	Text string
}


type TimeStamp time.Time

var timeLayout = "1/2006"


func (t TimeStamp) MarshalJSON() ([]byte, error) {
    //do your serializing here
    stamp := fmt.Sprintf("\"%s\"", time.Time(t).Format(timeLayout))
    return []byte(stamp), nil
}


func (t *TimeStamp) UnmarshalJSON(raw []byte) (err error){

	b := bytes.NewBuffer(raw)
        dec := json.NewDecoder(b)
        var s string
        if err := dec.Decode(&s); err != nil {
                return err
        }
	tm, err := time.Parse(timeLayout,s)

	*t = (TimeStamp)(tm)
	return
}




func (c Checkin) IsValid()(err error){
	return nil
}