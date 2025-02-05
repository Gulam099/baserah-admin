"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Notification, TickCircle, CloseCircle } from "iconsax-react"

interface NotificationItem {
  id: string
  title: string
  description: string
  isRead: boolean
}

export default function NotificationButton() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "The new Specialist joining Request",
      description: "with order id 56464564",
      isRead: false,
    },
    {
      id: "2",
      title: "New message from support",
      description: "Regarding your recent inquiry",
      isRead: false,
    },
    {
      id: "3",
      title: "The new Specialist joining Request",
      description: "with order id 56464564",
      isRead: false,
    },
    {
      id: "4",
      title: "New message from support",
      description: "Regarding your recent inquiry",
      isRead: false,
    },
    {
      id: "5",
      title: "The new Specialist joining Request",
      description: "with order id 56464564",
      isRead: false,
    },
    {
      id: "6",
      title: "New message from support",
      description: "Regarding your recent inquiry",
      isRead: false,
    },
  ])

  const unreadNotifications = notifications.filter((item) => !item.isRead)

  const markAsRead = useCallback((id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button  className="relative rounded-full aspect-square">
          <Notification size="36" color="#fff"  />
          {unreadNotifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {unreadNotifications.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-100 min-w-100" >
        <div className="flex flex-col gap-4">
          {unreadNotifications.length === 0 ? (
            <p className="text-center text-gray-500">No new notifications</p>
          ) : (
            unreadNotifications.map((item) => (
              <div key={item.id} className="flex flex-row gap-2 items-start">
                <TickCircle size="42" color="#fff" className="bg-primary p-3 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-1 flex-grow">
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
                <Button className="aspect-square rounded-full p-1" variant="ghost" onClick={() => markAsRead(item.id)}>
                  <CloseCircle size="24" color="#000" />
                </Button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

