package users

import (
	"errors"
)

const (
	ROLE_ADMIN = 15
	ROLE_COMMITER = 7   
	ROLE_CHECKIN = 3
	ROLE_GUEST = 1
	
	OP_VIEW = 1
	OP_CHECKIN = 2
	OP_UPDATE = 4
	OP_ADMIN = 8   // labores de administración (crear usuarios, ....)

	MAXSZUSERNAME = 100

	ERR_NOTVALIDUSER = "Usuario no valido"
)


type NUser struct{
	Id int64     `datastore:"-"`  // ignored by datastore
	Mail string  
	Name string
	Role int8	
}


func IsAllowed(userPerm byte, opMask byte)(bool){
	return opMask == userPerm & opMask
}


func (n NUser)IsValid()(err error){

	if len(n.Name)<0 || len(n.Name)>MAXSZUSERNAME{
		return errors.New(ERR_NOTVALIDUSER)
	}

	if len(n.Mail)<0 || len(n.Mail)>MAXSZUSERNAME{
		return errors.New(ERR_NOTVALIDUSER)
	}

	return
}
