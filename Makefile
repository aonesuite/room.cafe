# 构建
build-backend:
	mkdir -p package
	cd Server; source env.sh && make build-linux-64
	cd Server; mv bin/linux_amd64/room.cafe ../package

build-frontend:
	mkdir -p package
	rm -rf package/front
	cd website; yarn install && yarn build
	cd website; mv dist ../package/front

production: build-backend build-frontend
	mkdir -p package
	tar zcvf room.cafe.tar.gz package/

deploy:
	scp room.cafe.tar.gz ubuntu@119.28.77.106:/home/ubuntu/room.cafe
	ssh ubuntu@119.28.77.106 tar zxvf /home/ubuntu/room.cafe/room.cafe.tar.gz -C /home/ubuntu/room.cafe

	scp room.cafe.tar.gz ubuntu@119.28.82.60:/home/ubuntu/room.cafe
	ssh ubuntu@119.28.82.60 tar zxvf /home/ubuntu/room.cafe/room.cafe.tar.gz -C /home/ubuntu/room.cafe

status:
	ssh ubuntu@119.28.77.106 supervisorctl status room.cafe
	ssh ubuntu@119.28.82.60 supervisorctl status room.cafe

restart:
	ssh ubuntu@119.28.77.106 supervisorctl restart room.cafe
	ssh ubuntu@119.28.82.60 supervisorctl restart room.cafe