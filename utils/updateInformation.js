/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import {
    TOOL_INFORMATION, TIER_BONUS, RARITIES, PET_INFORMATION, PLAYER_INFORMATION, EXP_REQUIRED_PER_LEVEL, BLOCKS_TO_COLLECTION_TYPE, ARMOR_PIECE_BONUS, FULL_SET_BONUS,
    MAX_AGE_OF_BLOCKS, TOOL_TO_TURBO_ENCHANT, BLOCK_BREAK_OBJECT, TOOL_DISPLAY_INFORMATION, COLLECTIONS, DROPS_PER_BREAK, BOUNTIFUL, ARMOR_BONUS, BASIC_ITEM_RATES, ROMAN_TO_ARABIC,
    CROP_TO_IMAGE, currentlyHeldTool, GARDEN_INFORMATION, DEDICATION, gardenMilestones, EARTHLY, MOSSY, BUSTLNG
} from "./constants";
import Settings from "../config";
import { numberWithCommas, getSkyblockID, getDaedalusAxeBonus, getLoreViaNBT, registerPacketReceivedTrigger, registerTickTrigger, registerStepTriggerDelay, registerStepTriggerFps, getItemRarityNBT } from "./utils";

let inGarden = false;
let cactusKnifeIsHeld = false;

export function updateToolInformation() {
    registerStepTriggerFps('Main armor and item calculation', () => {
        if (!World.isLoaded()) return;
        TOOL_INFORMATION.armorBonus = 0;

        const playerMP = Player.asPlayerMP();
        if (!playerMP) return;

        const slots = [1, 4, 3, 2].map(slot => playerMP.getItemInSlot(slot));
        const [bootsItem, helmetItem, chestplateItem, leggingsItem] = slots;

        slots.forEach(item => updateArmorBonus(item));

        const armorTypes = slots.map(item => ARMOR_BONUS[getSkyblockID(item)]?.type);
        const [boots, helmet, chestplate, leggings] = armorTypes;

        updateGardenBonuses(inGarden, bootsItem, helmetItem, armorTypes, slots);

        if (helmet === chestplate && chestplate === leggings && leggings === boots && helmet) {
            TOOL_INFORMATION.armorBonus += FULL_SET_BONUS[helmet] || 0;
        }

        updateArmorPieceBonuses(armorTypes);

        resetToolInformation();

        const heldItem = Player.getHeldItem();
        if (!heldItem) return;
        const heldItemNBT = heldItem?.getNBT()?.toObject();
        const extraAttributes = heldItemNBT?.tag?.ExtraAttributes;
        const enchantments = extraAttributes?.enchantments;
        const rarity = getItemRarityNBT(heldItem.getNBT().toObject());

        currentlyHeldTool = extraAttributes?.id;

        handleDaedalusAxe(extraAttributes, heldItem);
        handleMathHoe(extraAttributes, heldItem);
        handleBasicTools(extraAttributes);
        handleSpecialTools(extraAttributes);
        handleUniversalBonuses(extraAttributes, enchantments, rarity);

        gardenMilestones = JSON.parse(Settings.gardenCropMilestoneMap);
        updatePlayerGardenInformation(inGarden);
    }, 2);

    registerTickTrigger('Update faster only important', () => {
        if (!World.isLoaded()) return;

        const heldItem = Player.getHeldItem();
        if (!heldItem) return;
        const heldItemNBT = heldItem?.getNBT()?.toObject();
        const extraAttributes = heldItemNBT?.tag?.ExtraAttributes;

        TOOL_DISPLAY_INFORMATION.showToolCounter = extraAttributes?.mined_crops ? numberWithCommas(extraAttributes?.mined_crops) : "No counter";
        TOOL_DISPLAY_INFORMATION.showToolCultivating = extraAttributes?.farmed_cultivating ? numberWithCommas(extraAttributes?.farmed_cultivating) : "No Cultivating";
        TOOL_DISPLAY_INFORMATION.showToolCollection = COLLECTIONS[TOOL_INFORMATION.toolCropType] ? numberWithCommas(COLLECTIONS[TOOL_INFORMATION.toolCropType].toFixed(0)) : "Break a Crop";
    });

    function updateArmorPieceBonuses(armorTypes) {
        const armorPieceCount = armorTypes.reduce((acc, type) => {
            if (type) acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
    
        Object.entries(armorPieceCount).forEach(([piece, count]) => {
            TOOL_INFORMATION.armorBonus += ARMOR_PIECE_BONUS[piece][count - 1];
        });
    }

    function updateArmorBonus(item) {
        if (item) {
            const itemNBT = item.getNBT().toObject();
            const rarity = getItemRarityNBT(itemNBT);
            const extraAttributes = itemNBT?.tag?.ExtraAttributes;

            switch (extraAttributes?.modifier) {
                case 'mossy':
                    TOOL_INFORMATION.armorBonus += MOSSY[rarity] || 0;
                    break;
                case 'bustling':
                    TOOL_INFORMATION.armorBonus += BUSTLNG[rarity] || 0;
                    break;
                default:
                    break;
            }
        }
    }

    function updateGardenBonuses(inGarden, bootsItem, helmetItem, armorTypes, slots) {
        armorTypes.forEach((type, index) => {
            TOOL_INFORMATION.armorBonus += ARMOR_BONUS[getSkyblockID(slots[index])]?.fortune || 0;
        });
        if (inGarden) {
            const gardenBonuses = {
                RANCHERS_BOOTS: bootsItem,
                ENCHANTED_JACK_O_LANTERN: helmetItem && TOOL_INFORMATION.toolType === 'axe',
            };

            Object.entries(gardenBonuses).forEach(([key, value]) => {
                if (getSkyblockID(value) === key) {
                    TOOL_INFORMATION.armorBonus += PLAYER_INFORMATION.farmingLevel ? Number(PLAYER_INFORMATION.farmingLevel) : 0;
                }
            });
        }
    }

    function resetToolInformation() {
        Object.assign(TOOL_INFORMATION, {
            tierBonus: 0,
            cactusKnifeIsHeld: false,
            isToolHeld: false,
            cultivating: 0,
            harvesting: 0,
            itemRate: 0,
            turbo: 0,
            rarity: 0,
            counter: 0,
            sunder: 0,
            farmedCultivating: 0,
            farmingForDummies: 0,
            bountiful: false,
            toolType: "",
        });
    }

    function handleDaedalusAxe(extraAttributes, heldItem) {
        if (extraAttributes?.id === "DAEDALUS_AXE") {
            Object.assign(TOOL_INFORMATION, {
                toolType: "axe",
                isToolHeld: true,
                itemRate: getDaedalusAxeBonus(heldItem.getNBT().toObject()),
            });
        }
    }

    function handleMathHoe(extraAttributes, heldItem) {
        if (extraAttributes?.id?.match(/HOE_(CANE|POTATO|CARROT|WHEAT|WARTS)/)) {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.counter = extraAttributes?.mined_crops || 0;
            const re = new RegExp(TOOL_INFORMATION.toolCropType, 'g');
            if (extraAttributes?.id?.toLowerCase()?.match(re) && TOOL_INFORMATION.toolCropType !== "") {
                TOOL_INFORMATION.tierBonus = TIER_BONUS[extraAttributes?.id?.split("_").pop() - 1] || 0;
                getLoreViaNBT(heldItem.getNBT().toObject())?.forEach(lore => {
                    const formattingRemoved = ChatLib.removeFormatting(lore);
                    const farmFortuneMatch = formattingRemoved?.match(/You have \+[0-9]+☘ Farming Fortune/);
                    if (farmFortuneMatch) {
                        const itemRateMatch = farmFortuneMatch[0].split(" ")[2].replace("+", "").replace("☘", "");
                        TOOL_INFORMATION.itemRate += Number(itemRateMatch);
                    }
                });
            }
        }
    }

    function handleBasicTools(extraAttributes) {
        if (Object.keys(BASIC_ITEM_RATES).includes(extraAttributes?.id)) {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = BASIC_ITEM_RATES[extraAttributes?.id];
            if (extraAttributes?.id.includes("AXE")) {
                TOOL_INFORMATION.toolType = "axe";
            }
        }
    }

    function handleSpecialTools(extraAttributes) {
        if (extraAttributes?.id === "COCO_CHOPPER") {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = 20;
            TOOL_INFORMATION.toolType = "axe";
        }

        if (extraAttributes?.id === "FUNGI_CUTTER") {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.itemRate = 30;
        }

        if (extraAttributes?.id === "CACTUS_KNIFE") {
            TOOL_INFORMATION.isToolHeld = true;
            cactusKnifeIsHeld = true;
        }

        if (extraAttributes?.id?.includes("DICER")) {
            TOOL_INFORMATION.isToolHeld = true;
            TOOL_INFORMATION.toolType = "axe";
        }
    }

    function handleUniversalBonuses(extraAttributes, enchantments, rarity) {
        TOOL_INFORMATION.turbo = enchantments?.[`${TOOL_TO_TURBO_ENCHANT[TOOL_INFORMATION.toolCropType]}`] * 5 || 0;
        TOOL_INFORMATION.dedication = enchantments?.dedication ? DEDICATION[enchantments?.dedication] * gardenMilestones?.[TOOL_INFORMATION.toolCropType] : 0;
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
            case "blessed":
                TOOL_INFORMATION.bountiful = false;
                TOOL_INFORMATION.rarity = RARITIES[rarity];
                break;
            case "earthly":
                TOOL_INFORMATION.bountiful = false;
                TOOL_INFORMATION.rarity = EARTHLY[rarity];
                break;
            default:
                TOOL_INFORMATION.bountiful = false;
                break;
        }
    }

    function updatePlayerGardenInformation(inGarden) {
        if (inGarden) {
            PLAYER_INFORMATION.gardenCropBonus = JSON.parse(Settings.gardenCropUpgradeMap)[TOOL_INFORMATION.toolCropType] || 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = Settings.gardenCommunityUpgrade * 4 || 0;
        } else {
            PLAYER_INFORMATION.gardenCropBonus = 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = 0;
        }

        GARDEN_INFORMATION.gardenLevel = Settings.gardenLevel;
        GARDEN_INFORMATION.amountofUnlockedPlots = Settings.unlockedPlots;
        PLAYER_INFORMATION.uniqueVisitors = Settings.uniqueVisitors;
    }

    function updatePlayerGardenInformation(inGarden) {
        if (inGarden) {
            PLAYER_INFORMATION.gardenCropBonus = JSON.parse(Settings.gardenCropUpgradeMap)[TOOL_INFORMATION.toolCropType] || 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = Settings.gardenCommunityUpgrade * 4 || 0;
        } else {
            PLAYER_INFORMATION.gardenCropBonus = 0;
            PLAYER_INFORMATION.gardenCommunityUpgrade = 0;
        }
    }

    registerStepTriggerDelay('Is in Garden', () => {
        if (!World.isLoaded()) return;
        inGarden = TabList.getNames().some(name => ChatLib.removeFormatting(name).replace(/[^\w]/g, "").includes("AreaGarden"));
    }, 1);
}

export function updatePetInformation() {
    const ArmorStand = Java.type('net.minecraft.entity.item.EntityArmorStand');
    registerStepTriggerDelay('Pet level and name', () => {
        World.getAllEntitiesOfType(ArmorStand).forEach(armorStand => {
            let nametag = ChatLib.removeFormatting(armorStand.getName());
            const regex = new RegExp(`\[Lv[0-9]+\] ${Player.getName()}'s (Elephant|Mooshroom Cow)`, 'g');
            let matches = nametag.match(regex);
            if (matches) {
                PET_INFORMATION.name = matches[0].split("'s")[1].trim();
                PET_INFORMATION.level = Number(nametag.match(/Lv[0-9]+/)[0].replace("Lv", ""));
            }
        });
    }, 1);

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

    registerStepTriggerFps('Pet Information Update with API data', () => {
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
    }, 3);
}


export function updatePlayerInformation() {
    registerStepTriggerDelay('strenght info trigger', () => {
        if (inGarden && PLAYER_INFORMATION.strength === 0 && PET_INFORMATION.name === "Mooshroom Cow") {
            ChatLib.chat("&2Please open the SkyBlock Menu to update your strength stat§r");
        }
    }, 120);

    function calculateTotalFarmingFortune() {
        let totalFarmingFortune = 100;
    
        const bonuses = [
            PET_INFORMATION.fortune,
            TOOL_INFORMATION.cultivating,
            TOOL_INFORMATION.harvesting,
            TOOL_INFORMATION.sunder,
            TOOL_INFORMATION.itemRate,
            TOOL_INFORMATION.farmingForDummies,
            PLAYER_INFORMATION.farmingLevel * 4,
            TOOL_INFORMATION.tierBonus,
            TOOL_INFORMATION.turbo,
            TOOL_INFORMATION.rarity,
            PLAYER_INFORMATION.anita,
            PLAYER_INFORMATION.cake,
            TOOL_INFORMATION.armorBonus,
            TOOL_INFORMATION.equipmentBonus,
            Settings.gardenCommunityUpgrade * 4,
            PLAYER_INFORMATION.gardenCropBonus,
            PET_INFORMATION.itemBonus,
            (Settings?.unlockedPlots || 0) * 3,
            TOOL_INFORMATION.dedication,
            Number(TOOL_INFORMATION.greenThumb.toFixed(2)),
            TOOL_INFORMATION.talismanBonus,
        ];
    
        bonuses.forEach((bonus) => {
            totalFarmingFortune += bonus || 0;
        });
    
        return totalFarmingFortune;
    }

    register('command', (number) => {
        let parsed = parseInt(number);
        if (isNaN(parsed)) {
            ChatLib.chat("&cInvalid number§r");
            return;
        }
        Settings.gardenCommunityUpgrade = number;
        Settings.save();
    }).setName("setgardenupgrade");

    registerStepTriggerFps('GUI Handling Information GUI', () => {
        if (!World.isLoaded()) return;
        const TabListNames = TabList?.getNames();
        const PlayerContainer = Player?.getContainer();
        if (World.isLoaded()) {
            TabListNames?.forEach(name => {
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
            TabListNames?.forEach(name => {
                let rowString = ChatLib.removeFormatting(name);
                if (rowString.match(/Skills: Farming [0-9]+/)) {
                    PLAYER_INFORMATION.farmingLevel = rowString.match(/Skills: Farming [0-9]+/)[0].split(" ")[2];
                }
            });
        }

        if (PlayerContainer?.getName() === "SkyBlock Menu") {
            const str = getLoreViaNBT(PlayerContainer?.getStackInSlot(13)?.getItemNBT()?.toObject())?.find(lore => {
                return ChatLib.removeFormatting(lore)?.replace(",", "").match(/Strength ([0-9]+)/) ? ChatLib.removeFormatting(lore)?.replace(",", "").match(/Strength ([0-9]+)/)[0] : 0;
            });
            if (ChatLib.removeFormatting(str)?.replace(",", "")?.match(/Strength ([0-9]+)/)) {
                PLAYER_INFORMATION.strength = Number(ChatLib.removeFormatting(str)?.replace(",", "")?.match(/Strength ([0-9]+)/)[1]);
            }
        }

        if (PlayerContainer?.getName() === "Desk") {
            const GardenLevel = ChatLib.removeFormatting(PlayerContainer?.getStackInSlot(4)?.getName());
            if (GardenLevel) {
                const romanVariant = ChatLib.removeFormatting(GardenLevel.split(" ")[2]);
                if (isNaN(romanVariant)) {
                    GARDEN_INFORMATION.gardenLevel = Number(ROMAN_TO_ARABIC[romanVariant]);
                }
                else {
                    GARDEN_INFORMATION.gardenLevel = Number(romanVariant);
                }
                Settings.gardenLevel = GARDEN_INFORMATION.gardenLevel;
                Settings.save();
            }
        }

        if (PlayerContainer?.getName() === "Configure Plots") {
            let unlockedPlots = 24;
            PlayerContainer?.getItems()?.slice(0, 53)?.forEach(item => {
                const ItemLore = getLoreViaNBT(item?.getNBT()?.toObject());
                if (ItemLore?.join()?.includes("Plot")) {
                    if (ItemLore[1].includes("Requirement")) {
                        unlockedPlots--;
                    }
                }
            });
            GARDEN_INFORMATION.amountofUnlockedPlots = unlockedPlots;
            Settings.unlockedPlots = unlockedPlots;
            Settings.save();
        }

        if (PlayerContainer?.getName() === "Crop Milestones") {
            PlayerContainer?.getItems()?.slice(11, 27)?.forEach(item => {
                const ItemLore = ChatLib.removeFormatting(item?.getName());
                if (ItemLore) {
                    if (ItemLore.split(" ").length > 2) {
                        let cropName = CROP_TO_IMAGE[ItemLore.split(" ").splice(0, 2).join(" ")];
                        let level = ItemLore.split(" ")[2];
                        if (isNaN(level)) {
                            gardenMilestones[cropName] = ROMAN_TO_ARABIC[ItemLore.split(" ")[2]];
                        } else {
                            gardenMilestones[cropName] = ItemLore.split(" ")[2];
                        }
                    } else {
                        let cropName = CROP_TO_IMAGE[ItemLore.split(" ")[0]];
                        let level = ItemLore.split(" ")[1];
                        if (isNaN(level)) {
                            gardenMilestones[cropName] = ROMAN_TO_ARABIC[ItemLore.split(" ")[1]];
                        } else {
                            gardenMilestones[cropName] = ItemLore.split(" ")[1];
                        }
                    }
                }
            });
            Settings.gardenCropMilestoneMap = JSON.stringify(gardenMilestones);
            Settings.save();
        }

        if (PlayerContainer?.getName() === "Visitor Milestones") {
            const uniqueVisitorMilestones = [0, 1, 5, 10, 20, 30, 40, 50, 60, 70, 80]
            const lore = getLoreViaNBT(PlayerContainer?.getStackInSlot(21)?.getItemNBT()?.toObject());
            if (isNaN(ChatLib.removeFormatting(lore[5]).split(" ")[3].replace(":", ""))) {
                PLAYER_INFORMATION.uniqueVisitors = uniqueVisitorMilestones[ROMAN_TO_ARABIC[ChatLib.removeFormatting(lore[5]).split(" ")[3].replace(":", "")] - 1] + Number(ChatLib.removeFormatting(lore[6]).split("/")[0].slice(-1));
            } else {
                PLAYER_INFORMATION.uniqueVisitors = uniqueVisitorMilestones[ChatLib.removeFormatting(lore[5]).split(" ")[3].replace(":", "") - 1] + Number(ChatLib.removeFormatting(lore[6]).split("/")[0].slice(-1));
            }
            Settings.uniqueVisitors = PLAYER_INFORMATION.uniqueVisitors;
            Settings.save();
        }

        if (PlayerContainer?.getName() === "Community Shop") {
            if (PlayerContainer?.getStackInSlot(44)?.getName()?.includes("Garden Farming Fortune")) {
                if (isNaN(ChatLib.removeFormatting(PlayerContainer?.getStackInSlot(44)?.getName()).split(" ").pop())) {
                    Settings.gardenCommunityUpgrade = Number(ROMAN_TO_ARABIC[ChatLib.removeFormatting(PlayerContainer?.getStackInSlot(44)?.getName()).split(" ").pop()]);
                } else {
                    Settings.gardenCommunityUpgrade = Number(ChatLib.removeFormatting(PlayerContainer?.getStackInSlot(44)?.getName()).split(" ").pop());
                }
                Settings.save();
            }
        }

        const NAMES_CROPS = ["Carrot", "Melon", "Wheat", "Nether Wart", "Pumpkin", "Sugar Cane", "Cactus", "Potato", "Mushroom", "Cocoa Beans"]

        if (PlayerContainer?.getName() === "Crop Upgrades") {
            let myMappingObject = {};
            PlayerContainer?.getItems()?.slice(0, 44)?.forEach(item => {
                if (NAMES_CROPS.includes(ChatLib.removeFormatting(item?.getName()))) {
                    const cropName = ChatLib.removeFormatting(item?.getName());
                    const CropValue = ChatLib.removeFormatting(getLoreViaNBT(item?.getNBT()?.toObject()).find(lore => lore.includes("Current Tier"))).split(" ").pop().split("/")[0] * 5;
                    myMappingObject[CROP_TO_IMAGE[cropName]] = CropValue;
                }
            });
            Settings.gardenCropUpgradeMap = JSON.stringify(myMappingObject);
            Settings.save();
        }

        PLAYER_INFORMATION.totalFarmingFortune = calculateTotalFarmingFortune();
        TOOL_DISPLAY_INFORMATION.showToolFarmingFortune = PLAYER_INFORMATION.totalFarmingFortune?.toFixed(2);
    }, 5);

    register("actionBar", (message, e) => {
        //ChatLib.chat(message);
        let result = message.match(/\+([0-9.]+) Farming \(([0-9,]+)\/([0-9,.]+)(k)?/);
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
    registerPacketReceivedTrigger('sound packet', (packet) => {
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

    registerTickTrigger('get block name ahead', () => {
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
