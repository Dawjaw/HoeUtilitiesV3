/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import { BLOCK_BREAK_OBJECT, TOOL_DISPLAY_INFORMATION, PLAYER_INFORMATION, TOOL_INFORMATION, DROPS_PER_BREAK, BAZAAR_INFORMATION, CROP_NPC_PRICING, COMPACT_VALUES, PET_INFORMATION } from "../utils/constants";
import { numberWithCommas } from "../utils/utils";

export function updateYieldEfficiency() {
    register('step', () => {
        let timeInSeconds = (Date.now() - BLOCK_BREAK_OBJECT.startTime) / 1000;
        let bps = (BLOCK_BREAK_OBJECT.itemsBroken / timeInSeconds).toFixed(2);
        let extraMushrooms = 0;
        let extraBountiful = 0;
        let drops = DROPS_PER_BREAK[TOOL_INFORMATION.toolCropType] * (PLAYER_INFORMATION.totalFarmingFortune / 100);
        if(drops) {
            TOOL_DISPLAY_INFORMATION.showToolMaxYield = `${numberWithCommas((drops * 20 * 60 * 60).toFixed(0))}/h`;
            TOOL_DISPLAY_INFORMATION.showToolYieldEfficiency = `${numberWithCommas((drops * bps * 60 * 60).toFixed(0))}/h`;
            let cropPrice = (BAZAAR_INFORMATION[TOOL_INFORMATION.toolCropType] > CROP_NPC_PRICING[TOOL_INFORMATION.toolCropType]) ? BAZAAR_INFORMATION[TOOL_INFORMATION.toolCropType] : CROP_NPC_PRICING[TOOL_INFORMATION.toolCropType];
            if(PET_INFORMATION.name === "Mooshroom Cow") {
                extraMushrooms = (PET_INFORMATION.level / 100);
                let extraDrops = ((bps * extraMushrooms) * 60 * 60) / Number(COMPACT_VALUES["mushroom"]);
                let ExtraPrice = (CROP_NPC_PRICING[TOOL_INFORMATION.toolCropType] >= BAZAAR_INFORMATION[TOOL_INFORMATION.toolCropType]) ? CROP_NPC_PRICING["mushroom"] : BAZAAR_INFORMATION["mushroom"];
                extraMushrooms = extraDrops * ExtraPrice;
            }
            if(TOOL_INFORMATION.bountiful) {
                extraBountiful = ((drops * 0.2) * 20 * 60 * 60);
            }
            TOOL_DISPLAY_INFORMATION.showToolExpectedProfit = `${numberWithCommas(((cropPrice * (drops * bps * 60 * 60) / COMPACT_VALUES[TOOL_INFORMATION.toolCropType]) + extraBountiful + extraMushrooms).toFixed(0))}/h`;
        } else {
            TOOL_DISPLAY_INFORMATION.showToolMaxYield = "Start Farming!";
            TOOL_DISPLAY_INFORMATION.showToolYieldEfficiency = "Start Farming!";
            TOOL_DISPLAY_INFORMATION.showToolExpectedProfit = "Start Farming!";
        }
    }).setFps(10);
}