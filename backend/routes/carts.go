package routes

import (
	"net/http"
	"shopping-cart-backend/models"

	"github.com/gin-gonic/gin"
)

type AddItemInput struct {
	ItemID uint `json:"item_id" binding:"required"`
}

func AddToCart(c *gin.Context) {
	// userID is set by AuthMiddleware, but it's uint. c.Get returns interface{}
	val, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := val.(uint)

	var input AddItemInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find active cart
	var cart models.Cart
	if err := models.DB.Where("user_id = ? AND status = ?", userID, "active").First(&cart).Error; err != nil {
		// Create new cart
		cart = models.Cart{UserID: userID, Status: "active"}
		if err := models.DB.Create(&cart).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create cart"})
			return
		}
	}

	// Add item
	cartItem := models.CartItem{CartID: cart.ID, ItemID: input.ItemID}
	if err := models.DB.Create(&cartItem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart})
}

func GetCart(c *gin.Context) {
	val, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := val.(uint)

	var cart models.Cart
	if err := models.DB.Preload("Items.Item").Where("user_id = ? AND status = ?", userID, "active").First(&cart).Error; err != nil {
		// Return empty indication or handled on frontend
		c.JSON(http.StatusOK, gin.H{"data": nil})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": cart})
}
