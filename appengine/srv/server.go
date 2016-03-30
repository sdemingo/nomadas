package srv

import (
	"fmt"
	"net/http"
	"net/url"

	"app/core"

	"appengine"
	"appengine/blobstore"
	"appengine/user"
)

type WrapperRequest struct {
	R          *http.Request
	RW         http.ResponseWriter
	C          appengine.Context
	U          *user.User
	NU         core.AppUser
	Values     url.Values
	MIMEChunks map[string][]*blobstore.BlobInfo

	JsonResponse bool
}

func NewWrapperRequest(wr http.ResponseWriter, r *http.Request) WrapperRequest {
	c := appengine.NewContext(r)
	return WrapperRequest{r, wr, c, user.Current(c), nil, nil, nil, false}
}

func (wr WrapperRequest) IsAdminRequest() bool {
	return user.IsAdmin(wr.C)
}

func (wr *WrapperRequest) Parse() {
	wr.R.ParseForm()
	wr.Values = wr.R.Form
}

func (wr *WrapperRequest) ParseMIMEChunks() error {
	var MaxBlobSize = int64(400 * 1024)
	var err error
	wr.MIMEChunks, wr.Values, err = blobstore.ParseUpload(wr.R)

	for _, mimeBlob := range wr.MIMEChunks {
		for _, blob := range mimeBlob {
			c := wr.C
			info, err := blobstore.Stat(c, blob.BlobKey)
			if err != nil || info.Size > MaxBlobSize {
				blobstore.Delete(c, blob.BlobKey)
				return fmt.Errorf("Image not valid")
			}
		}
	}
	return err
}

// Return a valid handler to receive the MIME HTTP request. It's be used
// once as the appengine blobstore model require.
func (wr WrapperRequest) GetMIMEHandler(baseURL string) (*url.URL, error) {
	uploadURL, err := blobstore.UploadURL(wr.C, baseURL, nil)
	return uploadURL, err

}

func Log(wr WrapperRequest, msg string) {
	wr.C.Infof("%s", msg)
}

func RedirectUserLogin(w http.ResponseWriter, r *http.Request) {
	wr := NewWrapperRequest(w, r)
	var url string
	var err error
	if wr.U != nil {
		url, err = user.LogoutURL(wr.C, "/")
	} else {
		url, err = user.LoginURL(wr.C, wr.R.URL.String())
	}
	if err != nil {
		//errorResponse(wr, w, err)
		return
	}
	w.Header().Set("Location", url)
	w.WriteHeader(http.StatusFound)
}
