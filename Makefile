# 安装
install:
	go mod download
	cd website-v2; yarn install

# 代码风格检验
fix:
	gocheckstyle -config=scripts/golangstyle.json -reporter=plain src 2>&1 | tee -a fix.log
	golint $$(go list ./... | grep -v /vendor/) | tee -a fix.log

# 运行后端服务
serve:
	reflex -s -R '^website*' -R '_test.go$$'\
		-- go run ./main.go -f config.yaml

# 运行前端站点
site:
	cd website-v2; yarn start

# 测试
test:
	CGO_ENABLED=0 go test -v $$(go list ./...)

# 测试报告
report:
	CGO_ENABLED=0 go install -v github.com/axw/gocov/gocov
	CGO_ENABLED=0 go install -v github.com/AlekSi/gocov-xml
	CGO_ENABLED=0 go install -v gopkg.in/matm/v1/gocov-html
	rm -rf coverage.html coverage.xml coverage.txt coverage.log
	sh ./scripts/coverage.sh --html --xml | tee coverage.log

# 构建
build:
	go clean -i ./...
	CGO_ENABLED=0 go install -v ./...

# 编译 linux 64位 运行二进制
build-linux-64:
	go clean -i ./...
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go install -v ./...

# 构建
build-backend:
	mkdir -p package
	make build-linux-64
	mv bin/linux_amd64/room.cafe ../package

build-frontend:
	mkdir -p package
	rm -rf package/front
	cd website; yarn install && yarn build
	cd website; mv dist ../package/front

production: build-backend build-frontend
	mkdir -p package
	tar zcvf room.cafe.tar.gz package/

# 部署
deploy:
	scp room.cafe.tar.gz ubuntu@119.28.82.60:/home/ubuntu/room.cafe
	ssh ubuntu@119.28.82.60 tar zxvf /home/ubuntu/room.cafe/room.cafe.tar.gz -C /home/ubuntu/room.cafe

# 服务状态
status:
	ssh ubuntu@119.28.82.60 supervisorctl status room.cafe

# 重启服务
restart:
	ssh ubuntu@119.28.82.60 supervisorctl restart room.cafe