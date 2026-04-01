// Common utility functions used throughout the application

import { Deck } from "@/app/utils/supabase"
import { HANZI_HUB_STARTER_PACK_ID } from "./constants"

export const isStarterPack = (d: Deck) => {
    return d.id === HANZI_HUB_STARTER_PACK_ID
}
