/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    TOOL_INFORMATION, TIER_BONUS, RARITIES, PET_INFORMATION, PLAYER_INFORMATION, EXP_REQUIRED_PER_LEVEL, BLOCKS_TO_COLLECTION_TYPE, ARMOR_PIECE_BONUS, FULL_SET_BONUS,
    MAX_AGE_OF_BLOCKS, TOOL_TO_TURBO_ENCHANT, BLOCK_BREAK_OBJECT, TOOL_DISPLAY_INFORMATION, COLLECTIONS, DROPS_PER_BREAK, BOUNTIFUL, ARMOR_BONUS, BASIC_ITEM_RATES, ROMAN_TO_ARABIC, 
    CROP_TO_IMAGE, currentlyHeldTool, GARDEN_INFORMATION, DEDICATION, gardenMilestones, EARTHLY, MOSSY, BUSTLNG
} from "./constants";
import Settings from "../config";
import { numberWithCommas, getSkyblockID, getDaedalusAxeBonus, getItemRarity } from "./utils";

let inGarden = false;
let cactusKnifeIsHeld = false;

export function updateToolInformation() {
    register('step', () => {
        if (!World.isLoaded()) return;
        TOOL_INFORMATION.armorBonus = 0;
        //print(JSON.stringify(getSkyblockID(Player.asPlayerMP().getItemInSlot(4))))
        //print(inGarden)

        const bootsItem = Player.asPlayerMP()?.getItemInSlot(1);
        const helmetItem = Player.asPlayerMP()?.getItemInSlot(4);
        const chestplateItem = Player.asPlayerMP()?.getItemInSlot(3);
        const leggingsItem = Player.asPlayerMP()?.getItemInSlot(2);

        [bootsItem, helmetItem, chestplateItem, leggingsItem].forEach(item => {
            if (item) {
                const itemNBT = item.getNBT().toObject();
                const rarity = getItemRarity(item);
                const extraAttributes = itemNBT?.tag?.ExtraAttributes;
                switch (extraAttributes?.modifier) {
                    case "mossy":
                        TOOL_INFORMATION.armorBonus += MOSSY[rarity];
                        break;
                    case "bustling":
                        TOOL_INFORMATION.armorBonus += BUSTLNG[rarity];
                        break;
                    default:
                        break;
                }
            }
        });


        if (inGarden && getSkyblockID(Player.asPlayerMP()?.getItemInSlot(1)) === "RANCHERS_BOOTS") {
            TOOL_INFORMATION.armorBonus += PLAYER_INFORMATION.farmingLevel ? Number(PLAYER_INFORMATION.farmingLevel) : 0
        } else {
            TOOL_INFORMATION.armorBonus += ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(1))]?.fortune || 0
        }
        if (inGarden && getSkyblockID(Player.asPlayerMP()?.getItemInSlot(4)) === "ENCHANTED_JACK_O_LANTERN" && TOOL_INFORMATION.toolType == "axe") {
            TOOL_INFORMATION.armorBonus += PLAYER_INFORMATION.farmingLevel ? Number(PLAYER_INFORMATION.farmingLevel) : 0
        } else {
            TOOL_INFORMATION.armorBonus += ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(4))]?.fortune || 0
        }
        TOOL_INFORMATION.armorBonus += ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(3))]?.fortune
        TOOL_INFORMATION.armorBonus += ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(2))]?.fortune

        const helmet = ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(4))]?.type
        const chestplate = ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(3))]?.type
        const leggings = ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(2))]?.type
        const boots = ARMOR_BONUS[getSkyblockID(Player.asPlayerMP()?.getItemInSlot(1))]?.type

        if (helmet === chestplate && chestplate === leggings && leggings === boots && helmet) {
            TOOL_INFORMATION.armorBonus += FULL_SET_BONUS[helmet]
        }

        // count how many of each armor piece is worn
        const armorPieces = [helmet, chestplate, leggings, boots]
        const armorPieceCount = {}
        armorPieces.forEach(piece => {
            if (piece) {
                if (armorPieceCount[piece]) {
                    armorPieceCount[piece]++
                } else {
                    armorPieceCount[piece] = 1
                }
            }
        })

        // add the bonus for each armor piece
        Object.keys(armorPieceCount).forEach(piece => {
            TOOL_INFORMATION.armorBonus += ARMOR_PIECE_BONUS[piece][armorPieceCount[piece] - 1]
        })

        //////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////// UPDATE TOOL INFORMATION //////////////////////////
        //////////////////////////////////////////////////////////////////////////////////
        TOOL_INFORMATION.tierBonus = 0;
        cactusKnifeIsHeld = false;
        TOOL_INFORMATION.isToolHeld = false;
        TOOL_INFORMATION.cultivating = 0;
        TOOL_INFORMATION.harvesting = 0;
        TOOL_INFORMATION.itemRate = 0;
        TOOL_INFORMATION.turbo = 0;
        TOOL_INFORMATION.rarity = 0;
        TOOL_INFORMATION.counter = 0;
        TOOL_INFORMATION.sunder = 0;
        TOOL_INFORMATION.farmedCultivating = 0;
        TOOL_INFORMATION.farmingForDummies = 0;
        TOOL_INFORMATION.bountiful = false;
        TOOL_INFORMATION.toolType = "";

        const heldItem = Player.getHeldItem();
        if (!heldItem) return;
        const heldItemNBT = heldItem?.getNBT()?.toObject();
        const extraAttributes = heldItemNBT?.tag?.ExtraAttributes;
        const enchantments = extraAttributes?.enchantments;
        const rarity = getItemRarity(heldItem);

        currentlyHeldTool = extraAttributes?.id;
        // Check What Tool Is Held and check for other boni
        /////////////// DAEDALUS AXE ///////////////
        if (extraAttributes?.id === "DAEDALUS_AXE") {
            TOOL_INFORMATION.toolType = "axe";
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = getDaedalusAxeBonus(heldItem.getNBT().toObject());
        }

        /////////////// Math Hoe ///////////////////
        if (extraAttributes?.id?.match(/HOE_(CANE|POTATO|CARROT|WHEAT|WARTS)/)) {
            TOOL_INFORMATION.isToolHeld = true;
            const re = new RegExp(TOOL_INFORMATION.toolCropType, 'g');
            if (extraAttributes?.id?.toLowerCase()?.match(re) && TOOL_INFORMATION.toolCropType !== "") {
                TOOL_INFORMATION.counter = extraAttributes?.mined_crops || 0;
                TOOL_INFORMATION.tierBonus = TIER_BONUS[extraAttributes?.id?.split("_").pop() - 1] || 0;
                heldItem.getLore().forEach(lore => {
                    const formattingRemoved = ChatLib.removeFormatting(lore);
                    const farmFortuneMatch = formattingRemoved?.match(/\+[0-9]+ ☘ Farming Fortune for/);
                    if (farmFortuneMatch) {
                        const itemRateMatch = farmFortuneMatch[0].split(" ")[0].replace("+", "");
                        TOOL_INFORMATION.itemRate += Number(itemRateMatch);
                    }
                });
            }
        }

        /////////////// Basic Tools ///////////////////
        if (Object.keys(BASIC_ITEM_RATES).includes(extraAttributes?.id)) {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = BASIC_ITEM_RATES[extraAttributes?.id]
            if (extraAttributes?.id.includes("AXE")) {
                TOOL_INFORMATION.toolType = "axe";
            }
        }

        /////////////// COCO CHOPPER //////////////////
        if (extraAttributes?.id === "COCO_CHOPPER") {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = 20;
            TOOL_INFORMATION.toolType = "axe";
        }

        /////////////// FUNGI CUTTER //////////////////
        if (extraAttributes?.id === "FUNGI_CUTTER") {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = 30;
        }

        /////////////// CACTUS KNIFE //////////////////
        if (extraAttributes?.id === "CACTUS_KNIFE") {
            TOOL_INFORMATION.isToolHeld = true;
            cactusKnifeIsHeld = true;
        }

        if (extraAttributes?.id?.includes("DICER")) {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.toolType = "axe";
        }

        /////////////// Universal Boni ////////////////
        TOOL_INFORMATION.turbo = enchantments?.[`${TOOL_TO_TURBO_ENCHANT[TOOL_INFORMATION.toolCropType]}`] * 5 || 0;
        if (enchantments?.dedication) {
            TOOL_INFORMATION.dedication = enchantments?.dedication ? DEDICATION[enchantments?.dedication] * gardenMilestones?.[TOOL_INFORMATION.toolCropType] : 0;
        }
        TOOL_INFORMATION.farmingForDummies = extraAttributes?.farming_for_dummies_count || 0;
        TOOL_INFORMATION.cultivating = enchantments?.cultivating || 0;
        TOOL_INFORMATION.harvesting = enchantments?.harvesting * 12.5 || 0;
        TOOL_INFORMATION.sunder = enchantments?.sunder * 12.5;
        TOOL_INFORMATION.farmedCultivating = extraAttributes?.farmed_cultivating || "No Cultivating";
        switch (extraAttributes?.modifier) {
            case "bountiful":
                TOOL_INFORMATION.bountiful = true;
                TOOL_INFORMATION.rarity = BOUNTIFUL[rarity];
                break;
            case "blessed":
                TOOL_INFORMATION.bountiful = false;
                TOOL_INFORMATION.rarity = RARITIES[rarity];
                break;
            case "earthly":
                TOOL_INFORMATION.bountiful = false;
                TOOL_INFORMATION.rarity = EARTHLY[rarity];
            default:
                TOOL_INFORMATION.bountiful = false;
                break;
        }
        if (inGarden) {
            PLAYER_INFORMATION.gardenCropBonus = JSON.parse(Settings.gardenCropUpgradeMap)[TOOL_INFORMATION.toolCropType] || 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = Settings.gardenCommunityUpgrade * 4 || 0;
        } else {
            PLAYER_INFORMATION.gardenCropBonus = 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = 0;
        }

        TOOL_DISPLAY_INFORMATION.showToolCounter = (TOOL_INFORMATION.counter) ? numberWithCommas(TOOL_INFORMATION.counter) : "Equip a Tool";
        TOOL_DISPLAY_INFORMATION.showToolCultivating = (TOOL_INFORMATION.farmedCultivating) ? numberWithCommas(TOOL_INFORMATION.farmedCultivating) : "Equip a Tool";
        TOOL_DISPLAY_INFORMATION.showToolCollection = (COLLECTIONS[TOOL_INFORMATION.toolCropType]) ? numberWithCommas(COLLECTIONS[TOOL_INFORMATION.toolCropType].toFixed(0)) : "Break a Crop";
    }).setFps(10);

    register('step', () => {
        if (!World.isLoaded()) return;
        let found = false;
        TabList.getNames().forEach(name => {
            if (ChatLib.removeFormatting(name).replace(/[^\w]/g, "").includes("AreaGarden")) {
                found = true;
            }
        });
        if (found) {
            inGarden = true
        } else {
            inGarden = false;
        }
    }).setDelay(1);
}

