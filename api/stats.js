import axios from "../../axios";
import Settings from "../config";
import { PET_LEVELS, PET_INFORMATION, COLLECTIONS, PLAYER_INFORMATION, TOOL_INFORMATION, GARDEN_INFORMATION, GREEN_THUMB_ENCHANT, ROOTED, BLOOMING } from "../utils/constants";
import { getItemRarityNBT } from "../utils/utils";

const Base64 = Java.type("java.util.Base64")
const oldUpdateData = {
    last_save: 0
}

export function getPlayerStats() {
    const shortUUID = Player.getUUID().replace(/-/g, "");

    // For when api keys are phased out?
    // soon™ 'https://dawjaw.net/getPlayerInformation?uuid=' + uuid
    //sendRequest('https://api.hypixel.net/skyblock/profiles?key=' + Settings.apiKey + '&uuid=' + uuid)
    axios.get("https://api.hypixel.net/skyblock/profiles", {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        query: {
            key: Settings.apiKey,
            uuid: shortUUID
        }
    }).then(response => {
        json = response.data;
        if (json.profiles === undefined) {
            ChatLib.chat("&4Couldn't find any Skyblock profiles for this player.§r");
            return;
        }
        let profile_in_use;
        let newProfileData;
        json.profiles.forEach(response => {
            if (response.selected) {
                profile_in_use = response.members[shortUUID];
                newProfileData = response
            }
        });
        //print(newProfileData.last_save > oldUpdateData.last_save)
        if (newProfileData && newProfileData.last_save > oldUpdateData.last_save) {
            if ("temp_stat_buffs" in profile_in_use) {
                if (profile_in_use.temp_stat_buffs.some(buff => {
                    return buff.key === "cake_farming_fortune"
                })) {
                    PLAYER_INFORMATION.cake = 5;
                } else {
                    PLAYER_INFORMATION.cake = 0;
                }
            } else {
                PLAYER_INFORMATION.cake = 0;
            }
            profile_in_use.pets.forEach(pet => {
                if (pet.active) {
                    let level = 0;
                    if (pet.type === "MOOSHROOM_COW") {
                        PET_INFORMATION.name = "Mooshroom Cow";
                        PET_LEVELS.forEach(xpRequired => {
                            if (pet.exp > xpRequired) {
                                level += 1;
                            }
                            if (level >= 100) {
                                level = 100;
                            }
                        });
                        PET_INFORMATION.level = level;
                    }
                    if (pet.type === "ELEPHANT") {
                        PET_INFORMATION.name = "Elephant";
                        PET_LEVELS.forEach(xpRequired => {
                            if (pet.exp > xpRequired) {
                                level += 1;
                            }
                            if (level >= 100) {
                                level = 100;
                            }
                        });
                        PET_INFORMATION.level = level;
                    }
                    switch (pet.heldItem) {
                        case "MINOS_RELIC":
                            PET_INFORMATION.minosRelic = true;
                            PET_INFORMATION.itemBonus = 0;
                            break;
                        case "YELLOW_BANDANA":
                            PET_INFORMATION.minosRelic = false;
                            PET_INFORMATION.itemBonus = 30;
                            break;
                        case "GREEN_BANDANA":
                            PET_INFORMATION.minosRelic = false;
                            PET_INFORMATION.itemBonus = GARDEN_INFORMATION.gardenLevel * 4;
                            break;
                        default:
                            PET_INFORMATION.itemBonus = 0;
                            PET_INFORMATION.minosRelic = false;
                            break;
                    }
                }
            })
            if ("collection" in profile_in_use) {
                COLLECTIONS.cane = (profile_in_use.collection.SUGAR_CANE) ? profile_in_use.collection.SUGAR_CANE : 0;
                COLLECTIONS.potato = (profile_in_use.collection.POTATO_ITEM) ? profile_in_use.collection.POTATO_ITEM : 0;
                COLLECTIONS.carrot = (profile_in_use.collection.CARROT_ITEM) ? profile_in_use.collection.CARROT_ITEM : 0;
                COLLECTIONS.wheat = (profile_in_use.collection.WHEAT) ? profile_in_use.collection.WHEAT : 0;
                COLLECTIONS.wart = (profile_in_use.collection.NETHER_STALK) ? profile_in_use.collection.NETHER_STALK : 0;
                COLLECTIONS.pumpkin = (profile_in_use.collection.PUMPKIN) ? profile_in_use.collection.PUMPKIN : 0;
                COLLECTIONS.melon = (profile_in_use.collection.MELON) ? profile_in_use.collection.MELON : 0;
                COLLECTIONS.cocoa = (profile_in_use.collection['INK_SACK:3']) ? profile_in_use.collection['INK_SACK:3'] : 0;
                COLLECTIONS.mushroom = (profile_in_use.collection.MUSHROOM_COLLECTION) ? profile_in_use.collection.MUSHROOM_COLLECTION : 0;
                COLLECTIONS.cactus = (profile_in_use.collection.CACTUS) ? profile_in_use.collection.CACTUS : 0;
            }

            const EQUIPMENT_TAGS = ["LOTUS_BRACELET", "LOTUS_BELT", "LOTUS_CLOAK", "LOTUS_NECKLACE"];
            const pattern = /§\d\+\d+☘/;
            const pattern2 = /\d+/;
            // get equipment information
            TOOL_INFORMATION.equipmentBonus = 0;
            TOOL_INFORMATION.greenThumb = 0;
            if ("equippment_contents" in profile_in_use) {
                const equipmentB64Data = profile_in_use.equippment_contents.data;
                const decompressedEquipmentData = Base64.getDecoder().decode(equipmentB64Data);
                const inputstream = new java.io.ByteArrayInputStream(decompressedEquipmentData);
                const nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
                const items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()
                const nbttaglistL = new NBTTagList(items);
                for (let i = nbttaglistL.tagCount - 1; i >= 0; i--) {
                    const newCompound = new NBTTagCompound(nbttaglistL.getCompoundTagAt(i)).toObject();
                    if (EQUIPMENT_TAGS.includes(newCompound?.tag?.ExtraAttributes?.id)) {
                        const loreText = newCompound.tag.display.Lore.find(x => x.match(pattern));
                        ChatLib.removeFormatting(loreText).match(pattern2) ? TOOL_INFORMATION.equipmentBonus += parseInt(ChatLib.removeFormatting(loreText).match(pattern2)[0], 10) : 0;
                        TOOL_INFORMATION.equipmentBonus += 5;
                        if ("enchantments" in newCompound?.tag?.ExtraAttributes?.enchantments) {
                            TOOL_INFORMATION.greenThumb += GREEN_THUMB_ENCHANT[newCompound?.tag?.ExtraAttributes?.enchantments?.green_thumb] * PLAYER_INFORMATION.uniqueVisitors || 0;
                        }
                        const rarity = getItemRarityNBT(newCompound);
                        switch (newCompound?.tag?.ExtraAttributes?.modifier) {
                            case "rooted":
                                TOOL_INFORMATION.equipmentBonus += ROOTED[rarity];
                                break;
                            case "blooming":
                                TOOL_INFORMATION.equipmentBonus += BLOOMING[rarity];
                                break;
                            default:
                                break;
                        }
                    }
                }
            }

            if("talisman_bag" in profile_in_use) {
                const talismanB64Data = profile_in_use.talisman_bag.data;
                const decompressedTalismanData = Base64.getDecoder().decode(talismanB64Data);
                const inputstream = new java.io.ByteArrayInputStream(decompressedTalismanData);
                const nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
                const items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()
                const nbttaglistL = new NBTTagList(items);
                for (let i = nbttaglistL.tagCount - 1; i >= 0; i--) {
                    const newCompound = new NBTTagCompound(nbttaglistL.getCompoundTagAt(i)).toObject();
                    switch (newCompound?.tag?.ExtraAttributes?.id) { 
                        case "FERMENTO_ARTIFACT":
                            TOOL_INFORMATION.talismanBonus = 30;
                            break;
                        case "SQUASH_RING":
                            TOOL_INFORMATION.talismanBonus = 20;
                            break;
                        case "CROPIE_TALISMAN":
                            TOOL_INFORMATION.talismanBonus = 10;
                            break;
                        default:
                            break;
                    }
                }
            }

            PLAYER_INFORMATION.anita = (profile_in_use.jacob2.perks.double_drops) ? profile_in_use.jacob2.perks.double_drops * 2 : 0;
            PLAYER_INFORMATION.farmingCap = (profile_in_use.jacob2.perks.farming_level_cap) ? profile_in_use.jacob2.perks.farming_level_cap : 0;
            oldUpdateData.last_save = newProfileData.last_save
        }
    }).catch(error => {
        if (error.isAxiosError) {
            print(error.code + ": " + error.response.data);
        } else {
            print(error.message);
        }
    });
}