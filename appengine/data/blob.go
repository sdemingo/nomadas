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

/*
func (op *DataConn) ReadBlob(key string) ([]byte, error) {
	c := op.Wreq.C
	blobkey := appengine.BlobKey(key)
	info, err := blobstore.Stat(c, blobkey)
	if err != nil {
		return nil, err
	}
	blobBytes := make([]byte, info.Size)
	blobReader := blobstore.NewReader(c, blobkey)
	blobReader.Read(blobBytes)
	return blobBytes, nil
}
*/

func (op *DataConn) Size(key string) (int64, error) {
	c := op.Wreq.C
	blobkey := appengine.BlobKey(key)
	info, err := blobstore.Stat(c, blobkey)
	if err != nil {
		return 0, err
	}

	return info.Size, nil
}
