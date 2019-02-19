# 构建
build:
	cd Server; rm -rf pkg bin/room.cafe
	cd Server; go clean -i ./src/room.cafe/...
	cd Server; source env.sh; CGO_ENABLED=0 go install -v ./src/room.cafe/...

build-backend:
	mkdir -p package
	cd Server; source env.sh && make build-linux-64
	cd Server; mv bin/linux_amd64/room.cafe ../package

build-frontend:
	mkdir -p package
	cd website; yarn install && yarn build
	cd website; cp -R dist/* ../package/front/

production: build-backend build-frontend
	mkdir -p package
	tar zcvf room.cafe.tar.gz package/
