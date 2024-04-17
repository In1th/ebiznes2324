package routes

import (
	"app/controllers"

	"github.com/labstack/echo/v4"
)

func SetupCruds(e *echo.Echo, controllers ...controllers.IController) {
	for _, controller := range controllers {
		baseRoute := controller.RouteName() // e.g. /example

		// Setup routes
		e.GET(baseRoute, controller.GetAll)
		e.POST(baseRoute, controller.Create)
		e.GET(baseRoute+"/:id", controller.GetById)
		e.PUT(baseRoute+"/:id", controller.Update)
		e.DELETE(baseRoute+"/:id", controller.Delete)
	}
}
