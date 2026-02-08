package routes

import (
	"fmt"
	"net/http"
	"shopping-cart-backend/models"

	"github.com/gin-gonic/gin"
)

type CreateOrderInput struct {
	CartID uint `json:"cart_id" binding:"required"`
}

func CreateOrder(c *gin.Context) {
	val, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := val.(uint)

	if c.Request.ContentLength == 0 {
		fmt.Println("DEBUG: Request body is empty (Content-Length is 0)")
	}

	var input CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Printf("DEBUG: Bind error: %v (Content-Length: %d)\n", err, c.Request.ContentLength)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("DEBUG: Received order request for cart_id: %d\n", input.CartID)

	// Get specific cart
	var cart models.Cart
	if err := models.DB.Preload("Items.Item").Where("id = ? AND user_id = ? AND status = ?", input.CartID, userID, "active").First(&cart).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or inactive cart id"})
		return
	}

	if len(cart.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Cart is empty"})
		return
	}

	// Create Order
	order := models.Order{UserID: userID}
	var total float64
	var orderItems []models.OrderItem

	for _, ci := range cart.Items {
		total += ci.Item.Price
		orderItems = append(orderItems, models.OrderItem{
			ItemID: ci.ItemID,
			Price:  ci.Item.Price, // Snapshot price
		})
	}
	order.Total = total
	order.Items = orderItems

	// Transaction
	tx := models.DB.Begin()
	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	// Save items manually if needed, but GORM associations should handle it if set up right.
	// Actually for 'order.Items', GORM should save them.
	// But let's be safe - we might need to assign OrderID if association doesn't auto-set.
	// GORM 'Create' with nested struct usually works.

	// Update Cart Status
	if err := tx.Model(&cart).Update("status", "completed").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update cart"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"data": order})
}

func GetOrders(c *gin.Context) {
	val, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := val.(uint)

	var orders []models.Order
	models.DB.Where("user_id = ?", userID).Find(&orders)
	c.JSON(http.StatusOK, gin.H{"data": orders})
}
