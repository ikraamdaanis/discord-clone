package utils

import (
	"errors"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

var TokenExpiry = time.Now().Add(time.Second * 30)

// Function to create a new session
func CreateSession(accountID uuid.UUID) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"accountID": accountID,
		"exp":       TokenExpiry.Unix(), // Token expiration
	})

	tokenString, err := token.SignedString([]byte("your-secret-key"))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Function to validate a session
func ValidateSession(tokenString string) (uuid.UUID, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("your-secret-key"), nil
	})

	if err != nil {
		return uuid.Nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return uuid.Nil, errors.New("invalid token")
	}

	accountIDStr, ok := claims["accountID"].(string)
	if !ok {
		return uuid.Nil, errors.New("invalid token data")
	}

	accountID, err := uuid.Parse(accountIDStr)
	if err != nil {
		return uuid.Nil, err
	}

	return accountID, nil
}
