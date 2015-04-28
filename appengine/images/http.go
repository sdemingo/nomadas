package images

import (
	"fmt"
	"errors"
	"net/http"


	"app"
	"appengine"
	"appengine/users"
	"appengine/blobstore"

)

const (
	MAXSZIMAGE = 300 * 1024	

	ERR_FILENOTSTORED = "File no stored in database"
	ERR_FILENOTVALID = "File format not valid"
	ERR_FILENOTDELETED = "File cannot be deleted"
	)


func init() {
	http.HandleFunc("/images/new",newImage)
	http.HandleFunc("/images/upload", storeImage)
	http.HandleFunc("/images/serve", handleServe)
	http.HandleFunc("/images/delete",deleteImage)
}




func newImage(w http.ResponseWriter, r *http.Request) {

	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

        url, err := blobstore.UploadURL(c, "/images/upload", nil)
        if err != nil {
                app.ServeError(c, w, err)
                return
        }

	fmt.Fprintf(w, "%s", url)
}




func storeImage(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}


	blobs, _, err := blobstore.ParseUpload(r)
        if err != nil {
                app.ServeError(c, w, err)
                return
        }

        file := blobs["img"]
        if len(file) == 0 {
		app.ServeError(c, w, errors.New(ERR_FILENOTSTORED))
                return
        }


	if file[0].Size > MAXSZIMAGE {
		err:=blobstore.Delete(c,file[0].BlobKey)
		if err!=nil{
			c.Errorf(ERR_FILENOTDELETED)
		}
		app.ServeError(c, w, errors.New(ERR_FILENOTVALID))
                return
	}

	// Comprobar también el formato de la imagen

	fmt.Fprintf(w, "%s", string(file[0].BlobKey))
}



func handleServe(w http.ResponseWriter, r *http.Request) {
	if err:=users.CheckPerm(w,r,users.OP_VIEW); err!=nil{
		return
	}
        blobstore.Send(w, appengine.BlobKey(r.FormValue("blobKey")))
}




func deleteImage(w http.ResponseWriter, r *http.Request) {
	c := appengine.NewContext(r)
	if err:=users.CheckPerm(w,r,users.OP_UPDATE); err!=nil{
		return
	}

	key:=appengine.BlobKey(r.FormValue("blobKey"))
	err:=blobstore.Delete(c,key)
	if err != nil {
                app.ServeError(c, w, err)
                return
        }
}
