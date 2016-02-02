package srv

import (
	"net/http"
	"net/url"

	"app/users"

	"appengine"
	"appengine/blobstore"
	"appengine/user"
)

type WrapperRequest struct {
	R          *http.Request
	C          appengine.Context
	U          *user.User
	NU         users.AppUser
	Values     url.Values
	MIMEChunks map[string][]*blobstore.BlobInfo

	JsonResponse bool
}

func NewWrapperRequest(r *http.Request) WrapperRequest {
	c := appengine.NewContext(r)
	return WrapperRequest{r, c, user.Current(c), nil, nil, nil, false}
}

func (wr WrapperRequest) IsAdminRequest() bool {
	return user.IsAdmin(wr.C)
}

func (wr *WrapperRequest) Parse() {
	wr.R.ParseForm()
	wr.Values = wr.R.Form
}

func (wr *WrapperRequest) ParseMIMEChunks() error {
	var err error
	wr.MIMEChunks, wr.Values, err = blobstore.ParseUpload(wr.R)
	return err
}

// Return a valid handler to receive the MIME HTTP request. It's be used
// once as the appengine blobstore model require.
func (wr WrapperRequest) GetMIMEHandler(baseURL string) (*url.URL, error) {
	var blobMaxBytesSize = int64(500 * 1025)
	opt := blobstore.UploadURLOptions{
		MaxUploadBytes:        blobMaxBytesSize,
		MaxUploadBytesPerBlob: blobMaxBytesSize,
		StorageBucket:         ""}
	uploadURL, err := blobstore.UploadURL(wr.C, baseURL, &opt)
	return uploadURL, err

}

func Log(wr WrapperRequest, msg string) {
	wr.C.Infof("%s", msg)
}

func RedirectUserLogin(w http.ResponseWriter, r *http.Request) {
	wr := NewWrapperRequest(r)
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
