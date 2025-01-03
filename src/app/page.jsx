'use client'
import styles from './page.module.css'
import { BotChatId, TelegramRequest } from '@/requests/RequestFunction'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import chief from '@/assets/images/babinovWatchYou.png'

export default function Home() {
  const { formRequest } = TelegramRequest()
  const [message, setMessage] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [chatId, setChatId] = useState(null) // Состояние для хранения chatId

  // Получаем хуки состояния из BotChatId
  const { chatId: storedChatId, getChatId } = BotChatId()

  // Загружаем chatId при монтировании компонента
  useEffect(() => {
    const fetchChatId = async () => {
      // берём сохранённое ID чата заказчика с ботом из localStorage
      const savedChatId = localStorage.getItem('chatId')
      if (savedChatId) {
        // Получаем обновления с помощью getChatId
        setChatId(savedChatId)
        console.log('ID чата загружен из локального хранилища:', savedChatId)
      } else {
        await getChatId()
        if (getChatId) {
          // Обновление состояние chatId
          setChatId(storedChatId)
          console.log('ID чата загружен:', storedChatId)
        } else {
          console.error('Не удалось загрузить ID чата')
        }
      }
    }
    // запускаем ф-цию отправкии данных с формы
    fetchChatId()
  }, [getChatId, storedChatId])

  // Обработчик отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Проверка заполнения формы и наличия chatId
    if (!message || !phone || !date || !chatId) {
      console.error('Все поля должны быть заполнены')
      return
    }

    // Отправка данных в Telegram той самой ф-цией formRequest
    await formRequest(message, phone, date, chatId)
  }

  return (
    <section className={styles.formSection}>
      <form className={styles.telegramForm} onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Отправляй поздравление, огузок!'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type='tel'
          placeholder='Введите своё ID чтоб тебя потом спец-службы вычислили'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button className={styles.sendBtn}>Отправить поздравление</button>
      </form>
      <Image
        width={300}
        height={300}
        alt='Chief'
        src={chief}
        priority
        className={styles.chief}
      />
    </section>
  )
}
