package agora

import "fmt"

// Role Type
type Role uint16

// Role consts
const (
	RoleAttendee   = 0
	RolePublisher  = 1
	RoleSubscriber = 2
	RoleAdmin      = 101
	RoleRtmUser    = 1
)

//RtcTokenBuilder class
type RtcTokenBuilder struct {
}

//BuildRTCTokenWithUserAccount method
// appID: The App ID issued to you by Agora. Apply for a new App ID from
//        Agora Dashboard if it is missing from your kit. See Get an App ID.
// appCertificate:	Certificate of the application that you registered in
//                  the Agora Dashboard. See Get an App Certificate.
// channelName:Unique channel name for the AgoraRTC session in the string format
// uid: User ID. A 32-bit unsigned integer with a value ranging from
//      1 to (232-1). optionalUid must be unique.
// role: Role_Publisher = 1: A broadcaster (host) in a live-broadcast profile.
//       Role_Subscriber = 2: (Default) A audience in a live-broadcast profile.
// privilegeExpireTs: represented by the number of seconds elapsed since
//                    1/1/1970. If, for example, you want to access the
//                    Agora Service within 10 minutes after the token is
//                    generated, set expireTimestamp as the current
//                    timestamp + 600 (seconds)./
func BuildRTCTokenWithUserAccount(appID string, appCertificate string, channelName string, userAccount string, role Role, privilegeExpiredTs uint32) (string, error) {
	token := CreateAccessToken2(appID, appCertificate, channelName, userAccount)
	token.AddPrivilege(KJoinChannel, privilegeExpiredTs)

	if (role == RoleAttendee) || (role == RolePublisher) || (role == RoleAdmin) {
		token.AddPrivilege(KPublishVideoStream, privilegeExpiredTs)
		token.AddPrivilege(KPublishAudioStream, privilegeExpiredTs)
		token.AddPrivilege(KPublishDataStream, privilegeExpiredTs)
	}
	return token.Build()
}

// BuildRTCTokenWithUID method
// appID: The App ID issued to you by Agora. Apply for a new App ID from
//        Agora Dashboard if it is missing from your kit. See Get an App ID.
// appCertificate:	Certificate of the application that you registered in
//                  the Agora Dashboard. See Get an App Certificate.
// channelName:Unique channel name for the AgoraRTC session in the string format
// userAccount: The user account.
// role: Role_Publisher = 1: A broadcaster (host) in a live-broadcast profile.
//       Role_Subscriber = 2: (Default) A audience in a live-broadcast profile.
// privilegeExpireTs: represented by the number of seconds elapsed since
//                    1/1/1970. If, for example, you want to access the
//                    Agora Service within 10 minutes after the token is
//                    generated, set expireTimestamp as the current
func BuildRTCTokenWithUID(appID string, appCertificate string, channelName string, uid uint32, role Role, privilegeExpiredTs uint32) (string, error) {
	uidStr := fmt.Sprint(uid)
	if uid == 0 {
		uidStr = ""
	}
	return BuildRTCTokenWithUserAccount(appID, appCertificate, channelName, uidStr, role, privilegeExpiredTs)
}
