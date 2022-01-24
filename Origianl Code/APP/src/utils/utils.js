import validator from 'validator';
import moment from "moment";
import axios from "axios";
import session from '../store/session';

const getUrlVars = url => {
    var vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

export default class {
    
    static randomColorFactor() {
        return Math.round(Math.random() * 255);
    }

static getRandomColor() {
    const r = this.randomColorFactor();
    const g = this.randomColorFactor();
    const b = this.randomColorFactor();
    return {
        color: `rgba(${r},${g},${b},.7`,
        hover: `rgba(${r},${g},${b},.8`
    };
}

static getRandomColors = (count) => {
    let colors = [];
    let hoverColors = [];

    for(let i=0; i<count; i++) {
        const color = this.getRandomColor();
        colors.push(color.color);
        hoverColors.push(color.hover);
    };

    return {
        colors: colors,
        hoverColors: hoverColors
    }
}
    static isValidEmail = email => validator.isEmail(email)
    static rodalSmallVertical = () => {
        return {width: '25%', height: '80%', overflow: 'auto'};
    }
    static rodalSmallHorizontal = () => {
        return {width: '50%', height: '55%', overflow: 'auto'};
    }
    static rodalBig = () => {
        return {width: '50%', height: '90%', overflow: 'auto'};
    }
    static rodalPostPage = () => {
        return {width: '80%', height: '90%', overflow: 'auto'};
    }

    static getHashtags = lang => {
        return lang === 'en' ?
            [
                {label: "#SummerVacation", value: "#SummerVacation"},
                {label: "#GreenOrganizationActivity", value: "#GreenOrganizationActivity"},
                {label: "#SustainabilityInSchool", value: "#SustainabilityInSchool"},
                {label: "#SustainabilityOutSchool", value: "#SustainabilityOutSchool"}
            ]
            :
            [
                {label: "#החופש_הגדול", value: "#החופש_הגדול" },
                {label: "#שיתופיפעולארגונים_ירוקים", value: "#שיתופיפעולארגונים_ירוקים"},
                {label: "#קיימותבביתספר", value: "#קיימותבביתספר"},
                {label: "#קיימותמחוץלביתספר", value: "#קיימותמחוץלביתספר"}
            ];
    }

    static getTipsForWater = lang => {
        return lang === 'en' ?
            [
                `Please save water tip 1 Lorem Ipsum is simply dummy text.`,
                `Please save water tip 2 Lorem Ipsum is simply dummy text.`,
                `Please save water tip 3 Lorem Ipsum is simply dummy text.`,
                `Please save water tip 4 Lorem Ipsum is simply dummy text.`,
                `Please save water tip 5 Lorem Ipsum is simply dummy text.`,
                `Please save water tip 6 Lorem Ipsum is simply dummy text.`,

            ]
            :
            [
                "אנא חסוך מים. טיפ 1 עברית",
                "אנא חסוך מים. טיפ 2 עברית",
                "אנא חסוך מים. טיפ 3 עברית",
                "אנא חסוך מים. טיפ 4 עברית",
                "אנא חסוך מים. טיפ 5 עברית",
                "אנא חסוך מים. טיפ 6 עברית",

            ];
    }

    static getTipsForElectricity = lang => {
        return lang === 'en' ?
            [
                `Please save Electricity tip 1 Lorem Ipsum is simply dummy text.`,
                `Please save Electricity tip 2 Lorem Ipsum is simply dummy text.`,
                `Please save Electricity tip 3 Lorem Ipsum is simply dummy text.`,
                `Please save Electricity tip 4 Lorem Ipsum is simply dummy text.`,
                `Please save Electricity tip 5 Lorem Ipsum is simply dummy text.`,
                `Please save Electricity tip 6 Lorem Ipsum is simply dummy text.`,

            ]
            :
            [
                "אנא חסוך חשמל. טיפ 1 עברית",
                "אנא חסוך חשמל. טיפ 2 עברית",
                "אנא חסוך חשמל. טיפ 3 עברית",
                "אנא חסוך חשמל. טיפ 4 עברית",
                "אנא חסוך חשמל. טיפ 5 עברית",
                "אנא חסוך חשמל. טיפ 6 עברית",
            ];
    }

    static getTipsForGas = lang => {
        return lang === 'en' ?
            [
                `Please save Gas tip 1 Lorem Ipsum is simply dummy text.`,
                `Please save Gas tip 2 Lorem Ipsum is simply dummy text.`,
                `Please save Gas tip 3 Lorem Ipsum is simply dummy text.`,
                `Please save Gas tip 4 Lorem Ipsum is simply dummy text.`,
                `Please save Gas tip 5 Lorem Ipsum is simply dummy text.`,
                `Please save Gas tip 6 Lorem Ipsum is simply dummy text.`,
               
            ]
            :
            [
                "אנא חסוך גז. טיפ 1 עברית",
                "אנא חסוך גז. טיפ 2 עברית",
                "אנא חסוך גז. טיפ 3 עברית",
                "אנא חסוך גז. טיפ 4 עברית",
                "אנא חסוך גז. טיפ 5 עברית",
                "אנא חסוך גז. טיפ 6 עברית",
            ];
    }

    static getTipsForPaper = lang => {
        return lang === 'en' ?
            [
                `Please save Paper tip 1 Lorem Ipsum is simply dummy text.`,
                `Please save Paper tip 2 Lorem Ipsum is simply dummy text.`,
                `Please save Paper tip 3 Lorem Ipsum is simply dummy text.`,
                `Please save Paper tip 4 Lorem Ipsum is simply dummy text.`,
                `Please save Paper tip 5 Lorem Ipsum is simply dummy text.`,
                `Please save Paper tip 6 Lorem Ipsum is simply dummy text.`,
            ]
            :
            [
                "אנא חסוך נייר. טיפ 1 עברית",
                "אנא חסוך נייר. טיפ 2 עברית",
                "אנא חסוך נייר. טיפ 3 עברית",
                "אנא חסוך נייר. טיפ 4 עברית",
                "אנא חסוך נייר. טיפ 5 עברית",
                "אנא חסוך נייר. טיפ 6 עברית",
            ];
    }

    static getTipsForDisposables = lang => {
        return lang === 'en' ?
            [
                `Please save Disposables tip 1 Lorem Ipsum is simply dummy text.`,
                `Please save Disposables tip 2 Lorem Ipsum is simply dummy text.`,
                `Please save Disposables tip 3 Lorem Ipsum is simply dummy text.`,
                `Please save Disposables tip 4 Lorem Ipsum is simply dummy text.`,
                `Please save Disposables tip 5 Lorem Ipsum is simply dummy text.`,
                `Please save Disposables tip 6 Lorem Ipsum is simply dummy text.`,
            ]
            :
            [
                "אנא חסוך חדפים. טיפ 1 עברית",
                "אנא חסוך חדפים. טיפ 2 עברית",
                "אנא חסוך חדפים. טיפ 3 עברית",
                "אנא חסוך חדפים. טיפ 4 עברית",
                "אנא חסוך חדפים. טיפ 5 עברית",
                "אנא חסוך חדפים. טיפ 6 עברית",
            ];
    }

    static getRandomTipForWater = lang => {
        let tips = this.getTipsForWater(lang);
        let random = Math.floor(Math.random() * tips.length);
        return tips[random];
    }
    static getRandomTipForElectricity = lang => {
        let tips = this.getTipsForElectricity(lang);
        let random = Math.floor(Math.random() * tips.length);
        return tips[random];
    }
    static getRandomTipForGas = lang => {
        let tips = this.getTipsForGas(lang);
        let random = Math.floor(Math.random() * tips.length);
        return tips[random];
    }
    static getRandomTipForPaper = lang => {
        let tips = this.getTipsForPaper(lang);
        let random = Math.floor(Math.random() * tips.length);
        return tips[random];
    }
    static getRandomTipForDisposables = lang => {
        let tips = this.getTipsForDisposables(lang);
        let random = Math.floor(Math.random() * tips.length);
        return tips[random];
    }

    static getGreenOrgActivities = lang => {
        return lang === 'en' ?
            [
                `GreenOrg activity 1 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
                `GreenOrg activity 2 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
                `GreenOrg activity 3 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
                `GreenOrg activity 4 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
                `GreenOrg activity 5 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
                `GreenOrg activity 6 Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
            ]
            :
            [
                "פעילות מספר 1 ארגון ירוק",
                "פעילות מספר 2 ארגון ירוק",
                "פעילות מספר 3 ארגון ירוק",
                "פעילות מספר 4 ארגון ירוק",
                "פעילות מספר 5 ארגון ירוק",
                "פעילות מספר 6 ארגון ירוק",

            ];
    }
}