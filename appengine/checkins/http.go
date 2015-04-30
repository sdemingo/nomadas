package checkins

import (
	"fmt"
	"errors"
	"net/http"
	"encoding/json"
	"strconv"
	"appengine/users"
	"time"

	"app"
	"appengine"
	"appengine/datastore"
)

func init() {
	http.HandleFunc("/checkins/add", newCheckin)
	http.HandleFunc("/checkins/get",getCheckin)
	http.HandleFunc("/checkins/delete",deleteCheckin)
}




func newCheckin(w http.ResponseWriter, r *http.Request) {

	var err error

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

	var ck Checkin  

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&ck)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	if err = ck.IsValid(); err!=nil{
		app.ServeError(c,w,err)
		return
	}


	// Paso del objeto TimeStamp que me llega por JSON a 
	// un time.Time que es el unico compatible con el Datastore
	ck.DBStamp = time.Time(ck.Stamp)

	key := datastore.NewKey(c, "checkins", "", 0, nil)
	key, err = datastore.Put(c, key, &ck)
	ck.Id = key.IntID()

	jbody,err:=json.Marshal(ck)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	fmt.Fprintf(w, "%s", string(jbody[:len(jbody)]))
}



func getCheckin(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_VIEW); err!=nil{
		return
	}

	r.ParseForm()

	var checkins []Checkin

	if r.Form["userId"]!=nil{
		// Busco checkins de un usuario
		uid,err:=strconv.ParseInt(r.Form["userId"][0],10,64)
		if err!=nil{
			app.ServeError(c,w,errors.New("User not found. Bad ID"))	
			return
		}

		q := datastore.NewQuery("checkins").Filter("UserId =",uid).Order("-DBStamp")
		keys,_:= q.GetAll(c, &checkins)

		// Relleno claves y fechas en formato TimeStamp para aplanarlas
		for i, key := range keys {
			checkins[i].Id = key.IntID()
			checkins[i].Stamp = TimeStamp(checkins[i].DBStamp)
		}
	}

	if r.Form["pointId"]!=nil{
		// Busco checkins de un punto
		pid,err:=strconv.ParseInt(r.Form["pointId"][0],10,64)
		if err!=nil{
			app.ServeError(c,w,errors.New("Point not found. Bad ID"))	
			return
		}

		q := datastore.NewQuery("checkins").Filter("PointId =",pid)
		keys,_:= q.GetAll(c, &checkins)
		for i, key := range keys {
			checkins[i].Id = key.IntID()
			checkins[i].Stamp = TimeStamp(checkins[i].DBStamp)
		}

	}

	if r.Form["id"]!=nil{
		// Busco un checkin concreto

	}

	msg,_:=json.Marshal(checkins)
	fmt.Fprintf(w, "%s", msg)
}



func deleteCheckin(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

	r.ParseForm()
	if r.Form["id"]==nil{
		app.ServeError(c,w,errors.New("Checkin not deleted. ID expected"))	
		return
	}

	id,err:=strconv.ParseInt(r.Form["id"][0],10,64)
	if err!=nil{
		app.ServeError(c,w,errors.New("Checkin not deleted. Bad ID"))	
		return
	}

	k := datastore.NewKey(c, "checkins", "", id, nil)

	// Elimino punto
	err=datastore.Delete(c,k)
	if err!=nil{
		app.ServeError(c,w,errors.New("Checkin not deleted. Entity not found"))	
		return
	}
}
