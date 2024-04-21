package models

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	Quantity    int    `json:"quantity" validate:"required"`
	Description string `json:"description" validate:"required"`
}
