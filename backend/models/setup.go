package models

import (
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	// Connect to SQLite database
	database, err := gorm.Open(sqlite.Open("shopping_cart.db"), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	// AutoMigrate
	err = database.AutoMigrate(&User{}, &Item{}, &Cart{}, &CartItem{}, &Order{}, &OrderItem{})
	if err != nil {
		panic("Failed to migrate database!")
	}

	DB = database
}
