export interface apiGuildConfig {
    guildId: string,
    guildShard: string | undefined,
    guildPort: string | undefined,
    prefix: string,
    defaultRole: string | undefined,
    silverCoins: number,
    goldCoins: number,
    silverLog: {
        amount: number,
        from: string,
        date: number,
        note: string,
    }[],
    goldLog:{
        amount: number,
        from: string,
        date: number,
        note: string,
    }[],
    modules: Map<string, apiVoiceModule | apiMusicModule | apiAboutModule | apiModerationModule>,
}

export interface apiModules {
    moduleType: 'VOICE' | 'ABOUT' | 'MODERATION' | 'MUSIC'
    on: boolean
    cost: number
    orderedOn: number,
    expires: number,
}

export interface apiVoiceModule extends apiModules{
    status: 'FREE' | 'PREMIUM'
    activeCategorys: apiVoiceCategoryModule[]
    ageRoles: string[],
}

export interface apiVoiceCategoryModule {
    banRole: string,
    limitedRole: string,
    activeVoiceChannels: apiVoiceChannelModule[]
    defaultName: string | undefined,
}

export interface apiVoiceChannelModule {
    deafenMembers: string[],
    mutedMembers: string[],
    defaultSpace: number,
    defaultName: string | undefined,
}

export interface apiAboutModule extends apiModules{

}

export interface apiModerationModule extends apiModules{

}

export interface apiMusicModule extends apiModules{
    prefix: string
    status: 'FREE' | 'PREMIUM'
    djRole: string,
    defaultChannel: string | undefined
    activePlaylist: apiPlaylist
    savedPlaylists: Map<string,apiPlaylist>
    display: boolean
    shuffle: boolean
}

export interface apiPlaylist{
    author: string,
    songs: Map<string, apiSong>
}

export interface apiSong {
    title: string | null
    link: string,
    author: string | null, // member who aded that song
    thumbnail: string | null,
}