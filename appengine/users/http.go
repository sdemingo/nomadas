package users

import (
	"fmt"
	"net/http"
	"app"
	"errors"
	"encoding/json"
	"strconv"

	"appengine"
	"appengine/user"
	"appengine/datastore"
)


func init() {
	http.HandleFunc("/users/logout", logout)
	http.HandleFunc("/users/welcome", welcome)

	http.HandleFunc("/users/get", getUser)
	http.HandleFunc("/users/edit", addUser)

}


func getUser (w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	CheckPerm(w,r,OP_VIEW)

	r.ParseForm()

	var nu NUser

	if r.Form["mail"]!=nil{
		var nus []NUser
		q := datastore.NewQuery("users").Filter("Mail =", r.Form["mail"][0])
		c.Infof(r.Form["mail"][0])
		keys, err := q.GetAll(c, &nus)
		if (len(keys)==0) || err!=nil{
			app.ServeError(c,w,errors.New("User not found. Bad mail"))	
			return
		}
		nu = nus[0]
		nu.Id =  keys[0].IntID()
	}


	if r.Form["id"]!=nil{
		id,err:=strconv.ParseInt(r.Form["id"][0],10,64)
		if err!=nil{
			app.ServeError(c,w,errors.New("User not found. Bad ID"))	
			return
		}
		if id!=0{
			// Busco información del usuario en la base de datos
			// y relleno el objeto User para enviar	

			k := datastore.NewKey(c, "users", "", id, nil)
			datastore.Get(c, k, &nu)
		}else{
			// Busco información del usuario de sesión

			u := user.Current(c)
			if u == nil {
				redirectLogin(w,r)
				return
			}

			q := datastore.NewQuery("users").Filter("Mail =",u.Email)
			var nusers []NUser
			keys,_:= q.GetAll(c, &nusers)
			
			if (len(nusers)<=0){
				app.ServeError(c,w,errors.New("No user id found"))
				return
			}

			nu=nusers[0]
			nu.Id=keys[0].IntID()
		}
	}

	jbody,err:=json.Marshal(nu)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	fmt.Fprintf(w, "%s", string(jbody[:len(jbody)]))
}



func addUser(w http.ResponseWriter, r *http.Request) {
	var err error

	c := appengine.NewContext(r)
	if err:=CheckPerm(w,r,OP_ADMIN); err!=nil{
		return
	}

	var nu NUser 

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&nu)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	if err = nu.IsValid(); err!=nil{
		app.ServeError(c,w,err)
		return
	}

	key := datastore.NewKey(c, "users", "", 0, nil)
	key, err = datastore.Put(c, key, &nu)
	nu.Id = key.IntID()

	jbody,err:=json.Marshal(nu)
	if err != nil {
		app.ServeError(c,w,err)
		return
	}

	fmt.Fprintf(w, "%s", string(jbody[:len(jbody)]))
}





func logout (w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	u := user.Current(c)

	if u == nil {
		redirectLogin(w,r)
		return
	}

	url, err := user.LogoutURL(c, r.URL.String())
	if err != nil {
		app.ServeError(c,w,err)
		return
	}
	w.Header().Set("Location", url)
	w.WriteHeader(http.StatusFound)
}


func welcome(w http.ResponseWriter, r *http.Request){
	
	if err:=CheckPerm(w,r,OP_VIEW); err!=nil{
		return
	}
	http.Redirect(w,r,"/main",http.StatusMovedPermanently)
}






func redirectLogin(w http.ResponseWriter, r *http.Request){
	c := appengine.NewContext(r)
	url, err := user.LoginURL(c, r.URL.String())
	if err != nil {
		app.ServeError(c,w,err)
		return
	}
	w.Header().Set("Location", url)
	w.WriteHeader(http.StatusFound)
}





func CheckPerm(w http.ResponseWriter, r *http.Request, op byte)(err error) {

	c := appengine.NewContext(r)
	u := user.Current(c)

	if u == nil {
		redirectLogin(w,r)
		return errors.New("user not exits")
	}

	if (!user.IsAdmin(c)){
		// Si no es admin, deberiamos buscarlo en nuestra base
		// de datos de usuarios permitidos y comprobar si 
		// con su rol puede hacer dicha operación
		// De esa busqueda calculamos la variable perm y la comparamos
		// con op

		/*if !IsAllowed(perm,op){
		 redirectLogin(w,r)
		 return
		 }*/

		redirectLogin(w,r)
		return errors.New("user has not perm for the operation")
	}

	// Si es admin puede cualquier cosa
	return nil
}







