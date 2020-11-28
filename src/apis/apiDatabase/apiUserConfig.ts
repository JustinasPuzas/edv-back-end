export interface apiUserConfig {
    userId: string,
    silverCoins: number,
    goldCoins: number,
    savedPlaylists: Map<string,apiPlaylist>
}

export interface apiPlaylist{
    author: string,
    songs: Map<string, apiSong | undefined>
}

export interface apiSong {
    link: string,
    author: string, // member who aded that song
    thumbnail: string,
}