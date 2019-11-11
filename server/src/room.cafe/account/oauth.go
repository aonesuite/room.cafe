package account

import (
	"context"
	"fmt"
	"net/http"

	"components/config"
	"components/db"
	"components/log"
	"components/utils"

	"room.cafe/models"

	"github.com/gin-gonic/gin"

	"golang.org/x/oauth2"
)

// OAuthProviderConfig oauth config info
type OAuthProviderConfig struct {
	ClientID     string   `mapstructure:"client_id"`
	ClientSecret string   `mapstructure:"client_secret"`
	AuthURL      string   `mapstructure:"auth_url"`
	TokenURL     string   `mapstructure:"token_url"`
	Scopes       []string `mapstructure:"scopes"`
}

// ToOAuthConfig convert provider config to oauth config
func (oauth OAuthProviderConfig) ToOAuthConfig(redirect string) oauth2.Config {
	endpoint := oauth2.Endpoint{
		AuthURL:  oauth.AuthURL,
		TokenURL: oauth.TokenURL,
	}

	config := oauth2.Config{
		ClientID:     oauth.ClientID,
		ClientSecret: oauth.ClientSecret,
		Scopes:       oauth.Scopes,
		Endpoint:     endpoint,
		RedirectURL:  redirect,
	}

	return config
}

// OAuther implements the following methods it's an oauther
type OAuther interface {
	AuthURL(state string) string
	AuthToken(ctx context.Context, state, code string) (*oauth2.Token, error)
	AuthUserInfo(xl *log.Logger, token *oauth2.Token) (models.User, error)
}

var providers = utils.NewSecurityMap()

func Init() {
	oauthConfigs := map[string]OAuthProviderConfig{}
	err := config.UnmarshalKey("oauth", &oauthConfigs)
	if err != nil {
		log.Error("get oauth2 config failed", err)
		return
	}

	host := config.GetString("app.host")

	for key, v := range oauthConfigs {
		switch key {
		case "github":
			conf := v.ToOAuthConfig(fmt.Sprintf("https://%s/oauth/github/callback", host))
			var githubOAuther OAuther = &GithubOAuth{key, conf}
			providers.Set(key, githubOAuther)
		case "google":
			conf := v.ToOAuthConfig(fmt.Sprintf("https://%s/oauth/google/callback", host))
			var googleOAuther OAuther = &GoogleOAuth{key, conf}
			providers.Set(key, googleOAuther)
		}
	}

}

// AuthCodeURL provider redirect Addr
func AuthCodeURL(c *gin.Context) {
	var (
		xl       = log.New(c)
		provider = c.Param("provider")
	)

	if !providers.Has(provider) {
		xl.Error("invalid provider", provider)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "unsupported provider", "code": "INVALID_ARGS"})
		return
	}

	oauth := providers.Get(provider).(OAuther)
	url := oauth.AuthURL(utils.NewRandomStr(12))
	c.JSON(http.StatusOK, gin.H{"auth_url": url})
}

func Callback(c *gin.Context) {
	var (
		xl       = log.New(c)
		state    = c.Query("state")
		code     = c.Query("code")
		provider = c.Param("provider")
	)

	if len(state) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid state", "code": "INVALID_ARGS"})
		return
	}

	if len(code) == 0 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "invalid code", "code": "INVALID_ARGS"})
		return
	}

	if !providers.Has(provider) {
		xl.Error("invalid provider", provider)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "unsupported provider", "code": "INVALID_ARGS"})
		return
	}

	oauther := providers.Get(provider).(OAuther)
	token, err := oauther.AuthToken(oauth2.NoContext, state, code)
	if err != nil {
		xl.Error("get access token failed", err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "exchange failed", "code": "INVALID_ARGS"})
		return
	}

	user, err := oauther.AuthUserInfo(xl, token)
	if err != nil {
		xl.Error("get user info failed", err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"message": "get userinfo failed", "code": "INVALID_ARGS"})
		return
	}

	tx := db.Get(xl.ReqID()).Begin()

	err = tx.FirstOrCreate(&user, "email = ?", user.Email).Error
	if err != nil {
		tx.Rollback()
		xl.Error("create userinfo failed", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": "create userinfo failed", "code": "INTERNAL_SERVER_ERROR"})
		return
	}

	createToken(xl, c, tx, user)
}
