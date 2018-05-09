import { Wechaty, Room } from 'wechaty'

const bot = Wechaty.instance()

bot
    .on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            const loginUrl = url.replace(/\/qrcode\//, '/l/')
            require('qrcode-terminal').generate(loginUrl)
        }
        console.log(url)
    })

    .on('login', user => {
        console.log(`${user} login`)
    })

    .on('friend', async function (contact, request) {
        if (request) {
            await request.accept()
            console.log(`Contact: ${contact.name()} send request ${request.hello}`)
        }
    })

    .on('message', async function (m) {
        const contact = m.from()
        const content = m.content()
        const room = m.room()

        if (room) {
            console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
        } else {
            console.log(`Contact: ${contact.name()} Content: ${content}`)
        }

        if (m.self()) {
            return
        }

        if (/IFE/.test(content)) {
            m.say("2018 IFE 抱团群欢迎你的加入！")
        }

        if (/IFE/.test(content)) {
            let keyroom = await Room.find({ topic: "2018IFE抱团群" })
            if (keyroom) {
                await keyroom.add(contact)
                await keyroom.say("[我是 🤖]欢迎抱团！", contact)
            }
        }

        if (/离开IFE抱团群/.test(content)) {
            let keyroom = await Room.find({ topic: "2018IFE抱团群" })
            if (keyroom) {
                await keyroom.say("退出IFE", contact)
                await keyroom.del(contact)
            }
        }
    })

    .init()
