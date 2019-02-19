# 构建
build:
	cd Server; rm -rf pkg bin/room.cafe
	cd Server; go clean -i ./src/room.cafe/...
	cd Server; source env.sh; CGO_ENABLED=0 go install -v ./src/room.cafe/...

build-backend:
	cd Server; source env.sh && make build-linux-64
	cd Server; mv bin/linux_amd64/room.cafe ../package

build-frontend:
	cd Website; yarn && yarn build
	cd Website; cp -R dist/* ../package/front/

production: build-backend build-frontend
	tar zcvf room.cafe.tar.gz package/
