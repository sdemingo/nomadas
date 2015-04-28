package points

import (
	"fmt"
	"errors"
	"net/http"
	"encoding/json"
	"strconv"
	"appengine/users"

	"app"
	"appengine"
	"appengine/datastore"
	"appengine/blobstore"

)

func init() {
	http.HandleFunc("/points/edit", newPoint)
	http.HandleFunc("/points/get",getPoint)
	http.HandleFunc("/points/delete",deletePoint)
}




func newPoint(w http.ResponseWriter, r *http.Request) {

	var err error

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

	var p Point  

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&p)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	if err = p.IsValid(); err!=nil{
		app.ServeError(c,w,err)
		return
	}
	
	/*

	 - From API reference in google cloud API:
	 NewKey creates a new key. kind cannot be empty. Either one or
	 both of stringID and intID must be zero. If both are zero,
	 the key returned is incomplete. parent must either be a
	 complete key or nil.  

	 */

	key := datastore.NewKey(c, "points", "", p.Id, nil)
	key, err = datastore.Put(c, key, &p)
	p.Id = key.IntID()
	c.Infof("%d",key.IntID())

	jbody,err:=json.Marshal(p)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	fmt.Fprintf(w, "%s", string(jbody[:len(jbody)]))
}



func getPoint(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_VIEW); err!=nil{
		return
	}

	r.ParseForm()


	if r.Form["id"]!=nil{
		id,err:=strconv.ParseInt(r.Form["id"][0],10,64)
		if err!=nil{
			app.ServeError(c,w,errors.New("User not found. Bad ID"))	
			return
		}

		var p Point
		
		// Busco información del usuario en la base de datos
		// y relleno el objeto User para enviar	

		k := datastore.NewKey(c, "points", "", id, nil)
		datastore.Get(c, k, &p)

		p.Id = k.IntID()
		msg,_:=json.Marshal(p)
		fmt.Fprintf(w, "%s", msg)
	}

	if r.Form["userId"]!=nil{
		// Busco puntos de un usuario
		uid,err:=strconv.ParseInt(r.Form["userId"][0],10,64)
		if err!=nil{
			app.ServeError(c,w,errors.New("User not found. Bad ID"))	
			return
		}

		var points []Point

		q := datastore.NewQuery("points").Filter("UserId =",uid)
		keys,_:= q.GetAll(c, &points)
		for i, key := range keys {
			points[i].Id = key.IntID()
		}

		msg,_:=json.Marshal(points)
		fmt.Fprintf(w, "%s", msg)
	}
}



func deletePoint(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

	r.ParseForm()
	if r.Form["id"]==nil{
		app.ServeError(c,w,errors.New("Point not deleted. ID expected"))	
		return
	}

	id,err:=strconv.ParseInt(r.Form["id"][0],10,64)
	if err!=nil{
		app.ServeError(c,w,errors.New("Point not deleted. Bad ID"))	
		return
	}

	k := datastore.NewKey(c, "points", "", id, nil)

	// Eliminar imagen asociada a el del blobStore
	var p Point
	datastore.Get(c, k, &p)
	if p.ImageKey!=""{
		blobstore.Delete(c,appengine.BlobKey(p.ImageKey))
	}
	

	// Elimino punto
	err=datastore.Delete(c,k)
	if err!=nil{
		app.ServeError(c,w,errors.New("Point not deleted. Entity not found"))	
		return
	}


}
