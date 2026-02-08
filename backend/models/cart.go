package models

import (
	"time"
	"gorm.io/gorm"
)

type Cart struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id"`
	Status    string         `json:"status"` // "active", "completed"
	Items     []CartItem     `gorm:"foreignKey:CartID" json:"items"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type CartItem struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CartID    uint           `json:"cart_id"`
	ItemID    uint           `json:"item_id"`
	Item      Item           `gorm:"foreignKey:ItemID" json:"item"`
	CreatedAt time.Time      `json:"created_at"`
}
