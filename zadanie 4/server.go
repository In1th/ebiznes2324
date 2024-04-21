package main

import (
	"app/controllers"
	"app/database"
	"app/routes"

	"github.com/labstack/echo/v4"
)

func main() {
	e := echo.New()

	db := database.Connect()

	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("db", db)
			return next(c)
		}
	})

	routes.SetupCruds(e,
		&controllers.ProductController{},
		&controllers.CartController{},
	)
	e.Logger.Fatal(e.Start(":1323"))
}
