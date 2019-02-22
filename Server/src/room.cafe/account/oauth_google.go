package account

import (
	"context"
	"fmt"

	"components/log"
	"components/rpc"

	"room.cafe/models"

	"golang.org/x/oauth2"
)

// GoogleOAuth github oauth info
type GoogleOAuth struct {
	provider string
	config   oauth2.Config
}

// GoogleUserInfo github user info
type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Link          string `json:"link"`
	Picture       string `json:"picture"`
	Gender        string `json:"gender"`
	Locale        string `json:"locale"`
}

var _ OAuther = new(GoogleOAuth)

// AuthURL implement oauther's method
func (googleOAuth *GoogleOAuth) AuthURL(state string) string {
	return googleOAuth.config.AuthCodeURL(state)
}

// AuthToken implement oauther's method
func (googleOAuth *GoogleOAuth) AuthToken(ctx context.Context, state, code string) (token *oauth2.Token, err error) {
	// TODO need to check state
	token, err = googleOAuth.config.Exchange(ctx, code)
	return
}

// AuthUserInfo implement oauther's method
func (googleOAuth *GoogleOAuth) AuthUserInfo(xl *log.Logger, token *oauth2.Token) (user models.User, err error) {
	googleUser := GoogleUserInfo{}

	err = rpc.DefaultClient.GetCall(xl, &googleUser, fmt.Sprintf("https://www.googleapis.com/oauth2/v2/userinfo?access_token=%s", token.AccessToken))
	if err != nil {
		return
	}

	user = models.User{
		Name:  googleUser.Name,
		Email: googleUser.Email,
	}

	return
}
