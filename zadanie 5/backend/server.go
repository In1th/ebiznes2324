package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/go-faker/faker/v4"
)

type Product struct {
	Id          string  `faker:"uuid_digit`
	Name        string  `faker:"word"`
	Description string  `faker:"sentence"`
	Quantity    int     `faker:"boundary_start=0, boundary_end=5"`
	Price       float64 `faker"boundary_start=1.0, boundary_end=100.0"`
}

type Status struct {
	succeeded bool
}

type Order struct {
	items []Product
}

func main() {
	e := echo.New()
	e.Use(middleware.CORS())
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.GET("/products", func(c echo.Context) error {
		products := []Product{}
		fmt.Print("/products GET request\n")
		for i := 0; i < 20; i++ {
			p := Product{}
			err := faker.FakeData(&p)
			if err != nil {
				return err
			}
			products = append(products, p)
		}
		return c.JSON(http.StatusOK, products)
	})
	e.POST("/products", func(c echo.Context) error {
		fmt.Print("/products POST request\n")

		res := Status{succeeded: true}

		return c.JSON(http.StatusOK, res)
	})
	e.Logger.Fatal(e.Start(":1323"))
}
