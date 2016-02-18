
files = nomad-config.js nomad-map.js nomad-utils.js nomad-main.js 
target = nomad.js
target_min = nomad.min.js

$(target): $(files)
	echo "Building $(target)"
	echo > $(target)
	for file in $(files) ; do \
		cat $$file >> $(target) ; \
	done
	#uglifyjs $(target) > $(target_min)

all: $(target)
