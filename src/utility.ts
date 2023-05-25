import DATA from './assets/data.json';
// import EXPERIENCE from './assets/experience.json';
// import PORTFOLIO from './assets/portfolio.json';
// import SKILLS from './assets/skills.json';

import type { RouteParamsRaw } from 'vue-router';
import { useRoute } from 'vue-router';
import router from "./router";

// TYPES
export type ExperienceData = {
    companyName: string,
    companyIconUrl: string,
    description: string,
    startDate: string,
    endDate: string
}

export type SkillsData = {
    title: string,
    description: string,
    iconUrl: string,
    content: [
        title: string,
        description: string,
        source: string
    ]        
}

export type PortfolioSoundtrackData = {
    title: string,
    description: string,
    cover: string,
}

export type PortfolioData = {
    title: string,
    description: string,
    iconUrl: string,
    fileTypes: string,
    content: Array<PortfolioSoundtrackData>
}



export enum BASE_FILE_PATHS {
    SOUNDTRACKS = "./src/assets/audio/soundtracks/",
    MODELS = "./src/assets/models/"
}



export const getRoutePathStep = function(step: number): string {
    const fullPath = useRoute().fullPath;
    const paths = fullPath.split('/');

    if (step >= paths.length - 1) {step = paths.length - 2;}

    return decodeURI(paths[step+1]);
}

export const gotoPage = (routeName: string, params: RouteParamsRaw): void => {
    router.push({ name: routeName, params: params});
}

export const getFilePath = (basePath: BASE_FILE_PATHS, filename: string, extension: string): string => {
    return basePath + filename + extension;
}

export const openLinkTab = (link: string): void => {
    if(link) {window.open(link);}
}

export const getSectionContents = (sectionName: string = getRoutePathStep(0), subSectionName: string = getRoutePathStep(1)) => {
    let filteredData = (DATA[sectionName]).filter((x: any) => x.title.toLowerCase() == subSectionName)[0];
    return filteredData['content'];
}