export function updatePetInformation() {
    const ArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');
    register('step', () => {
        World.getAllEntitiesOfType(ArmorStand).forEach(armorStand => {
            let nametag = ChatLib.removeFormatting(armorStand.getName());
            const regex = new RegExp(`\[Lv[0-9]+\] ${Player.getName()}'s (Elephant|Mooshroom Cow)`, 'g');
            let matches = nametag.match(regex);
            if (matches) {
                PET_INFORMATION.name = matches[0].split("'s")[1].trim();
                PET_INFORMATION.level = Number(nametag.match(/Lv[0-9]+/)[0].replace("Lv", ""));
            }
        });
    }).setDelay(1);

    register('chat', (key) => {
        key = ChatLib.removeFormatting(key);
        PET_INFORMATION.level = 0;
        PET_INFORMATION.petName = key.replace("!", "").replace("✦", "").trim();
        PET_INFORMATION.minosRelic = false;
    }).setCriteria("You summoned your ${key}");
    register('chat', (key) => {
        if (key.replace("!", "").replace("✦", "").trim() === "Elephant" || key.replace("!", "").replace("✦", "").trim() === "Mooshroom Cow") {
            PET_INFORMATION.level = 0;
            PET_INFORMATION.petName = "";
            PET_INFORMATION.minosRelic = false;
            PET_INFORMATION.fortune = 0;
        }
    }).setCriteria("You despawned your ${key}");

    register('step', () => {
        if (PET_INFORMATION.name === "Elephant") {
            PET_INFORMATION.fortune = PET_INFORMATION.level * 1.8;
        } else if (PET_INFORMATION.name === "Mooshroom Cow") {
            let petAttribute = 0;
            let minosBonus = 0;
            let strengthBonus = 0;
            let strRequiredPerFortune = 0;
            petAttribute = 10 + (PET_INFORMATION.level);
            strRequiredPerFortune = (40 - (PET_INFORMATION.level * 0.2));
            if (PET_INFORMATION.minosRelic) {
                minosBonus = (petAttribute * 0.33);
            }
            strengthBonus += Math.floor(PLAYER_INFORMATION.strength / strRequiredPerFortune);
            PET_INFORMATION.fortune = petAttribute + minosBonus + strengthBonus;
        } else {
            PET_INFORMATION.fortune = 0;
        }
    }).setFps(3);
}

