package controllers

import (
	"app/models"
	"net/http"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type ProductController struct{}

func (w *ProductController) RouteName() string {
	return "/product"
}

func (w *ProductController) GetAll(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	var products []models.Product

	db.Find(&products)

	return c.JSON(http.StatusCreated, &products)
}

func (w *ProductController) GetById(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var product models.Product

	db.First(&product, id)

	return c.JSON(http.StatusCreated, &product)
}
func (w *ProductController) Create(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	var product models.Product

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Error")
	}

	if validationErr := validate.Struct(&product); validationErr != nil {
		return c.JSON(http.StatusBadRequest, validationErr.Error())
	}

	db.Create(&product)

	return c.JSON(http.StatusCreated, &product)
}
func (w *ProductController) Update(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)
	var validate = validator.New()

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var currentProduct models.Product
	var product models.Product

	db.First(&currentProduct, id)

	if currentProduct.ID == 0 {
		return c.JSON(http.StatusNotFound, "Product with id "+c.Param("id")+" not found")
	}

	if err := c.Bind(&product); err != nil {
		return c.JSON(http.StatusBadRequest, "Bind Error")
	}

	if validationErr := validate.Struct(&product); validationErr != nil {
		return c.JSON(http.StatusBadRequest, "Validation Error: "+validationErr.Error())
	}

	currentProduct.Price = product.Price
	currentProduct.Name = product.Name
	db.Save(&currentProduct)

	return c.JSON(http.StatusOK, &currentProduct)
}
func (w *ProductController) Delete(c echo.Context) error {
	db := c.Get("db").(*gorm.DB)

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		return c.JSON(http.StatusBadRequest, "Wrong Id")
	}

	var product models.Product
	db.First(&product, id)

	if product.ID == 0 {
		return c.JSON(http.StatusNotFound, "Product with id "+c.Param("id")+" not found")
	}

	db.Delete(&models.Product{}, id)

	return c.NoContent(http.StatusOK)
}
