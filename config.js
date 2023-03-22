/// <reference types="../CTAutocomplete"/>
/// <reference lib="es2015"/>

import { @Vigilant, @TextProperty, @SwitchProperty, @ButtonProperty,
    @NumberProperty, @SelectorProperty, @SliderProperty, @ColorProperty, Color, @ParagraphProperty } from 'Vigilance';
import gui, { orderGUI, mainHUD, TOOL_DISPLAY_INFORMATION } from './utils/constants';
import { PixelConstraint } from '../Elementa';
//import{ createOrderHUD } from './elementaHUD/orderChangeHud';

const Color = Java.type("java.awt.Color");

@Vigilant("HoeUtilitiesV3", "HoeUtilitiesV3", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["General", "Tools", "XP", "Order", "Session", "Jacobs"];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    /*getSubcategoryComparator: () => (a, b) => {
        const subcategories = ["Settings", "Gui", "Toggle Features", "Customization"];

        /*if(subcategories.indexOf(a.getValue()[0].attributesExt.subcategory)) {
            print(`found a ${a.getValue()[0].attributesExt.subcategory}`);
        } else {
            print(`missing a ${a.getValue()[0].attributesExt}`);
        }
        
        if(subcategories.indexOf(b.getValue()[0].attributesExt.subcategory)) {
            //print(`found b ${b.getValue()[0].attributesExt.subcategory}`);
        } else {
            //print(`${b}`)
        }
        //print(subcategories.indexOf(b.getValue()[0].attributesExt.subcategory));

        //return subcategories.indexOf(a.name) - subcategories.indexOf(b.name);
        return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) - subcategories.indexOf(b.getValue()[0].attributesExt.subcategory);
    }*/
})
class Settings {

    // General settings
    @ButtonProperty({
        name: 'Move GUI',
        description: 'Move the GUI around',
        category: 'General',
        subcategory: 'Gui',
        placeholder: 'Click!',
    })
    moveToolInfo() {
        gui.open();
    }

    @TextProperty({
        name: "ApiKey",
        description: "Set your API key",
        category: "General",
        subcategory: "Settings",
        hidden: false
    })
    apiKey = "";

