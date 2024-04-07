package controllers

import models.{Category, CategoryDto}
import play.api.libs.json.{Json, OFormat}
import play.api.mvc._

import javax.inject._
import scala.collection.mutable.ListBuffer

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private val categories = ListBuffer[Category]()

  categories += new Category(1, "cat1", "category 1")
  categories += new Category(2, "cat2", "category 2")

  implicit val categoryFormat: OFormat[Category] = Json.format[Category]
  implicit val categoryDtoFormat: OFormat[CategoryDto] = Json.format[CategoryDto]

  def add(): Action[AnyContent] = Action { implicit request =>
    val jsonBody = request.body.asJson
    val newCategory = jsonBody.flatMap(
      Json.fromJson[CategoryDto](_).asOpt
    )

    newCategory match {
      case Some(catDto) =>
        var nextId: Long = 1
        if (categories.nonEmpty) {
          nextId = categories.map(_.id).max + 1
        }
        val newCategory = Category(nextId, catDto.name, catDto.description)
        categories += newCategory
        Created(Json.toJson(newCategory))
      case None =>
        BadRequest
    }
  }

  def showById(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCategory = categories.find(_.id == id)
    foundCategory match {
      case Some(cat) => Ok(Json.toJson(cat))
      case None => NotFound
    }
  }

  def showAll(): Action[AnyContent] = Action { implicit request =>
    if (categories.isEmpty) {
      NoContent
    }
    else {
      Ok(Json.toJson(categories))
    }
  }

  def update(id: Long): Action[AnyContent] = Action { implicit request =>
    val foundCategory = categories.find(_.id == id)
    foundCategory match {
      case Some(cat) =>
        val jsonBody = request.body.asJson
        val catJson: Option[CategoryDto] = jsonBody.flatMap(
          Json.fromJson[CategoryDto](_).asOpt
        )

        catJson match {
          case Some(catDto) =>
            categories -= cat
            val newCategory = Category(id, catDto.name, catDto.description)
            categories += newCategory
            Ok(Json.toJson(newCategory))
          case None =>
            BadRequest
        }
      case None => NotFound
    }
  }

  def delete(id: Long): Action[AnyContent] = Action { implicit request =>
    val cat = categories.find(_.id == id)
    cat match {
      case Some(cat) =>
        categories -= cat
        Ok
      case None => NotFound
    }
  }
}
