import axios from "../../axios"
import Settings from "../config"

import { PET_LEVELS, PET_INFORMATION, COLLECTIONS, PLAYER_INFORMATION, JACOB_EVENTS, BAZAAR_FARMING_NAMES, BAZAAR_NAME_TO_CROP_NAME, BAZAAR_INFORMATION, TOOL_INFORMATION } from "../utils/constants"
const Base64 = Java.type("java.util.Base64")

let oldUpdateData = {
    last_save: 0
}

export function updateAPIStats() {
    function updateStats() {
        //print("Updating API Stats")
        if (Settings.apiKey === "") return;
        let shortUUID = Player.getUUID().split("-").join("");

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
                            PET_INFORMATION.minosRelic = (pet.heldItem === "MINOS_RELIC");
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
                            PET_INFORMATION.minosRelic = false;
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
                            //print(parseInt(ChatLib.removeFormatting(loreText).match(pattern2)[0], 10))
                            ChatLib.removeFormatting(loreText).match(pattern2) ? TOOL_INFORMATION.equipmentBonus += parseInt(ChatLib.removeFormatting(loreText).match(pattern2)[0], 10) : 0;
                            TOOL_INFORMATION.equipmentBonus += 5;
                            //print(TOOL_INFORMATION.equipmentBonus);
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


    function getBazaarData() {
        let price_sheet = [];
        if (Settings.apiKey.length !== 36) {
            ChatLib.chat("§ePlease set your api key by generating a new key with §b/api new §eor using §b/hu3 key yourkey §e!§r");
        }
        axios.get("https://sky.lea.moe/api/bazaar", {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
        }).then(response => {
            response.data.forEach(value => {
                price_sheet.push({ key: value.id.toString(), value: value.sellPrice });
            });
            let return_price = {
                'cocoa': 0,
                'wart': 0,
                'carrot': 0,
                'pumpkin': 0,
                'cane': 0,
                'wheat': 0,
                'potato': 0,
                'melon': 0,
                'mushroom': 0,
                'cactus': 0
            }
            BAZAAR_FARMING_NAMES.forEach(key => {
                let val = price_sheet.find(o => o.key === key).value;
                let name = price_sheet.find(o => o.key === key).key;
                let new_value = BAZAAR_NAME_TO_CROP_NAME[name]
                return_price[new_value] = val
            });
            return_price['mushroom'] = (price_sheet.find(o => o.key === "ENCHANTED_RED_MUSHROOM").value + price_sheet.find(o => o.key === "ENCHANTED_BROWN_MUSHROOM").value) / 2;
            for (let key in return_price) {
                if (return_price.hasOwnProperty(key)) {
                    BAZAAR_INFORMATION[key] = return_price[key];
                }
            }
        }).catch(error => {
            if (error.isAxiosError) {
                print(error.code + ": " + error.response.data);
            } else {
                print(error.message);
            }
        });
    }

    function getJacobEvents() {
        axios.get("https://dawjaw.net/jacobs", {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
        }).then(response => {
            JACOB_EVENTS.jacobEventList = response.data
        }).catch(error => {
            print(error)
            if (error.isAxiosError) {
                print(error.code + ": " + error.response.data);
            } else {
                print(error.message);
            }
        });
    }

    new Thread(() => {
        while (true) {
            if (!Server.getIP().includes("hypixel.net")) continue
            if (ChatLib.removeFormatting(Scoreboard.getTitle()) === "SKYBLOCK" || ChatLib.removeFormatting(Scoreboard.getTitle()) === "SKYBLOCK§A§L GUEST") {
                break;
            }
        }
        setTimeout(() => {
            updateStats();
            getJacobEvents();
            getBazaarData();
        }, 2000);
    }).start();

    register('step', () => {
        print("§e[HU3] Updating data...§r");
        getJacobEvents();
        updateStats();
        getBazaarData();
    }).setDelay(300);
}