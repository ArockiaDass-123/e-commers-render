package models

import (
	"time"
)

type Order struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `json:"user_id"`
	Items     []OrderItem    `gorm:"foreignKey:OrderID" json:"items"`
	Total     float64        `json:"total"`
	CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
}

type OrderItem struct {
    ID      uint `gorm:"primaryKey" json:"id"`
    OrderID uint `json:"order_id"`
    ItemID  uint `json:"item_id"`
    Item    Item `gorm:"foreignKey:ItemID" json:"item"`
    Price   float64 `json:"price"`
}
