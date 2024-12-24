"use client"
import { AuhtorListenerProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const AuthorListner = ({imageUrl, name, totalPodcasts, totalListeners, clerkId}: AuhtorListenerProps) => {
    const router = useRouter()

    const toAuthorProfile = () => {
        router.push(`/profile/${clerkId}`)
    }
  return (
    <div className='cursor-pointer' onClick={toAuthorProfile}>
        <figure className='flex flex-col gap-2'>
            <Image src={imageUrl} width={174} height={174} alt={name} className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]'/>
            <div className="flex flex-col">
                <h1 className="text-16 truncate font-bold text-white-1">{name}</h1>
                <h2 className="text-12 truncate font-normal capitalize text-white-4">{totalListeners} listeners from {totalPodcasts} podcasts</h2>
            </div>
        </figure>
    </div>
  )
}

export default AuthorListner