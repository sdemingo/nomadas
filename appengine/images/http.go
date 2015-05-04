package images

import (
	"fmt"
	"errors"
	"net/http"
	"image/jpeg"
	"image"
	"bytes"


	"app"
	"appengine"
	"appengine/users"
	"appengine/blobstore"

)

const (
	MAXSZIMAGE = 400 * 1024	
	MAXWDTIMAGE = 500

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


	key:=file[0].BlobKey
	// Comprobar también el formato de la imagen
	key,_=resizeImage(c,key)  // si mide mas de 500 la reducimos

	// Si continua midiendo demasiado la eliminamos
	if file[0].Size > MAXSZIMAGE {
		err:=blobstore.Delete(c,key)
		if err!=nil{
			c.Errorf(ERR_FILENOTDELETED)
		}
		app.ServeError(c, w, errors.New(ERR_FILENOTVALID))
                return
	}

	fmt.Fprintf(w, "%s", string(key))
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






func resizeImage(c appengine.Context, blobKey appengine.BlobKey)(appengine.BlobKey, error){

	var img1 image.Image
	var delta float32

	fimg := blobstore.NewReader(c,blobKey)
	img1, err := jpeg.Decode(fimg)
	if err!=nil{
		return blobKey,err
	}

	r:=img1.Bounds()
	s:=r.Size()
	
	if (s.X > MAXWDTIMAGE){
		delta=float32(s.X) / MAXWDTIMAGE
	}else{
		//delta=1.0
		return blobKey,nil
	}

	nx:=float32(s.X) / delta
	ny:=float32(s.Y) / delta
	
	img2:=Resize(img1,r,int(nx),int(ny))

	buf := new(bytes.Buffer)
	jpeg.Encode(buf, img2, nil)
	fimg2,_:=blobstore.Create(c,"image/jpeg")
	fimg2.Write(buf.Bytes())
	fimg2.Close()

	// Borramos la grande
	err=blobstore.Delete(c,blobKey)
	if err != nil {
                return blobKey,err
        }
	
	k,err:=fimg2.Key()

	return k,err
}

