/// <reference types="../../CTAutocomplete"/>
/// <reference lib="es2015"/>

import Settings from "../config";
import guiWrapper, { PLAYER_INFORMATION, TOOL_INFORMATION, PET_INFORMATION, GARDEN_INFORMATION } from "../utils/constants";
import { registerStepTriggerDelay, registerTickTrigger, triggerStats, printAllTriggerStatsJson } from "./utils";

if (Settings.gardenCropUpgradeMap === "") {
    Settings.gardenCropUpgradeMap = "{}";
}

if (Settings.updateRessources) {
    loadImages();
    Settings.updateRessources = false;
    Settings.save();
}

// Welcome Message
if (Settings.firstRun) {
    loadImages();

    ChatLib.chat("§eThank you for downloading HoeUtilitiesV3!§r");
    ChatLib.chat("§aType §6/hu3 §ato open the Settings menu.§r");
    ChatLib.chat("§aType §6/hu3 help §ato see a list of commands.§r");
    ChatLib.chat("§aType §6/hu3 gui §ato move the gui around.§r");
    ChatLib.chat("§aType §6/hu3debug §ato print out a breakdown of your farming fortune.§r");
    //ChatLib.chat("§aCertain features might not work if you haven't set your api key yet!§r");
    const clickableMessage = new Message(
        "§aIf you have any issues, please report them on the ",
        new TextComponent("github page.§r").setClick("open_url", "https://github.com/Dawjaw/HoeUtilitiesV3"),
        "."
    );
    ChatLib.chat(clickableMessage);

    Settings.firstRun = false;
    Settings.save();
}

// print out changelog
/*if (Settings.lastVersionUsed < Settings.internalVersion) {
    ChatLib.chat("§eHoeUtilitiesV3 has been updated!§r");
    ChatLib.chat("§eChangelog:§r");
    ChatLib.chat(`§2${Settings.changelogText}§r`);
    Settings.lastVersionUsed = Settings.internalVersion;
    Settings.save();
}*/

// api key check
/*
const apiKeyCheck = register('step', () => {
    if (Settings.apiKey === "") {
        ChatLib.chat("§eYou need to set your api key in the settings menu!§r");

    } else {
        if (Settings.apiKey.length === 36) {
            apiKeyCheck.unregister();
        }
    }
}).setDelay(30);
*/

// register debug check
let currentDebugSetting = Settings.debugMode;
registerTickTrigger('check debug var', () => {
    if (Settings.debugMode !== currentDebugSetting) {
        if (Settings.debugMode) {
            ChatLib.chat("§e[HoeUtilitesV3] Debug mode was enabled!§r");
            currentDebugSetting = Settings.debugMode;
        } else {
            ChatLib.chat("§e[HoeUtilitesV3] Debug mode was disabled!§r");
            currentDebugSetting = Settings.debugMode;
        }
    }
});

registerStepTriggerDelay('Print Times of Debug', () => {
    if (Settings.debugMode) {
        print(JSON.stringify(triggerStats, null, 2));
    }
}, 20);

// check for api key
register('chat', (key) => {
    Settings.apiKey = key;
    Settings.save();
    ChatLib.chat("§eSet api key!§r")
    ChatLib.command("ct load", true);
}).setCriteria("Your new API key is ${key}");

// command init
register("command", (arg1, arg2) => {
    if (arg1 === undefined && arg2 === undefined) Settings.openGUI();
    if (arg1 === "gui" && arg2 === undefined) {
        guiWrapper.gui.open();
    }
    if (arg1 === "key" && arg2 !== undefined && arg2.length === 36) {
        Settings.apiKey = arg2;
        Settings.save();
        ChatLib.chat("§eSet api key!§r")
        ChatLib.command("ct load", true);
    } else if (arg1 === "key" && arg2 === undefined) ChatLib.chat("§eInvalid command usage or invalid key§r");
    if (arg1 === "help") {
        ChatLib.chat("§aType §6/hu3 §ato open the Settings menu.§r");
        ChatLib.chat("§aType §6/hu3 help §ato see a list of commands.§r");
        ChatLib.chat("§aType §6/hu3 gui §ato move the gui around.§r");
        ChatLib.chat("§aType §6/hu3debug §ato print out a breakdown of your farming fortune.§r");
        const clickableMessage = new Message(
            "§aIf you have any issues, please report them on the ",
            new TextComponent("github page.§r").setClick("open_url", "https://github.com/Dawjaw/HoeUtilitiesV3"),
            "."
        );
        ChatLib.chat(clickableMessage);
    }
}).setName("hu3");

