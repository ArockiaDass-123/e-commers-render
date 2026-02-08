package models

import (
	"time"
	"gorm.io/gorm"
)

type Item struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `json:"name"`
	Price     float64        `json:"price"`
	ImageURL  string         `json:"image_url"` 
	Category  string         `json:"category"`
	Status    string         `json:"status"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}
