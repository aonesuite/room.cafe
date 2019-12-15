package account

import (
	"context"
	"fmt"
	"time"

	"components/log"
	"components/rpc"

	"room.cafe/models"

	"golang.org/x/oauth2"
)

// GithubOAuth github oauth info
type GithubOAuth struct {
	provider string
	config   oauth2.Config
}

// GithubUserInfo github user info
type GithubUserInfo struct {
	Login             string      `json:"login"`
	ID                int         `json:"id"`
	NodeID            string      `json:"node_id"`
	AvatarURL         string      `json:"avatar_url"`
	GravatarID        string      `json:"gravatar_id"`
	URL               string      `json:"url"`
	HTMLURL           string      `json:"html_url"`
	FollowersURL      string      `json:"followers_url"`
	FollowingURL      string      `json:"following_url"`
	GistsURL          string      `json:"gists_url"`
	StarredURL        string      `json:"starred_url"`
	SubscriptionsURL  string      `json:"subscriptions_url"`
	OrganizationsURL  string      `json:"organizations_url"`
	ReposURL          string      `json:"repos_url"`
	EventsURL         string      `json:"events_url"`
	ReceivedEventsURL string      `json:"received_events_url"`
	Type              string      `json:"type"`
	SiteAdmin         bool        `json:"site_admin"`
	Name              string      `json:"name"`
	Company           interface{} `json:"company"`
	Blog              string      `json:"blog"`
	Location          interface{} `json:"location"`
	Email             string      `json:"email"`
	Hireable          bool        `json:"hireable"`
	Bio               string      `json:"bio"`
	PublicRepos       int         `json:"public_repos"`
	PublicGists       int         `json:"public_gists"`
	Followers         int         `json:"followers"`
	Following         int         `json:"following"`
	CreatedAt         time.Time   `json:"created_at"`
	UpdatedAt         time.Time   `json:"updated_at"`
}

var _ OAuther = new(GithubOAuth)

// AuthURL implement oauther's method
func (gitOAuth *GithubOAuth) AuthURL(state string) string {
	return gitOAuth.config.AuthCodeURL(state)
}

// AuthToken implement oauther's method
func (gitOAuth *GithubOAuth) AuthToken(ctx context.Context, state, code string) (token *oauth2.Token, err error) {
	// TODO need to check state

	token, err = gitOAuth.config.Exchange(ctx, code, oauth2.SetAuthURLParam("state", state),
		oauth2.SetAuthURLParam("client_id", gitOAuth.config.ClientID),
		oauth2.SetAuthURLParam("client_secret", gitOAuth.config.ClientSecret))
	return
}

// AuthUserInfo implement oauther's method
func (gitOAuth *GithubOAuth) AuthUserInfo(xl *log.Logger, token *oauth2.Token) (user models.User, err error) {
	githubUser := GithubUserInfo{}

	err = rpc.DefaultClient.GetCall(xl, &githubUser, fmt.Sprintf("https://api.github.com/user?access_token=%s", token.AccessToken))
	if err != nil {
		return
	}

	user = models.User{
		Email:  githubUser.Email,
		Name:   githubUser.Name,
		Avatar: githubUser.AvatarURL,
	}

	return
}
