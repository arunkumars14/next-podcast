"use client";
import PodcastCard from '@/components/PodcastCard'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AuthorListner from '@/components/AuthorListner';
import { useUser } from '@clerk/nextjs';
import LoaderSpinner from '@/components/LoaderSpinner';

const Home = () => {

  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcast)

  const mostistenersForAuthor = useQuery(api.podcasts.mostListenersForAuthor)

  if(!trendingPodcasts || !mostistenersForAuthor) return <LoaderSpinner />

  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {
            trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard key={_id} imgUrl={imageUrl!} title={podcastTitle} description={podcastDescription} podcastId={_id} />
            ))
          }
        </div>

        <h1 className="text-20 font-bold text-white-1">Top Authors</h1>

        <div className="podcast_grid">
          {
            mostistenersForAuthor?.map(({ imageUrl, name, totalPodcasts, totalListeners, clerkId }) => (
              <AuthorListner key={clerkId} imageUrl={imageUrl} name={name} totalPodcasts={totalPodcasts} totalListeners={totalListeners} clerkId={clerkId} />
            ))
          }
        </div>

      </section>
    </div>
  )
}

export default Home