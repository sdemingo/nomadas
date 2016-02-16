package core

const (
	ROLE_GUEST = iota //0
	ROLE_ADMIN = iota //1

	ERR_NOTOPERATIONALLOWED = "Operación no permitida"
)

var RoleNames = []string{
	ROLE_GUEST: "Invitado",
	ROLE_ADMIN: "Administrador"}

type AppUser interface {
	ID() int64
	GetInfo() map[string]string
	GetRole() int8
	GetEmail() string
}
