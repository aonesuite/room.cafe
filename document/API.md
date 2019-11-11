# API

## 访问地址
- 线上： https://api.room.cafe/


## 连通 API 性

### 请求
```
GET /ping
```

### 返回
```json
{
  "message": "pong"
}
```


## 接口鉴权
创建用户或 OAuth 登录成功后，会返回 [JWT](https://jwt.io/introduction/) token，并设置 Cookie `ROOMCAFE`，
在后续所有接口请求时都需要在请求头中带上 `Authorization Bearer jwt_token` 信息，对于浏览器(必须允许写入和读取 `Cookie`)请求可以忽略

### 请求示例
```
Set-Header: Authorization: Bearer jwt_toke

{
  ...
}
```


## 用户当前状态
```
GET /user/state
```

```
HTTP CODE 200
{
  "avatar": "https://avatars0.githubusercontent.com/u/186694?v=4",
  "email": "michael@room.cafe",
  "gender": "",
  "id": 14,
  "name": "Michael",
  "signed_in": true
}
```


## 创建用户
```
POST /user
```

### 参数
名称 | 类型 | 是否必选 | 描述
----|----|----|----
`name`   | string | 是 | 昵称
`email`  | string | 否 | 邮箱
`gender` | string | 否 | 性别

#### 请求示例
```
{
  "name": "Michael",
  "email": "michael@room.cafe",
  "gender": "male"
}
```

### 返回示例
```
Status: 200 OK
Set-Cookie:[ROOMCAFE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTU3YjNiYjhjNjVkOGRhYjMzMTE5ZiIsImlzc3VyZV9hdCI6MTU0MTc2NTk0NywiZXhwaXJlIjo2MTgwNTJ9.sqy0HJOc8U3uRSOpKjzTRFYgqkyNA0TzB5_FGj_FiG4; Path=/; Domain=niuclass.in; Max-Age=618052; secure; HttpOnly]

{
  "id":     1,
  "name": "Michael",
  "email": "michael@room.cafe",
  "gender": "male"
  "avatar": "https://avatars0.githubusercontent.com/u/186694?v=4",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTU3YjNiYjhjNjVkOGRhYjMzMTE5ZiIsImlzc3VyZV9hdCI6MTU0MTc2NTk0NywiZXhwaXJlIjo2MTgwNTJ9.sqy0HJOc8U3uRSOpKjzTRFYgqkyNA0TzB5_FGj_FiG4"
}
```


## oauth2 回调
```
GET /authorize/:provider/callback
```


## 获取 redirect url
```
GET /authorize/:provider
```


## 退出登录
```
DELETE /user/logout
```

```
HTTP CODE 200
```


## 创建房间
```
POST /room
```

### 参数
名称 | 类型 | 是否必选 | 描述
----|----|----|----
`name`    | `string`  | 否 | 自定义房间名称
`private` | `boolean` | 否 | 是否为私密房间

#### 请求示例
```
{
  "name": "Test Room",
  "private": false
}
```

### 返回内容见 “房间信息”


## 房间信息
```
GET /room/:uuid
```

```
HTTP CODE 200
{
  "id": 64,
  "uuid": "5c80a0a3da8b26069967cb4d",
  "name": "",
  "private": false,
  "state": "",
  "owner": 14,
  "rtc_token": "0QxleRjH-IGYystsYd7Y5O6K2kSmJVt5SaBUbJkY:zjwW6i9Q8DQggzeNSgUVkYzs1Is=:eyJhcHBJZCI6ImR6ZzF0dHRwdyIsInJ...",
  "whiteboard_id": "40ff1dc6f78543898138de823e87b070",
  "whiteboard_token": "WHITEcGFydG5lcl9pZD00V2lmbXgzU3pOTEdJT3pQZnh6cm5XbXE4M3Mwa0x1ckVpcHImc2lnPTViY2VkZTNiNzdlMjUxO...",
  "created_at": 1551933605,
  "updated_at": 1551933605,
  "attendees": null
}
```

### 字段说明

名称 | 类型 | 描述
-----|-----|-----
`id`               | `uint`       | 主键
`uuid`             | `string`     | 房间对外的 UUID
`name`             | `string`     | 自定义房间名称
`private`          | `boolean`    | 是否为私密房间
`state`            | `string`     | 房间状态: active, archived
`owner`            | `uint`       | 管理员
`rtc_token`        | `string`     | RTC RoomToken
`whiteboard_id`    | `string`     | 白板房间 ID
`whiteboard_token` | `string`     | 白板房间 token
`created_at`       | `Timestamp`  | 创建时间
`updated_at`       | `Timestamp`  | 更新时间
`deleted_at`       | `Timestamp`  | 删除时间
`attendees`        | `[]Attendee` | 参会人员

#### Attendee Model
名称 | 类型 | 描述
-----|-----|-----
`user_id` | `uint` | 用户 ID
`room_id` | `uint` | 房间 ID
