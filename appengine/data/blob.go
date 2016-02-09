package data

import (
	"appengine"
	"appengine/blobstore"
)

func (op *DataConn) DeleteBlob(key string) error {
	c := op.Wreq.C
	blobkey := appengine.BlobKey(key)
	return blobstore.Delete(c, blobkey)
}