    @TextProperty({
        name: "Garden Crop Upgrade Map",
        description: "Set your garden crop upgrade map",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    gardenCropUpgradeMap = "{}"

    @NumberProperty({
        name: "Garden community Upgrade",
        description: "Set your garden crop upgrade",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    gardenCommunityUpgrade = 0;

    @SwitchProperty({
        name: "FirstRun",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    firstRun = true;

    @NumberProperty({
        name: "Internal Version",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    internalVersion = 1;

    @NumberProperty({
        name: "Last Version Used",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    lastVersionUsed = 0;

    @TextProperty({
        name: "Changelog Text",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    changelogText = "This is a test message!";

    @SwitchProperty({
        name: "Update Ressources",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    updateRessources = false;

    @SwitchProperty({
        name: "Debug mode",
        category: "General",
        subcategory: "Settings",
        hidden: false
    })
    debugMode = false;

    @SwitchProperty({
        name: "Use Custom Strawberry sound",
        description: "put a sound file named dyeSound.ogg into the asset folder of this module \"/ct files\"",
        category: "General",
        subcategory: "Settings",
    })
    useCustomStrawberrySound = false;

    @SwitchProperty({ // prevents the user from selecting more than one window at a time
        name: "A window is Selected",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    windowIsSelected = false;

    @SwitchProperty({ // prevents the user from selecting more than one window at a time
        name: "Hide GUI when not farming",
        category: "General",
        subcategory: "Settings",
    })
    hideWhenNotFarming = false;

    @SwitchProperty({ // prevents the user from selecting more than one window at a time
        name: "Hide GUI when not holding a tool",
        category: "General",
        subcategory: "Settings",
    })
    hideWhenNotHoldingTool = false;

    @SwitchProperty({ // prevents the user from selecting more than one window at a time
        name: "Never Hide Jacobs HUD",
        category: "General",
        subcategory: "Settings",
    })
    neverHideJacobsHUD = false;

    @NumberProperty({
        name: "hascakeBuff",
        category: "General",
        subcategory: "Settings",
        hidden: true
    })
    lastCakeBuff = 0;

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Tools Settings /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    @SwitchProperty({
        name: "fix for comparator 3",
        category: "Tools",
        subcategory: "Gui",
        hidden: true
    })
    tffc = true

    @SwitchProperty({
        name: "Tool HUD Enabled",
        description: "Enables/Disables the Tool HUD",
        category: "Tools",
        subcategory: "Settings",
    })
    toolHudEnabled = true;

    /*@SliderProperty({
        name: "Time until Blocks/s resets",
        category: "Tools",
        subcategory: "Settings",
        min: 1,
        max: 600,
        step: 1,
    })
    toolBlocksSTime = 120;*/

    @TextProperty({
        name: "Time until Blocks/s resets",
        description: "Time until Blocks/s resets in seconds",
        category: "Tools",
        subcategory: "Settings",
        placeholder: "120",
    })
    toolBlocksSTimeText = "120";

    @NumberProperty({
        name: "Tool HUD X",
        description: "Sets the X position of the Tool HUD",
        category: "Tools",
        subcategory: "Settings",
        hidden: true
    })
    locationToolHUDX = 10;

    @NumberProperty({
        name: "Tool HUD Y",
        description: "Sets the Y position of the Tool HUD",
        category: "Tools",
        subcategory: "Settings",
        hidden: true
    })
    locationToolHUDY = 40;

    ////////////////////////////////////// Features ///////////////////////////////////////

    @SwitchProperty({
        name: "Toggle Counter Display",
        description: "Enable/Disable Counter Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolCounter = true;

    @SwitchProperty({
        name: "Toggle Cultivating Display",
        description: "Enable/Disable Cultivating Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolCultivating = true;

    @SwitchProperty({
        name: "Toggle Farming Fortune Display",
        description: "Enable/Disable Farming Fortune Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolFarmingFortune = true;

    @SwitchProperty({
        name: "Toggle Blocks/s Display",
        description: "Enable/Disable Blocks/s Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolBlocksS = true;

    @SwitchProperty({
        name: "Toggle Yield Efficiency Display",
        description: "Enable/Disable Yield Efficiency Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolYieldEfficiency = true;

    @SwitchProperty({
        name: "Toggle Max Yield Display",
        description: "Enable/Disable Max Yield Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolMaxYield = true;

    @SwitchProperty({
        name: "Toggle Expected Profit Display",
        description: "Enable/Disable Expected Profit Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolExpectedProfit = true;

    @SwitchProperty({
        name: "Toggle Collection Display",
        description: "Enable/Disable Collection Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolCollection = true;

    @SwitchProperty({
        name: "Toggle Yaw Display",
        description: "Enable/Disable Yaw Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolYaw = true;

    @SwitchProperty({
        name: "Toggle Pitch Display",
        description: "Enable/Disable Pitch Display Line",
        category: "Tools",
        subcategory: "Toggle Features",
    })
    showToolPitch = true;

    //////////////////////////////////////// Colors ///////////////////////////////////////

    @SwitchProperty({
        name: "Enable/Disable B/s Bar",
        description: "Enable/Disable efficiency bar",
        category: "Tools",
        subcategory: "Customization",
    })
    toolBarEnabled = true;

    @SwitchProperty({
        name: "Right Align",
        description: "Enable/Disable Right Align",
        category: "Tools",
        subcategory: "Customization",
    })
    toolrightAlign = false;

    @SwitchProperty({
        name: "Toggle Rainbow Colors",
        description: "Enable/Disable Rainbow Colors",
        category: "Tools",
        subcategory: "Customization",
    })
    colorToolRainbow = false

    @ColorProperty({
        name: "Tool HUD Background",
        description: "Set the background color of the Tool HUD",
        category: "Tools",
        subcategory: "Customization",
    })
    colorToolBackground = new Color(0, 0, 0, 50 / 255);

    @ColorProperty({
        name: "Tool HUD Feature Text",
        description: "Set the text color of the listed Feature",
        category: "Tools",
        subcategory: "Customization",
    })
    colorToolFeatureText = new Color(255 / 255, 255 / 255, 255 / 255);

    @ColorProperty({
        name: "Tool HUD Value Text",
        description: "Set the text color of the listed Value",
        category: "Tools",
        subcategory: "Customization",
    })
    colorToolValueText = new Color(255 / 255, 255 / 255, 255 / 255);

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// XP Settings /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    @SwitchProperty({
        name: "fix for comparator 3",
        category: "XP",
        subcategory: "Gui",
        hidden: true
    })
    xffc = true

    @SwitchProperty({
        name: "XP HUD Enabled",
        description: "Enables/Disables the XP HUD",
        category: "XP",
        subcategory: "Settings",
    })
    xpHudEnabled = true;

    @NumberProperty({
        name: "XP HUD X",
        description: "Sets the X position of the XP HUD",
        category: "XP",
        subcategory: "Settings",
        hidden: true
    })
    locationXPHUDX = 10;

    @NumberProperty({
        name: "XP HUD Y",
        description: "Sets the Y position of the XP HUD",
        category: "XP",
        subcategory: "Settings",
        hidden: true
    })
    locationXPHUDY = 200;

    ////////////////////////////////////// Features ///////////////////////////////////////

    @SwitchProperty({
        name: "Toggle current XP Display",
        description: "Enable/Disable current XP Display Line",
        category: "XP",
        subcategory: "Toggle Features",
    })
    showXPCurrentXP = true;

    @SwitchProperty({
        name: "Toggle XP until next Level Display",
        description: "Enable/Disable XP until next Level Display Line",
        category: "XP",
        subcategory: "Toggle Features",
    })
    showXPUntilNextLevel = true;

    @SwitchProperty({
        name: "Toggle Time until next Level Display",
        description: "Enable/Disable Time until next Level Display Line",
        category: "XP",
        subcategory: "Toggle Features",
    })
    showXPTimeUntilNextLevel = true;

    @SwitchProperty({
        name: "Toggle XP per Hour Display",
        description: "Enable/Disable XP per Hour Display Line",
        category: "XP",
        subcategory: "Toggle Features",
    })
    showXPPerHour = true;

    @SwitchProperty({
        name: "Toggle Max XP per Hour Display",
        description: "Enable/Disable Max XP per Hour Display Line",
        category: "XP",
        subcategory: "Toggle Features",
    })
    showXPMaxPerHour = true;

    //////////////////////////////////////// Colors ///////////////////////////////////////

    @SwitchProperty({
        name: "Right Align",
        description: "Enable/Disable Right Align",
        category: "XP",
        subcategory: "Customization",
    })
    xprightAlign = false;

    @SwitchProperty({
        name: "Toggle Rainbow Colors",
        description: "Enable/Disable Rainbow Colors",
        category: "XP",
        subcategory: "Customization",
    })
    colorXPRainbow = false

    @ColorProperty({
        name: "XP HUD Background",
        description: "Set the background color of the XP HUD",
        category: "XP",
        subcategory: "Customization",
    })
    colorXPBackground = new Color(0, 0, 0, 50 / 255);

    @ColorProperty({
        name: "XP HUD Feature Text",
        description: "Set the text color of the listed Feature",
        category: "XP",
        subcategory: "Customization",
    })
    colorXPFeatureText = new Color(255 / 255, 255 / 255, 255 / 255);

    @ColorProperty({
        name: "XP HUD Value Text",
        description: "Set the text color of the listed Value",
        category: "XP",
        subcategory: "Customization",
    })
    colorXPValueText = new Color(255 / 255, 255 / 255, 255 / 255);

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// Jacob Settings /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    @SwitchProperty({
        name: "fix for comparator 2",
        category: "Jacobs",
        subcategory: "Toggle Features",
        hidden: true
    })
    jffc = true

    @SwitchProperty({
        name: "fix for comparator 3",
        category: "Jacobs",
        subcategory: "Gui",
        hidden: true
    })
    jffc2 = true

    @SwitchProperty({
        name: "Jacob HUD Enabled",
        description: "Enables/Disables the Jacobs HUD",
        category: "Jacobs",
        subcategory: "Settings",
    })
    jacobHudEnabled = true;

    @NumberProperty({
        name: "Jacob HUD X",
        description: "Sets the X position of the Tool HUD",
        category: "Jacobs",
        subcategory: "Settings",
        hidden: true
    })
    locationJacobHUDX = 10;

    @NumberProperty({
        name: "Jacob HUD Y",
        description: "Sets the Y position of the Tool HUD",
        category: "Jacobs",
        subcategory: "Settings",
        hidden: true
    })
    locationJacobHUDY = 10;

    //////////////////////////////////////// Colors ///////////////////////////////////////

    @SwitchProperty({
        name: "Toggle Rainbow Colors",
        description: "Enable/Disable Rainbow Colors",
        category: "Jacobs",
        subcategory: "Customization",
    })
    colorJacobRainbow = false

    @ColorProperty({
        name: "Jacob HUD Background Color",
        description: "Set the background color of the Tool HUD",
        category: "Jacobs",
        subcategory: "Customization",
    })
    colorJacobBackground = new Color(0, 0, 0, 50 / 255);

    @ColorProperty({
        name: "Jacob HUD Text Color",
        description: "Set the text color of the listed Value",
        category: "Jacobs",
        subcategory: "Customization",
    })
    colorJacobValueText = new Color(255 / 255, 255 / 255, 255 / 255);

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////// Session Settings /////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    @SwitchProperty({
        name: "Session HUD Enabled",
        description: "Enables/Disables the Session HUD",
        category: "Session",
        subcategory: "Settings",
    })
    sessionHudEnabled = true;

    @NumberProperty({
        name: "Session HUD X",
        description: "Sets the X position of the Session HUD",
        category: "Session",
        subcategory: "Settings",
        hidden: true
    })
    locationSessionHUDX = 10;

    @NumberProperty({
        name: "Session HUD Y",
        description: "Sets the Y position of the Session HUD",
        category: "Session",
        subcategory: "Settings",
        hidden: true
    })
    locationSessionHUDY = 10;

    @SwitchProperty({
        name: "Automatically Pause Session Timer",
        description: "Automatically Pause Session Timer when you are not farming",
        category: "Session",
        subcategory: "Settings",
    })
    sessionAutoPause = true;

    @SliderProperty({
        name: "Session Timer Pause Delay",
        description: "Sets the delay in seconds before the Session Timer pauses",
        category: "Session",
        subcategory: "Settings",
        min: 0,
        max: 120,
        step: 1,
    })
    sessionPauseDelay = 3;

    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Order Settings //////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////

    @SwitchProperty({
        name: "change Order of Elements",
        description: "Change the order of elmements in the HUD",
        category: "Order",
        subcategory: "Settings",
        hidden: true
    })
    orderHudEnabled = false;

    @TextProperty({
        name: "Order selected Tools",
        description: "Order of the elements in the HUD",
        category: "Order",
        subcategory: "Settings",
        hidden: true
    })
    orderTools = `{"showToolCounter":"Equip a Tool","showToolCultivating":"Equip a Tool","showToolFarmingFortune":366,"showToolBlocksS":" 0 ","showToolYieldEfficiency":"Start Farming!","showToolMaxYield":"Start Farming!","showToolExpectedProfit":"Start Farming!","showToolCollection":"Break a Crop","showToolYaw":"-176.73° N","showToolPitch":"12.80° down"}`

    @TextProperty({
        name: "Order selected XP",
        description: "Order of the elements in the HUD",
        category: "Order",
        subcategory: "Settings",
        hidden: true
    })
    orderXP = `{"showXPCurrentXP":"Start Farming!","showXPUntilNextLevel":"Start Farming!","showXPTimeUntilNextLevel":"Start Farming!","showXPPerHour":"Start Farming!","showXPMaxPerHour":"Start Farming!"}`;

    @NumberProperty({
        name: "Order HUD X",
        description: "Sets the X position of the Order HUD",
        category: "Order",
        subcategory: "Settings",
        hidden: true
    })
    locationOrderHUDX = 250;

    @NumberProperty({
        name: "Order HUD Y",
        description: "Sets the Y position of the Order HUD",
        category: "Order",
        subcategory: "Settings",
        hidden: true
    })
    locationOrderHUDY = 250;

    /////////////////////////////////// Order Features ////////////////////////////////////

    @ButtonProperty({
        name: "Change Order Of Tool HUD",
        description: "Change the order of the Tool HUD elements",
        category: "Order",
        subcategory: "Features",
    })
    changeOrderToolHUD() {
        orderGUI.open();
        this.order = "tool";
    }

    @ButtonProperty({
        name: "Change Order Of XP HUD",
        description: "Change the order of the XP HUD elements",
        category: "Order",
        subcategory: "Features",
    })
    changeOrderXPHUD() {
        orderGUI.open();
        this.order = "xp";
    }

    //////////////////////////////////////// Colors ///////////////////////////////////////


    @ColorProperty({
        name: "Order HUD Background Color",
        description: "Set the background color of the Order HUD",
        category: "Order",
        subcategory: "Customization",
    })
    colorOrderBackground = new Color(0, 0, 0, 50 / 255);

    @ColorProperty({
        name: "Order HUD Text Color",
        description: "Set the text color of the listed Value",
        category: "Order",
        subcategory: "Customization",
    })
    colorOrderValueText = new Color(200 / 255, 200 / 255, 200 / 255);


    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "Settings", "General Settings")
        this.setSubcategoryDescription("General", "Gui", "General GUI Settings")
        this.setSubcategoryDescription("General", "Toggle Features", "")
        this.setSubcategoryDescription("General", "Customization", "")


        this.setCategoryDescription("Tools", "Settings", "General Tool Settings")
        this.setSubcategoryDescription("Tools", "Toggle Features", "Toggle Tool Features")
        this.setSubcategoryDescription("Tools", "Customization", "Customize Tool HUD")
        this.setSubcategoryDescription("Tools", "Gui", "")


        this.setCategoryDescription("XP", "Settings", "General XP Settings")
        this.setSubcategoryDescription("XP", "Toggle Features", "Toggle XP Features")
        this.setSubcategoryDescription("XP", "Customization", "Customize XP HUD")
        this.setSubcategoryDescription("XP", "Gui", "")


        this.setCategoryDescription("Session", "Settings", "General Session Settings")
        this.setSubcategoryDescription("Session", "Toggle Features", "Toggle Session Features")
        this.setSubcategoryDescription("Session", "Customization", "Customize Session HUD")
        this.setSubcategoryDescription("Session", "Gui", "")


        this.setCategoryDescription("Jacobs", "Settings", "General Jacob Settings")
        this.setSubcategoryDescription("Jacobs", "Toggle Features", "Toggle Jacob Features")
        this.setSubcategoryDescription("Jacobs", "Customization", "Customize Jacbos HUD")
        this.setSubcategoryDescription("Jacobs", "Gui", "")

        this.setCategoryDescription("Order", "Settings", "General Order Settings")
        this.setSubcategoryDescription("Order", "Features", "Reorder Features")
        this.setSubcategoryDescription("Order", "Customization", "Customize Order HUD")
    }
}

export default new Settings();