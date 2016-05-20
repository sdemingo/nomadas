package core

import "strings"

var localMonths = map[string]string{
	"January":   "Enero",
	"February":  "Febrero",
	"March":     "Marzo",
	"April":     "Abril",
	"May":       "Mayo",
	"June":      "Junio",
	"July":      "Julio",
	"Augoust":   "Agosto",
	"September": "Septiembre",
	"October":   "Octubre",
	"November":  "Noviembre",
	"December":  "Diciembre",
}

func GetLocalDateNames(s string) string {
	for eM, lM := range localMonths {
		if strings.Contains(s, eM) {
			s = strings.Replace(s, eM, lM, 1)
		}
	}

	return s
}
