package database

import (
	"app/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Connect() *gorm.DB {
	db, err := gorm.Open(sqlite.Open("database.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect with database")
	}

	db.AutoMigrate(&models.Product{})
	db.AutoMigrate(&models.Cart{})

	return db
}
