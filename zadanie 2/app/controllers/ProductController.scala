package controllers

import javax.inject._
import play.api.mvc._
import models.{Product, ProductDto}
import play.api.libs.json.{Json, OFormat}

import scala.collection.mutable.ListBuffer

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val products = ListBuffer[Product]()

  products += new Product(1, "banana", 1, 50, 2.22f)
  products += new Product(2, "apple", 1, 2, 5.99f)

  implicit val productFormat: OFormat[Product] = Json.format[Product]
  implicit val productDtoFormat: OFormat[ProductDto] = Json.format[ProductDto]

  def add(): Action[AnyContent] = Action { implicit request =>
    val jsonBody = request.body.asJson
    val newProducts = jsonBody.flatMap(
      Json.fromJson[ProductDto](_).asOpt
    )

    newProducts match {
      case Some(productDto) =>
        var nextId: Long = 1
        if (products.nonEmpty) {
          nextId = products.map(_.id).max + 1
        }
        val newProduct = Product(nextId, productDto.name, productDto.quantity, productDto.quantity, productDto.price)
        products += newProduct
        Created(Json.toJson(newProduct))
      case None =>
        BadRequest
    }
  }

  def showById(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundProduct = products.find(_.id == id)
    foundProduct match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound
    }
  }

  def showAll(): Action[AnyContent] = Action { implicit request =>
    if (products.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(products))
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundProduct = products.find(_.id == id)
    foundProduct match {
      case Some(product) =>
        val jsonBody = request.body.asJson
        val productJson: Option[ProductDto] = jsonBody.flatMap(
          Json.fromJson[ProductDto](_).asOpt
        )

        productJson match {
          case Some(productDto) =>
            products -= product
            val newProduct = Product(id, productDto.name, productDto.quantity, productDto.quantity, productDto.price)
            products += newProduct
            Ok(Json.toJson(newProduct))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action { implicit request =>
    val product = products.find(_.id == id)
    product match {
      case Some(product) =>
        products -= product
        Ok
      case None => NotFound
    }
  }
}
