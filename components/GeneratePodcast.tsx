import { GeneratePodcastProps } from '@/types'
import React, { useRef, useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from "uuid";
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import Image from 'next/image'

const useGeneratePodcast = ({ setAudio, voicePrompt, voiceType, setAudioStorageId }: GeneratePodcastProps) => {

  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const { startUpload } = useUploadFiles(generateUploadUrl)

  // const getPodcastAudio = useAction(api.openai.generateAudioAction)

  const getAudioUrl = useMutation(api.podcasts.getUrl)

  const generatePodcast = async () => {
    setIsGenerating(true);
    setAudio("")

    if (!voicePrompt) {
      toast({
        title: "Please provide voice prompt to generate podcast"
      })
      return setIsGenerating(false)
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/elevenlabs`, {
        method: 'POST',
        body: JSON.stringify({
          input: voicePrompt,
          voice: voiceType
        })
      })

      // const response = await getPodcastAudio({
      //   input: voicePrompt,
      //   voice: voiceType
      // })


      //const blob = new Blob([response], {type: "audio/mpeg"});

      const blob = await response.blob();
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" })

      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId
      setAudioStorageId(storageId)

      const audioUrl = await getAudioUrl({ storageId })
      setAudio(audioUrl!)
      setIsGenerating(false)

      toast({
        title: "Podcast generated successfully"
      })

    } catch (error) {
      console.log("Error generating podcast:", error)

      toast({
        title: "Error creating podcast",
        variant: "destructive"
      })
      setIsGenerating(false)
    }
  }

  return {
    isGenerating,
    generatePodcast,
    setIsGenerating
  }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {

  const { isGenerating, generatePodcast, setIsGenerating } = useGeneratePodcast(props)
  const [isAudio, setIsAudio] = useState(false)
  const audioRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getAudioUrl = useMutation(api.podcasts.getUrl)


  const handleImage = async (blob: Blob, fileName: string) => {
    setIsGenerating(true)
    props.setAudio('')

    try {
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      props.setAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId })
      props.setAudio(audioUrl!)
      setIsGenerating(false)
      toast({
        title: "Thumbnail generated successfully",
      })

    } catch (error) {
      console.log(error)
      toast({
        title: "Error generating thumnail",
        variant: "destructive"
      })
    }
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    try {
      const files = e.target.files
      if (!files) return
      const file = files[0]
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]))

      handleImage(blob, file.name)


    } catch (error) {
      console.log(error)
      toast({
        title: "Error uploading thumbnail",
        variant: "destructive"
      })
    }
  }


  return (
    <div>
      <div className="generate_audio">
        <Button type='button' variant={"plain"} className={cn("", { "bg-black-6": isAudio })} onClick={() => setIsAudio(true)}>
          Use AI to generate podcast
        </Button>

        <Button type='button' variant={"plain"} className={cn("", { "bg-black-6": !isAudio })} onClick={() => setIsAudio(false)}>
          Upload custom podcast
        </Button>
      </div>

      {
        isAudio ? (
          <>
            <div className="flex flex-col gap-2.5">
              <Label className='text-16 font-bold text-white-1 mt-5'>
                AI Prompt to generate podcast
              </Label>
              <Textarea className='input-class font-light focus-visible:ring-offset-orange-1' placeholder='Provide text to generate audio' rows={5} value={props.voicePrompt} onChange={(e) => props.setVoicePrompt(e.target.value)} />

            </div>
            <div className="mt-5 w-full max-w-[200px]">
              <Button type="submit" className="text-16 bg-orange-1 font-bold py-4 text-white-1 hover:bg-black-1" onClick={generatePodcast}>
                {isGenerating ? (<>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>) : ("Generate")}
              </Button>
            </div>

          </>
        ) : (<>
          <div className="image_div" onClick={() => { audioRef?.current?.click() }}>
            <Input type="file" className='hidden' ref={audioRef} onChange={(e) => uploadImage(e)} />

            {
              !isGenerating ? (
                <Image src={"/icons/upload-image.svg"} width={40} height={40} alt="upload" />
              ) : (
                <div className="text-16 flex-center font-medium text-white-1">
                  Uploading
                  <Loader size={20} className="animate-spin ml-2" />
                </div>
              )
            }

            <div className="flex flex-col items-center gap-1">
              <h2 className="text-12 font-bold text-orange-1">
                Click to upload
              </h2>
              <p className="text-12 font-normal text-gray-1">mp3 (max 10MB)</p>
            </div>

          </div>

          <Textarea className='input-class font-light focus-visible:ring-offset-orange-1 mt-5' placeholder='Provide transcription for the audio' rows={5} value={props.voicePrompt} onChange={(e) => props.setVoicePrompt(e.target.value)} />
        </>
        )
      }
      {props.audio && (
        <audio controls autoPlay src={props.audio} className='mt-5' onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)} />
      )}
    </div>
  )
}

export default GeneratePodcast