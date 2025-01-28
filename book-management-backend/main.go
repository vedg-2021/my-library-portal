package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error

// Book model (representing the Book table in the database)
type Book struct {
	ID                  uint      `json:"id"`
	Title               string    `json:"title"`
	Author              string    `json:"author"`
	PublicationDate     string    `json:"publication_date"`
	Genre               string    `json:"genre"`
	Availability_Status bool      `json:"availability_status" gorm:"column:availability_status"`
	CreatedAt           time.Time `json:"created_at" gorm:"column:created_at;default:CURRENT_TIMESTAMP;type:datetime"`
}

// Initialize the database connection
func setupDatabase() {
	var err error
	// GORM connection setup
	dsn := "root:@tcp(localhost:3306)/library_backend_development?charset=utf8&parseTime=True&loc=Local"
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	} else {
		log.Println("Successfully connected to the database")
	}

	// Auto-migrate the Book model to ensure the table exists
	if err := db.AutoMigrate(&Book{}); err != nil {
		log.Fatalf("Error migrating database: %v", err)
	}
}

// AddBook function: Handles adding a new book
func addBook(c *gin.Context) {
	var newBook Book
	if err := c.ShouldBindJSON(&newBook); err != nil {
		log.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	if err := db.Create(&newBook).Error; err != nil {
		log.Println("Error creating book:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "New Book Added!", "book": newBook})

}

func main() {
	setupDatabase()
	router := gin.Default()

	// CORS configuration to allow requests from React (port 3001)
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3001"}, // React app's URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		ExposeHeaders:    []string{"Content-Length", "Authorization"}, // Optional, to expose certain headers
	}))

	// Routes
	router.POST("/add_book", addBook)
	// Start the server
	router.Run(":3002")
}
