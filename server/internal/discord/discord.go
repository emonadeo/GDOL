package discord

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

// TODO
const (
	apiEndpoint = "https://discord.com/api/v10"
	// TODO: Redirect URI
	redirectUri = "http://localhost:5173/auth"
)

func GetIdFromCode(code string, clientId string, clientSecret string) (string, error) {
	accessToken, err := exchangeAccessToken(code, clientId, clientSecret)
	if err != nil {
		return "", err
	}
	userId, err := exchangeUserId(accessToken)
	if err != nil {
		return "", err
	}
	return userId, nil
}

type accessTokenResponse struct {
	AccessToken  string `json:"access_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int    `json:"expires_in"`
	RefreshToken string `json:"refresh_token"`
	Scope        string `json:"scope"`
}

type getCurrentUserResponse struct {
	Id            string `json:"id"`
	Username      string `json:"username"`
	Discriminator string `json:"discriminator"`
	// ...
}

func exchangeAccessToken(code string, clientId string, clientSecret string) (string, error) {
	form := url.Values{
		"client_id":     []string{clientId},
		"client_secret": []string{clientSecret},
		"grant_type":    []string{"authorization_code"},
		"code":          []string{code},
		"redirect_uri":  []string{redirectUri},
	}

	body := strings.NewReader(form.Encode())

	url := fmt.Sprintf("%s/oauth2/token", apiEndpoint)
	res, err := http.Post(url, "application/x-www-form-urlencoded", body)
	if err != nil {
		return "", err
	}
	println(form.Encode())
	if res.StatusCode != http.StatusOK {
		// TODO: Might not always be a bad request (but most likely is a faulty code)
		return "", fmt.Errorf("invalid code")
	}
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	dcRes := new(accessTokenResponse)
	err = json.Unmarshal(resBody, dcRes)
	if err != nil {
		return "", err
	}

	return dcRes.AccessToken, nil
}

func exchangeUserId(token string) (string, error) {
	url := fmt.Sprintf("%s/users/@me", apiEndpoint)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}
	defer res.Body.Close()
	userRes := new(getCurrentUserResponse)
	err = json.Unmarshal(resBody, userRes)
	if err != nil {
		return "", err
	}

	return userRes.Id, nil
}