export function updatePlayerInformation() {
    register('step', () => {
        if (inGarden && PLAYER_INFORMATION.strength === 0) {
            ChatLib.chat("&2Please open the SkyBlock Menu to update your strength stat§r");
        }
    }).setDelay(120);

    register('command', (number) => {
        let parsed = parseInt(number);
        if (isNaN(parsed)) {
            ChatLib.chat("&cInvalid number§r");
            return;
        }
        Settings.gardenCommunityUpgrade = number;
        Settings.save();
    }).setName("setgardenupgrade");

    register('step', () => {
        if (World.isLoaded() && !inGarden) {
            TabList?.getNames()?.forEach(name => {
                let rowString = ChatLib.removeFormatting(name);
                if (rowString.includes("Strength")) {
                    let re = /(\d+)/;
                    PLAYER_INFORMATION.strength = re.exec(ChatLib.removeFormatting(name)) ? re.exec(ChatLib.removeFormatting(name))[0] : 0;
                }
                if (rowString.match(/Skills: Farming [0-9]+/)) {
                    PLAYER_INFORMATION.farmingLevel = rowString.match(/Skills: Farming [0-9]+/)[0].split(" ")[2];
                }
            });
        } else if (World.isLoaded() && inGarden) {
            TabList?.getNames()?.forEach(name => {
                let rowString = ChatLib.removeFormatting(name);
                if (rowString.match(/Skills: Farming [0-9]+/)) {
                    PLAYER_INFORMATION.farmingLevel = rowString.match(/Skills: Farming [0-9]+/)[0].split(" ")[2];
                }
            });
        }

        if (Player.getContainer()?.getName() === "SkyBlock Menu") {
            const str = Player.getContainer()?.getStackInSlot(13)?.getLore()?.find(lore => {
                return ChatLib.removeFormatting(lore)?.replace(",", "").match(/Strength ([0-9]+)/) ? ChatLib.removeFormatting(lore)?.replace(",", "").match(/Strength ([0-9]+)/)[0] : 0;
            });
            if (ChatLib.removeFormatting(str)?.replace(",", "")?.match(/Strength ([0-9]+)/)) {
                PLAYER_INFORMATION.strength = Number(ChatLib.removeFormatting(str)?.replace(",", "")?.match(/Strength ([0-9]+)/)[1]);
            }
        }

        if (Player.getContainer()?.getName() === "Community Shop") {
            if (Player.getContainer()?.getStackInSlot(44)?.getName()?.includes("Garden Farming Fortune")) {
                Settings.gardenCommunityUpgrade = Number(ROMAN_TO_ARABIC[ChatLib.removeFormatting(Player.getContainer()?.getStackInSlot(44)?.getName()).split(" ").pop()]);
                Settings.save();
            }
        }

        const NAMES_CROPS = ["Carrot", "Melon", "Wheat", "Nether Wart", "Pumpkin", "Sugar Cane", "Cactus", "Potato", "Mushroom", "Cocoa Beans"]

        if (Player.getContainer()?.getName() === "Crop Upgrades") {
            let myMappingObject = {};
            Player.getContainer().getItems().slice(0, 44).forEach(item => {
                if (NAMES_CROPS.includes(ChatLib.removeFormatting(item?.getName()))) {
                    const cropName = ChatLib.removeFormatting(item?.getName());
                    const CropValue = ChatLib.removeFormatting(item?.getLore().find(lore => lore.includes("Current Tier"))).split(" ").pop().split("/")[0] * 5;
                    myMappingObject[CROP_TO_IMAGE[cropName]] = CropValue;
                }
            });
            Settings.gardenCropUpgradeMap = JSON.stringify(myMappingObject);
            Settings.save();
        }

        PLAYER_INFORMATION.totalFarmingFortune = 100;
        PLAYER_INFORMATION.totalFarmingFortune += PET_INFORMATION.fortune ? PET_INFORMATION.fortune : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.cultivating ? TOOL_INFORMATION.cultivating : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.harvesting ? TOOL_INFORMATION.harvesting : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.sunder ? TOOL_INFORMATION.sunder : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.itemRate ? TOOL_INFORMATION.itemRate : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.farmingForDummies ? TOOL_INFORMATION.farmingForDummies : 0;
        PLAYER_INFORMATION.totalFarmingFortune += (PLAYER_INFORMATION.farmingLevel * 4) ? (PLAYER_INFORMATION.farmingLevel * 4) : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.tierBonus ? TOOL_INFORMATION.tierBonus : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.turbo ? TOOL_INFORMATION.turbo : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.rarity ? TOOL_INFORMATION.rarity : 0;
        PLAYER_INFORMATION.totalFarmingFortune += PLAYER_INFORMATION.anita ? PLAYER_INFORMATION.anita : 0;
        PLAYER_INFORMATION.totalFarmingFortune += PLAYER_INFORMATION.cake ? PLAYER_INFORMATION.cake : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.armorBonus ? TOOL_INFORMATION.armorBonus : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.equipmentBonus ? TOOL_INFORMATION.equipmentBonus : 0;
        PLAYER_INFORMATION.totalFarmingFortune += PLAYER_INFORMATION.gardenCommunityUpgrade ? Settings.gardenCommunityUpgrade * 4 : 0;
        PLAYER_INFORMATION.totalFarmingFortune += PLAYER_INFORMATION.gardenCropBonus ? PLAYER_INFORMATION.gardenCropBonus : 0; /// news
        PLAYER_INFORMATION.totalFarmingFortune += PET_INFORMATION.itemBonus ? PET_INFORMATION.itemBonus : 0;
        PLAYER_INFORMATION.totalFarmingFortune += GARDEN_INFORMATION.amountofUnlockedPlots * 3 ? GARDEN_INFORMATION.amountofUnlockedPlots * 3 : 0;
        PLAYER_INFORMATION.totalFarmingFortune += TOOL_INFORMATION.dedication ? TOOL_INFORMATION.dedication : 0;

        TOOL_DISPLAY_INFORMATION.showToolFarmingFortune = PLAYER_INFORMATION.totalFarmingFortune;
    }).setFps(5);

    register("actionBar", (message, e) => {
        //ChatLib.chat(message);
        let result = message.match(/\+([0-9.]+) Farming \(([0-9,]+)\/([0-9,.]+)(k|)/);
        let result2 = message.match(/\+([0-9.]+) Farming \(([0-9.]+)%\)/);
        let result3 = message.match(/\+([0-9.]+) Farming \(([0-9,]+)\/0\)/);
        if (result) {
            PLAYER_INFORMATION.currentFarmingExpGain = Number(result[1]);
            PLAYER_INFORMATION.currentFarmingExp = Number(result[2].replace(/[,]/g, ""));
            if (result[4] === "k") {
                PLAYER_INFORMATION.farmingExpToNextLevel = (Number(result[3].replace(/[,]/g, "")) * 1000);
            } else {
                PLAYER_INFORMATION.farmingExpToNextLevel = Number(result[3].replace(/[,]/g, ""));
            }
            PLAYER_INFORMATION.farmingExpUntilNextLevel = PLAYER_INFORMATION.farmingExpToNextLevel - PLAYER_INFORMATION.currentFarmingExp;
        }
        if (result2) {
            PLAYER_INFORMATION.currentFarmingExpGain = Number(result2[1]);
            PLAYER_INFORMATION.farmingExpToNextLevel = EXP_REQUIRED_PER_LEVEL[PLAYER_INFORMATION.farmingLevel + 1];
            PLAYER_INFORMATION.currentFarmingExp = PLAYER_INFORMATION.farmingExpToNextLevel - (EXP_REQUIRED_PER_LEVEL[PLAYER_INFORMATION.farmingLevel] * Number(result2[2].replace(/[,]/g, "")));
            PLAYER_INFORMATION.farmingExpUntilNextLevel = EXP_REQUIRED_PER_LEVEL[PLAYER_INFORMATION.farmingLevel + 1] - (EXP_REQUIRED_PER_LEVEL[PLAYER_INFORMATION.farmingLevel] * Number(result2[2].replace(/[,]/g, "")));
        }
        if (result3) {
            PLAYER_INFORMATION.currentFarmingExpGain = Number(result3[1]);
            PLAYER_INFORMATION.farmingExpUntilNextLevel = 0;
        }
    }).setCriteria("${message}");

    function handleBlockBreakEvent() {
        if (BLOCK_BREAK_OBJECT.itemsBroken === 0) BLOCK_BREAK_OBJECT.startTime = Date.now();
        BLOCK_BREAK_OBJECT.currentCrop = TOOL_INFORMATION.toolCropType;
        BLOCK_BREAK_OBJECT.itemsBroken += 1;
        BLOCK_BREAK_OBJECT.timeSinceLastBreak = Date.now();

        let dropAmount = DROPS_PER_BREAK[TOOL_INFORMATION.toolCropType] * (PLAYER_INFORMATION.totalFarmingFortune / 100);
        COLLECTIONS[TOOL_INFORMATION.toolCropType] += Number(dropAmount);

        PLAYER_INFORMATION.currentFarmingExp += (PLAYER_INFORMATION.currentFarmingExpGain) ? PLAYER_INFORMATION.currentFarmingExpGain : 0;
    }

    register('blockBreak', (block, player, event) => {
        const ageBlockList = ['carrot', 'potato', 'wheat', 'cocoa', 'wart'];
        const nonAgeBlockList = ['mushroom', 'melon', 'pumpkin', 'cane', 'cactus'];
        TOOL_INFORMATION.toolCropType = BLOCKS_TO_COLLECTION_TYPE[block.type.getRegistryName().split(":")[1]];
        if (nonAgeBlockList.includes(TOOL_INFORMATION.toolCropType)) {
            handleBlockBreakEvent();
        } if (ageBlockList.includes(TOOL_INFORMATION.toolCropType)) {
            let blockAge = block.getState().toString().match(/[0-9]+/)[0];
            if (blockAge === MAX_AGE_OF_BLOCKS[TOOL_INFORMATION.toolCropType]) {
                handleBlockBreakEvent();
            }
        }
    });

    let last20BlocksSeen = [];

    const S29PacketSoundEffect = Java.type("net.minecraft.network.play.server.S29PacketSoundEffect")
    register('packetReceived', (packet, event) => {
        if (!cactusKnifeIsHeld) return;
        if (!last20BlocksSeen.some(block => block === "cactus")) return;
        if (packet instanceof S29PacketSoundEffect) {
            if (packet.func_149212_c().equals("random.orb")) {
                if (packet.func_149209_h().toString() !== "1.4920635223388672") {
                    TOOL_INFORMATION.toolCropType = "cactus";
                    handleBlockBreakEvent();
                }
            }
        }
    });

    register('tick', () => {
        if (Player.lookingAt() instanceof Block) {
            if (last20BlocksSeen.length >= 20) last20BlocksSeen.shift();
            last20BlocksSeen.push(Player.lookingAt()?.type?.getRegistryName()?.split(":")[1]);
        }
    });

    register('chat', (message, e) => {
        const regex = /\d+h\s\d+m\s\d+s/;
        const match = ChatLib.removeFormatting(message).match(regex);
        if (match) {
            const time = match[0];
            const [hours, minutes, seconds] = time.split(/[hms]\s/);
            let timestamp = Date.now()
            timestamp = timestamp + (1000 * 60 * 60 * hours) + (1000 * 60 * minutes) + (1000 * seconds.slice(0, -1));
            Settings.lastCakeBuff = timestamp;
        }
    }).setCriteria("${message}");

    /*
    ///\[([^\]]+)?\]\s+(\w+)/
    ///\[(\w+\+?)?\]\s+(\w+)/
    register('chat', (message) => {
        const regex = /Friend request from (\[[A-Za-z+]+\])?\s?([A-Za-z0-9_]+)?/;
        const matches = regex.exec(ChatLib.removeFormatting(message));

        if (!matches) return;

        const rank = matches[1] ? matches[1] : "Non";
        const name = matches[2] ? matches[2] : "Unknown";

        console.log(`Rank: ${rank}`);
        console.log(`Name: ${name}`);
    }).setCriteria("${message}");*/

    register('chat', (message) => {
        Settings.lastCakeBuff = Date.now() + (1000 * 60 * 60 * 48);
    }).setCriteria("Yum! You gain +5☘ Farming Fortune for 48 hours!");
}
