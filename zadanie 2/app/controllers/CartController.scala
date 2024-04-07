package controllers

import models.{Cart, CartDto}
import play.api.libs.json.{Json, OFormat}
import play.api.mvc._

import javax.inject._
import scala.collection.mutable.ListBuffer

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val carts = ListBuffer[Cart]()

  carts += new Cart(1, 1, 10)
  carts += new Cart(2, 2, 2)

  implicit val productFormat: OFormat[Cart] = Json.format[Cart]
  implicit val productDtoFormat: OFormat[CartDto] = Json.format[CartDto]

  def add(): Action[AnyContent] = Action { implicit request =>
    val jsonBody = request.body.asJson
    val newCart = jsonBody.flatMap(
      Json.fromJson[CartDto](_).asOpt
    )

    newCart match {
      case Some(crtDto) =>
        var nextId: Long = 1
        if (carts.nonEmpty) {
          nextId = carts.map(_.id).max + 1
        }
        val newCart = Cart(nextId, crtDto.productId, crtDto.quantity)
        carts += newCart
        Created(Json.toJson(newCart))
      case None =>
        BadRequest
    }
  }

  def showById(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCart = carts.find(_.id == id)
    foundCart match {
      case Some(cart) => Ok(Json.toJson(cart))
      case None => NotFound
    }
  }

  def showAll(): Action[AnyContent] = Action { implicit request =>
    if (carts.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(carts))
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCart = carts.find(_.id == id)
    foundCart match {
      case Some(product) =>
        val jsonBody = request.body.asJson
        val cartJson: Option[CartDto] = jsonBody.flatMap(
          Json.fromJson[CartDto](_).asOpt
        )

        cartJson match {
          case Some(crtDto) =>
            carts -= product
            val newCart = Cart(id, crtDto.productId, crtDto.quantity)
            carts += newCart
            Ok(Json.toJson(newCart))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCart = carts.find(_.id == id)
    foundCart match {
      case Some(cart) =>
        carts -= cart
        Ok
      case None => NotFound
    }
  }
}
