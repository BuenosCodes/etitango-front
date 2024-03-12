export enum SocialMedia {
    FACEBOOK = 'http://facebook.com/groups/305562943758', 
}

export interface SocialMediaData {
    id: string;
    icon: string;
    name: string;
    url: string;
}
export const SOCIAL_MEDIA_DATA: SocialMediaData[] = [
    { id: 'facebook', icon: 'FacebookIcon', name: 'Facebook', url: SocialMedia.FACEBOOK },
]