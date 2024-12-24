"use client"
import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import ProfileCard from '@/components/ProfileCard'
import { api } from '@/convex/_generated/api'
import { PodcastProps } from '@/types'
import { useQuery } from 'convex/react'
import React from 'react'

const Profile = ({ params }: { params: { profileId: string } }) => {
  const user = useQuery(api.users.getUserById, {
    clerkId: params.profileId
  })

  const podcastsData: any = useQuery(api.podcasts.getPodcastByAuthord, {
    authorId: params.profileId
  })

  if (!user || !podcastsData) return <LoaderSpinner />;

  return (
    <section className="mt-9 flex flex-col">
      <h1 className="text-20 font-bold text-white-1 max-md:text-center">
        Podcaster Profile
      </h1>

      <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
        <ProfileCard
          podcastData={podcastsData!}
          imageUrl={user?.imageUrl!}
          userFirstName={user?.name!}
        />
      </div>

      <section className="mt-9 flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">
          All podcasts
        </h1>
        {podcastsData && podcastsData.podcasts.length > 0 ? (
          <div className="podcast_grid">
            {podcastsData?.podcasts?.map((podcast: PodcastProps) => (
              <PodcastCard
                key={podcast._id}
                imgUrl={podcast.imageUrl!}
                title={podcast.podcastTitle!}
                description={podcast.podcastDescription}
                podcastId={podcast._id}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          />
        )}
      </section>
    </section>
  )
}

export default Profile