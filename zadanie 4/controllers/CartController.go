package controllers

import (
	"app/models"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type CartController struct{}

func (w *CartController) RouteName() string {
	return "/cart"
}

func (w *CartController) GetAll(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	var carts []models.Cart

	db.Find(&carts)

	return c.JSON(http.StatusCreated, &carts)
}

func (w *CartController) GetById(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var cart models.Cart

	db.First(&cart, id)

	return c.JSON(http.StatusCreated, &cart)
}
func (w *CartController) Create(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	var cart models.Cart

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&cart); validationErr != nil {
		return c.JSON(http.StatusBadRequest, validationErr.Error())
	}

	db.Create(&cart)

	return c.JSON(http.StatusCreated, &cart)
}
func (w *CartController) Update(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var currentCart models.Cart
	var cart models.Cart

	db.First(&currentCart, id)

	if currentCart.ID == 0 {
		return c.JSON(http.StatusNotFound, "Cart with id "+c.Param("id")+" not found")
	}

	if err := c.Bind(&cart); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&cart); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	currentCart.Quantity = cart.Quantity
	currentCart.Description = cart.Description
	db.Save(&currentCart)

	return c.JSON(http.StatusOK, &currentCart)
}
func (w *CartController) Delete(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var cart models.Cart
	db.First(&cart, id)

	if cart.ID == 0 {
		return c.JSON(http.StatusNotFound, "Cart with id "+c.Param("id")+" not found")
	}

	db.Delete(&models.Cart{}, id)

	return c.NoContent(http.StatusOK)
}
