import React, { useReducer, useEffect, useCallback, useRef, useMemo } from 'react'

// import css from '../styles.module.css'
import css from "@styles/styles.module.css";




export function WhatsappSVG() {
    return (
      <svg focusable='false' viewBox='0 0 24 24' width='55' height='55'>
        <path d='M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z' />
      </svg>
    )
  }
  
  export function CheckSVG() {
    return (
      <svg viewBox='0 0 16 15' width='16' height='15'>
        <path
          fill='currentColor'
          d='M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z'
        />
      </svg>
    )
  }
  export function CloseSVG() {
    return (
      <svg focusable='false' viewBox='0 0 24 24' width='24' height='24'>
        <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
      </svg>
    )
  }
  export function SendSVG() {
    return (
      <svg focusable='false' viewBox='0 0 24 24' width='35' height='35'>
        <path d='M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' />
      </svg>
    )
  }

interface FloatingWhatsAppProps {
  phoneNumber: string
  accountName: string
  height?: number
  avatar?: string
  statusMessage?: string
  chatMessage?: string
  darkMode?: boolean
  allowClickAway?: boolean
  allowEsc?: boolean
  styles?: React.CSSProperties
  className?: string
  placeholder?: string
  notification?: boolean
  notificationDelay?: number
  notificationSound?: boolean
}

type State = {
  isOpen: boolean
  isDelay: boolean
  isNotification: boolean
  message: string
}

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'delay' }
  | { type: 'notification' }
  | { type: 'message'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
        isNotification: false
      }
    case 'close':
      return {
        ...state,
        isOpen: false
      }

    case 'delay':
      return {
        ...state,
        isDelay: false
      }
    case 'notification':
      return {
        ...state,
        isNotification: true
      }
    case 'message':
      return {
        ...state,
        message: action.payload
      }
    default:
      return state
  }
}

const isArabic = (string: string) => /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(string)

export default function FloatingWhatsApp({
  phoneNumber = '1234567890',
  accountName = 'Account Name',
  height = 320,
  avatar = "https://cdn-icons-png.flaticon.com/512/174/174879.png",
  statusMessage = 'Kami akan segera membalas',
  chatMessage = 'Hallo! 🤝 \nAda yang bisa kami bantu?',
  darkMode = false,
  allowClickAway = false,
  allowEsc = false,
  styles = {},
  className = 'custom-class',
  placeholder = 'Ketik..',
  notification = false,
  notificationDelay = 180000, // 3 minutes
  notificationSound = false
}: FloatingWhatsAppProps) {
  const [{ isOpen, isDelay, isNotification, message }, dispatch] = useReducer(reducer, {
    isOpen: false,
    isDelay: true,
    isNotification: false,
    message: ''
  })

  if (notificationDelay < 30000) throw new Error('notificationDelay prop value must be at least 30 seconds (30000 ms)')

  const soundRef = useRef<HTMLAudioElement | null>(null)
  const notificationInterval = useRef(0)
  const time = useMemo(() => new Date().toTimeString().split(`:`).slice(0, 2).join(`:`), [])

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (isOpen) return

    dispatch({ type: 'open' })

    setTimeout(() => dispatch({ type: 'delay' }), 2000)

    window.clearInterval(notificationInterval.current)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'message', payload: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message) return

    window.open(`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}`)
    dispatch({ type: 'message', payload: '' })
  }

  const onNotification = useCallback(() => {
    if (!notification) return

    notificationInterval.current = window.setInterval(() => {
      if (notificationSound) {
        if (soundRef.current) {
          soundRef.current.currentTime = 0
          soundRef.current.play()
        }
      }
      dispatch({ type: 'notification' })
    }, notificationDelay)
  }, [notification, notificationDelay, notificationSound])

  const onClickOutside = useCallback(() => {
    if (!allowClickAway || !isOpen) return

    dispatch({ type: 'close' })
  }, [allowClickAway, isOpen])

  const onEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (!allowEsc || !isOpen) return

      if (event.key === 'Escape') dispatch({ type: 'close' })
    },
    [allowEsc, isOpen]
  )

  useEffect(() => {
    onNotification()
  }, [onNotification])

  useEffect(() => {
    document.addEventListener('click', onClickOutside, false)

    return () => document.removeEventListener('click', onClickOutside)
  }, [onClickOutside])

  useEffect(() => {
    document.addEventListener('keydown', onEscKey, false)

    return () => document.removeEventListener('keydown', onEscKey)
  }, [onEscKey])

  return (
    <div className={`${css.floatingWhatsapp} ${darkMode ? `${css.dark} ` : ''}${className}`}>
      <div className={css.whatsappButton} onClick={(event) => handleOpen(event)} style={styles} aria-hidden='true'>
        <WhatsappSVG />
        {isNotification && <span className={css.notificationIndicator}>1</span>}
      </div>
      <div
        className={`${css.whatsappChatBox} ${isOpen ? css.open : css.close}`}
        onClick={(event) => event.stopPropagation()}
        aria-hidden='true'
        style={{ height: isOpen ? height : 0 }}
      >
        <header className={css.chatHeader}>
          <div className={css.avatar}>
            <img src={avatar} width='60' height='60' alt='whatsapp-avatar' />
          </div>
          <div className={css.status}>
            <span className={css.statusTitle}>{accountName}</span>
            <span className={css.statusSubtitle}>{statusMessage}</span>
          </div>
          <div className={css.close} onClick={() => dispatch({ type: 'close' })} aria-hidden='true'>
            <CloseSVG />
          </div>
        </header>

        <div className={css.chatBody}>
          {isDelay ? (
            <div className={css.chatBubble}>
              <div className={css.typing}>
                <div className={css.dot} />
                <div className={css.dot} />
                <div className={css.dot} />
              </div>
            </div>
          ) : (
            <div className={css.message}>
              <span className={css.triangle} />
              <span className={css.accountName}>{accountName}</span>
              <p className={css.messageBody}>{chatMessage}</p>
              <span className={css.messageTime}>
                {time}
                <span style={{ marginLeft: 5 }}>
                  <CheckSVG />
                </span>
              </span>
            </div>
          )}
        </div>

        <footer className={css.chatFooter}>
          <form onSubmit={handleSubmit}>
            <input
              className={`${css.input} ${isArabic(message) ? css.arabic : ''}`}
              placeholder={placeholder}
              onChange={handleChange}
              value={message}
              dir='auto'
            />
            <button type='submit' className={css.buttonSend} disabled={message === ''}>
              <SendSVG />
            </button>
          </form>
        </footer>
      </div>
    </div>
  )
}