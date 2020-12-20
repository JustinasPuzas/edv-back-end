export interface apiYoutubeVideo {

    id: string // id of channel
    link: string
    title: string
    thumbnail: string
    duration: number
    uploader: string | null
    author: string
    type: string | null
    downloaded: Boolean
}