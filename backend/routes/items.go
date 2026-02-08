package routes

import (
	"net/http"

	"shopping-cart-backend/models"

	"github.com/gin-gonic/gin"
)

type CreateItemInput struct {
	Name     string  `json:"name" binding:"required"`
	Price    float64 `json:"price" binding:"required"`
	ImageURL string  `json:"image_url"`
	Category string  `json:"category"`
}

func CreateItem(c *gin.Context) {
	var input CreateItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item := models.Item{
		Name:     input.Name,
		Price:    input.Price,
		ImageURL: input.ImageURL,
		Category: input.Category,
		Status:   "active",
	}

	models.DB.Create(&item)
	c.JSON(http.StatusOK, gin.H{"data": item})
}

func GetItems(c *gin.Context) {
	var items []models.Item
	models.DB.Find(&items)
	c.JSON(http.StatusOK, gin.H{"data": items})
}
