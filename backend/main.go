package main

import (
	"shopping-cart-backend/middleware"
	"shopping-cart-backend/models"
	"shopping-cart-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	models.ConnectDatabase()
	SeedItems()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://127.0.0.1:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.POST("/users", routes.Register)
	r.GET("/users", routes.GetUsers)
	r.POST("/users/login", routes.Login)
	r.POST("/items", routes.CreateItem) // Public for now
	r.GET("/items", routes.GetItems)    // Public for home page

	authorized := r.Group("/")
	authorized.Use(middleware.AuthMiddleware())
	{
		authorized.POST("/users/logout", routes.Logout)
		authorized.POST("/carts", routes.AddToCart)
		authorized.GET("/carts", routes.GetCart)
		authorized.POST("/orders", routes.CreateOrder)
		authorized.GET("/orders", routes.GetOrders)
	}

	r.Run(":8080")
}

func SeedItems() {
	// Clear existing items to ensure precise list
	models.DB.Exec("DELETE FROM items")

	items := []models.Item{
		// Electronics / Accessories
		{Name: "Wireless Mouse", Price: 29.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60"},
		{Name: "Mechanical Keyboard", Price: 129.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60"},
		{Name: "USB-C Charger", Price: 19.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60"},
		{Name: "Bluetooth Headphones", Price: 89.99, Category: "Audio", ImageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"},
		{Name: "Laptop Stand", Price: 49.99, Category: "Office", ImageURL: "https://images.unsplash.com/photo-1616410011236-7a421b19a527?w=500&auto=format&fit=crop&q=60"},

		{Name: "Smartphone Tripod", Price: 34.99, Category: "Photography", ImageURL: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=500&auto=format&fit=crop&q=60"},
		{Name: "Webcam HD 1080p", Price: 59.99, Category: "Electronics", ImageURL: "https://images.unsplash.com/photo-1587825140708-f6739bc714f2?w=500&auto=format&fit=crop&q=60"},
		{Name: "External Hard Drive 1TB", Price: 79.99, Category: "Storage", ImageURL: "https://images.unsplash.com/photo-1531492257125-9fae2f4e0464?w=500&auto=format&fit=crop&q=60"},
		{Name: "Portable SSD 512GB", Price: 99.99, Category: "Storage", ImageURL: "https://images.unsplash.com/photo-1597872252165-0a3754633c72?w=500&auto=format&fit=crop&q=60"},
		{Name: "Wireless Earbuds", Price: 149.99, Category: "Audio", ImageURL: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60"},

		{Name: "Smart Watch", Price: 199.99, Category: "Wearables", ImageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"},
		{Name: "Fitness Tracker Band", Price: 49.99, Category: "Wearables", ImageURL: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=500&auto=format&fit=crop&q=60"},
		{Name: "Gaming Mouse Pad", Price: 24.99, Category: "Gaming", ImageURL: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=500&auto=format&fit=crop&q=60"},
		{Name: "Noise Cancelling Headphones", Price: 249.99, Category: "Audio", ImageURL: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=60"},
		{Name: "Bluetooth Speaker", Price: 59.99, Category: "Audio", ImageURL: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60"},

		{Name: "Laptop Backpack", Price: 69.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60"},
		{Name: "Phone Fast Charging Cable", Price: 14.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1625946802830-471242335ac0?w=500&auto=format&fit=crop&q=60"},
		{Name: "USB Hub 4-Port", Price: 29.99, Category: "Electronics", ImageURL: "https://images.unsplash.com/photo-1622675276364-7c5952d7e57c?w=500&auto=format&fit=crop&q=60"},
		{Name: "Desk LED Lamp", Price: 39.99, Category: "Home", ImageURL: "https://images.unsplash.com/photo-1534067783845-84af8959f632?w=500&auto=format&fit=crop&q=60"},
		{Name: "Power Bank 20000mAh", Price: 54.99, Category: "Accessories", ImageURL: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=60"},
	}

	for _, item := range items {
		item.Status = "active"
		models.DB.Create(&item)
	}
}
