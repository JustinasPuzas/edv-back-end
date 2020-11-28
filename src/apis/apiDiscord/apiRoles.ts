export interface apiGuildRole {
    name: string          // name of the role
    permissions: string   // bitwise value of the enabled/disabled permissions
    color: number         // RGB color value
    hoist: boolean        // whether the role should be displayed separately in the sidebar
    mentionable: boolean  // whether the role should be mentionable
}