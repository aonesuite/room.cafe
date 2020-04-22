# 安装
install:
	go mod download
	cd website; yarn install

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
	cd website; yarn start

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
	mkdir -p package
	rm -rf package/room.cafe
	rm -rf package/front

	go clean -i ./...
	CGO_ENABLED=0 go build -o room.cafe main.go
	mv room.cafe package

	cd website; yarn install && yarn build
	cd website; mv build ../package/front

# 构建
build-production:
	mkdir -p package
	rm -rf package/room.cafe
	rm -rf package/front

	go clean -i ./...
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o room.cafe main.go
	mv room.cafe ./package

	cd website; yarn install && yarn build
	cd website; mv build ../package/front

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