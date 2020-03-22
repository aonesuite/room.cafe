package agora

// Role Type
type Role uint16

// Role consts
const (
	RoleAttendee   = 0
	RolePublisher  = 1
	RoleSubscriber = 2
	RoleAdmin      = 101
)

// GenRTCJoinChannelToken 生成加入房间的 token
func GenRTCJoinChannelToken(appID, appCertificate, channelName, user string, expireAt int64) (token string, err error) {
	tk := CreateAccessToken2(appID, appCertificate, channelName, user)
	tk.AddPrivilege(KJoinChannel, uint32(expireAt))
	return tk.Build()
}

// GenRTMJoinChannelToken 生成加入RTM 房间
func GenRTMJoinChannelToken(appID, appCertificate, user string, expireAt int64) (string, error) {
	tk := CreateAccessToken2(appID, appCertificate, user, "")
	tk.AddPrivilege(KLoginRtm, uint32(expireAt))
	return tk.Build()
}
