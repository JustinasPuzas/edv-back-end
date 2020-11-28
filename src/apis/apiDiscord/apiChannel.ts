export interface apiGuildChannel {

    id: string // id of channel
    name: string // channel name (2-100 characters)
    type: 0 | 1 | 2 | 3 | 4 | 5 | 6  // GUILD_TEXT | DM | GUILD_VOICE | GROUP_DM | GUILD_CATEGORY | GUILD_NEWS | GUILD_STORE
    topic: string | null // channel topic (0-1024 characters)
    bitrate: number | null// the bitrate (in bits) of the voice channel (voice only)
    user_limit: number | null
    rate_limit_per_user: number | null
    position: number
    permission_overwrites: apiPermissionOverwrites[]
    parent_id: string | null
    nsfw: boolean
}

export interface apiPermissionOverwrites {
    id: string
    type: number
    allow: string
    deny: string
}