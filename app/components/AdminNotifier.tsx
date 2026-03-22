'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { checkNewTickets } from '../admin/admin-actions'

export default function AdminNotifier({ initialTicketCount }: { initialTicketCount: number }) {
  const [ticketCount, setTicketCount] = useState(initialTicketCount)
  const router = useRouter()

  useEffect(() => {
    // This silently checks the database every 5 seconds
    const interval = setInterval(async () => {
      const newCount = await checkNewTickets(ticketCount)
      
      if (newCount !== false && newCount > ticketCount) {
        setTicketCount(newCount)
        
        // Play the Service Bell sound!
        const bellSound = new Audio('https://cdn.pixabay.com/download/audio/2021/08/04/audio_c6ccf3232f.mp3?filename=bell-ringing-05.mp3')
        bellSound.volume = 0.7
        bellSound.play().catch(() => {})

        toast.success('🔔 New Reward Claimed at the Counter!', {
          duration: 6000,
          style: { background: '#A47E65', color: '#fff', fontSize: '18px', fontWeight: 'bold' }
        })

        // This instantly refreshes the Admin history log on the screen without reloading the whole page!
        router.refresh()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [ticketCount, router])

  return null // This component is completely invisible!
}