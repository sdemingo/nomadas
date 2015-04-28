package points

import (
	"fmt"
	"errors"
)

const(
	MAXSZNAME = 100
	MAXSZDESC = 1024

	ERR_NOTVALIDPOINT = "Punto no valido"
)



type Point struct{
	Id int64     `datastore:"-"`  // ignored by datastore
	UserId int64
	Name string
	Lat float32  `json:",string"`
	Lon float32  `json:",string"`
	ImageKey string
	Desc string
}





func NewPoint(name string)(*Point){
	p:=new(Point);
	p.Name=name;
	return p
}


func (p Point) IsValid()(err error){
	
	if len(p.Name)>MAXSZNAME{
		return errors.New(ERR_NOTVALIDPOINT)
	}
	
	if len(p.Desc)>MAXSZDESC{
		return errors.New(ERR_NOTVALIDPOINT)
	}
	return
}


func (p Point) String()(string){
	s:=""
	s=fmt.Sprintf("%s (%f,%f)",p.Name,p.Lat,p.Lon)
	return s
}


