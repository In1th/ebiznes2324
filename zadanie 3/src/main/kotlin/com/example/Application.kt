package com.example

import dev.kord.common.entity.Snowflake
import dev.kord.core.Kord
import dev.kord.core.event.message.MessageCreateEvent
import dev.kord.core.on
import dev.kord.gateway.Intent
import dev.kord.gateway.PrivilegedIntent
import dev.kord.common.Color
import dev.kord.rest.builder.message.create.embed
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

@Serializable
data class Product(val name: String, val category: String, val price: Int)

suspend fun main() {
    val kord = Kord(System.getenv("TOKEN"))
    val channelId = Snowflake(System.getenv("CHAT_ID"))

    val categories = listOf("food", "book", "car", "music")

    val products = categories.mapIndexed {
        idx, value -> Product("example $value", value, 1_000 * idx)
    }

    kord.on<MessageCreateEvent> {
        if (message.author?.isBot != false) return@on
        if (!message.content.startsWith('!')) return@on

        val args = message.content.substringAfter('!').split(' ')
        val (command, category) = args

        if (command == "categories") {
            message.channel.createMessage(Json.encodeToString(categories))
        }

        if (categories.contains(category)) {
            message.channel.createMessage(Json.encodeToString(products.filter { it.category == category }))
        } else {
            message.channel.createMessage("Category not found")
        }


        println("Msg: ${message.author?.tag}: ${message.content}")

        message.channel.createMessage("Wysłano")
    }

    embeddedServer(Netty, port = 8080) {
        messageSenderModule(kord, channelId)
    }.start(wait = true)

    kord.login {
        @OptIn(PrivilegedIntent::class)
        intents += Intent.MessageContent
    }
}

fun Application.messageSenderModule(kord: Kord, channelId: Snowflake) {
    routing {
        post("/send") {
            val msg = call.receive<String>()
            kord.rest.channel.createMessage(channelId) {

                embed {
                    color = Color(red = 0, green = 255, blue = 0)
                    title = "New message from the bot!"
                    description = msg
                }
            }
            call.respond("Git");
        }
    }
}
