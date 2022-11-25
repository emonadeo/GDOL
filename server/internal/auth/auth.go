package auth

import (
	"time"

	"github.com/emonadeo/gdol/internal/model"
	"github.com/golang-jwt/jwt"
)

const (
	secret               = "to-be-generated" // TODO: This should actually be secret. Pull from env?
	accessTokenDuration  = 15 * time.Minute
	refreshTokenDuration = 7 * 24 * time.Hour
)

func CreateToken(userId string, roles []string) model.Auth {
	return model.Auth{
		AccessToken:  createAccessToken(userId, roles),
		RefreshToken: createRefreshToken(userId),
	}
}

type accessTokenClaims struct {
	jwt.StandardClaims
	Roles []string `json:"roles"`
}

func createAccessToken(userId string, roles []string) string {
	claims := accessTokenClaims{
		Roles: roles,
		StandardClaims: jwt.StandardClaims{
			Subject:   userId,
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(accessTokenDuration).Unix(),
		},
	}
	return createTokenFromClaims(claims)
}

type refreshTokenClaims struct {
	jwt.StandardClaims
}

func createRefreshToken(userId string) string {
	claims := refreshTokenClaims{
		StandardClaims: jwt.StandardClaims{
			Subject:   userId,
			IssuedAt:  time.Now().Unix(),
			ExpiresAt: time.Now().Add(accessTokenDuration).Unix(),
		},
	}
	return createTokenFromClaims(claims)
}

func createTokenFromClaims(claims jwt.Claims) string {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	str, err := token.SignedString([]byte(secret))
	if err != nil {
		// TODO: What is this error? Handle it!
		panic(err)
	}
	return str
}