register("command", () => {
    FileLib.write("HoeUtilitiesV3", "debugOut.json", JSON.stringify(printAllTriggerStatsJson(triggerStats), null, 2));
}).setName("hu3printdebug");

register('command', () => {
    ChatLib.chat(`Total Farming Fortune: ${PLAYER_INFORMATION.totalFarmingFortune}`);
    ChatLib.chat(`base: ${100}`);
    ChatLib.chat(`farming level: ${PLAYER_INFORMATION.farmingLevel * 4}`);
    ChatLib.chat(`tier bonus: ${TOOL_INFORMATION.tierBonus}`);
    ChatLib.chat(`turbo: ${TOOL_INFORMATION.turbo}`);
    ChatLib.chat(`rarity: ${TOOL_INFORMATION.rarity}`);
    ChatLib.chat(`item rate: ${TOOL_INFORMATION.itemRate}`);
    ChatLib.chat(`harvesting: ${TOOL_INFORMATION.harvesting}`);
    ChatLib.chat(`sunder: ${TOOL_INFORMATION.sunder}`);
    ChatLib.chat(`cultivating: ${TOOL_INFORMATION.cultivating}`);
    ChatLib.chat(`farming for dummies: ${TOOL_INFORMATION.farmingForDummies}`);
    ChatLib.chat(`garden community upgrade: ${Settings.gardenCommunityUpgrade * 4}`);
    ChatLib.chat(`garden crop bonus: ${PLAYER_INFORMATION.gardenCropBonus}`);
    ChatLib.chat(`cake: ${PLAYER_INFORMATION.cake}`);
    ChatLib.chat(`pet: ${PET_INFORMATION.fortune}`);
    ChatLib.chat(`pet Item Bonus: ${PET_INFORMATION.itemBonus}`);
    ChatLib.chat(`anita: ${PLAYER_INFORMATION.anita}`);
    ChatLib.chat(`armor: ${TOOL_INFORMATION.armorBonus}`);
    ChatLib.chat(`equipment: ${TOOL_INFORMATION.equipmentBonus}`);
    ChatLib.chat(`green thumb : ${TOOL_INFORMATION.greenThumb}`);
    ChatLib.chat(`dedication : ${TOOL_INFORMATION.dedication}`);
    ChatLib.chat(`talisman : ${TOOL_INFORMATION.talismanBonus}`);
    ChatLib.chat(`Plot bonus : ${(Settings?.unlockedPlots || 0) * 3}`);
}).setName("hu3debug");

new Image("wart.png", "https://dawjaw.net/static/wart.png"); // dirty fix

function loadImages() {
    new Image("carrot.png", "https://dawjaw.net/static/carrot.png");
    new Image("melon.png", "https://dawjaw.net/static/melon.png");
    new Image("cocoa.png", "https://dawjaw.net/static/cocoa.png");
    new Image("pumpkin.png", "https://dawjaw.net/static/pumpkin.png");
    new Image("cane.png", "https://dawjaw.net/static/cane.png");
    new Image("cactus.png", "https://dawjaw.net/static/cactus.png");
    new Image("potato.png", "https://dawjaw.net/static/potato.png");
    new Image("mushroom.png", "https://dawjaw.net/static/mushroom.png");
    new Image("wheat.png", "https://dawjaw.net/static/wheat.png");
    new Image("wart.png", "https://dawjaw.net/static/wart.png");
    /*
    Image.fromUrl("https://dawjaw.net/static/carrot.png", "carrot.png");
    Image.fromUrl("https://dawjaw.net/static/melon.png", "melon.png");
    Image.fromUrl("https://dawjaw.net/static/cocoa.png", "cocoa.png");
    Image.fromUrl("https://dawjaw.net/static/pumpkin.png", "pumpkin.png");
    Image.fromUrl("https://dawjaw.net/static/cane.png", "cane.png");
    Image.fromUrl("https://dawjaw.net/static/cactus.png", "cactus.png");
    Image.fromUrl("https://dawjaw.net/static/potato.png", "potato.png");
    Image.fromUrl("https://dawjaw.net/static/mushroom.png", "mushroom.png");
    Image.fromUrl("https://dawjaw.net/static/wheat.png", "wheat.png");
    Image.fromUrl("https://dawjaw.net/static/wart.png", "wart.png");
    */
}