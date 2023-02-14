import React from 'react';

export const STORAGE_KEYS = {
    ACCESSTOKEN: 'google_accessToken',
    TOKENEXPIRESAT: 'google_expiresAt'
} as const;

export function useGoogleProfile(): Profile | string | undefined {
		const [profile, setProfile] = React.useState<Profile | string | undefined>(undefined);

		React.useEffect(
				profile === undefined ? ()=>{
						// Get values from LocalStorage
						const googleProfile = Object.values(STORAGE_KEYS)
								.reduce(
										(rest: any | string, key) => {
												if(typeof rest === 'string') {
														return rest
												}
												let item: string | null;
												if ((item = window.localStorage.getItem(key)) != null) {
														rest[key] = item;
														return rest;
												} else {
														return `LocalStorage has no "${key}" value`;
												}
										},
										{}
								);

						// If the token's expired or there was an error then wipe everything and return
						if(
								typeof googleProfile === 'string' ||
								Date.now() >= parseInt(googleProfile[STORAGE_KEYS.TOKENEXPIRESAT])
						) {
								Object.values(STORAGE_KEYS)
									.forEach((key) => window.localStorage.removeItem(key))
								setProfile(typeof googleProfile === 'string' ? googleProfile : 'Token expired');
								return
						}

						// Otherwise, fetch the data from google and return a new GoogleProfile
						window.fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${googleProfile[STORAGE_KEYS.ACCESSTOKEN]}`)
								.then(async (resp)=>{
										const { name, email } = await resp.json();
										setProfile(
												new GoogleProfile(
														googleProfile[STORAGE_KEYS.ACCESSTOKEN],
														name,
														email.substring(0, email.indexOf('@')),
														googleProfile[STORAGE_KEYS.TOKENEXPIRESAT]
												)
										);
								}).catch(setProfile);
				} : ()=>{}
		);
       
    //Check if accessToken expired
    return profile;
}

export interface Profile {
    accessToken: string;
    profileName: string;
    profileId: string;
    expiresAt: Date;
}

export function getTestProfile(profileId: string = 'test'): Profile {
	const now = new Date();
	now.setDate(now.getDate()+10);
	return {
		accessToken: 'test',
		profileName: 'Test',
		profileId: profileId,
		expiresAt: now,
	};
}

class GoogleProfile implements Profile {
    readonly accessToken: string;
    readonly profileName: string;
    readonly profileId: string;
    readonly expiresAt: Date;

		constructor(accessToken: string, profileName: string, profileId: string, expiresAt: string) {
				this.accessToken = accessToken;
				this.profileName = profileName;
				this.profileId = profileId;
				this.expiresAt = new Date(parseInt(expiresAt));
		}

		isValid(): boolean {
				return new Date() < this.expiresAt;
		}
}
