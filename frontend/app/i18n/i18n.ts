// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { getSavedLanguage } from './language_storage';

const resources = {
    en: {
        translation: {
            welcome: 'Welcome',
            settings: 'Settings',
            notifications: 'Notifications',
            language: 'Language',
            logout: 'Logout',
            profile: 'Profile',
            citizenReporter: 'Citizen Reporter',
            joined: 'Joined',
            editProfile: 'Edit Profile',
            submitted: 'Submitted',
            resolved: 'Resolved',
            badges: 'Badges',
            myReports: 'My Reports',
            viewAll: 'View All',
            noReports: "You haven't reported any issues yet!",
            startReporting: 'Start reporting today',
            noBadges: 'You have not earned any badges yet!',
            viewProgress: 'View progress',
            home: 'Home',
            upload: 'Upload',
            myBadges: 'My badges',
            // New translations from the image
            reportIssue: 'Report an Issue',
            title: 'Title',
            describeIssue: 'Describe the issue',
            description: 'Description',
            location: 'Location',
            fetchingLocation: 'Fetching location...',
            addMedia: 'Add Media',
            addPhoto: 'Add Photo',
            addVideo: 'Add Video',
            submitIssue: 'Submit Issue'
        },
    },
    hi: {
        translation: {
            welcome: 'स्वागत है',
            settings: 'सेटिंग्स',
            notifications: 'सूचनाएँ',
            language: 'भाषा',
            logout: 'लॉग आउट',
            profile: 'प्रोफाइल',
            citizenReporter: 'नागरिक रिपोर्टर',
            joined: 'शामिल हुए',
            editProfile: 'प्रोफाइल संपादित करें',
            submitted: 'सबमिट किए ',
            resolved: 'हल किए ',
            badges: 'बैज',
            myReports: 'मेरी रिपोर्ट्स',
            viewAll: 'सभी देखें',
            noReports: 'आपने अभी तक कोई समस्या रिपोर्ट नहीं की है!',
            startReporting: 'आज ही रिपोर्टिंग शुरू करें',
            noBadges: 'आपने अभी तक कोई बैज नहीं कमाया है!',
            viewProgress: 'प्रगति देखें',
            home: 'होम',
            upload: 'अपलोड',
            myBadges: 'मेरी बैज',
            // New translations from the image
            reportIssue: 'समस्या रिपोर्ट करें',
            title: 'शीर्षक',
            describeIssue: 'समस्या का वर्णन करें',
            description: 'विवरण',
            location: 'स्थान',
            fetchingLocation: 'स्थान प्राप्त किया जा रहा है...',
            addMedia: 'मीडिया जोड़ें',
            addPhoto: 'फोटो जोड़ें',
            addVideo: 'वीडियो जोड़ें',
            submitIssue: 'समस्या सबमिट करें'
        },
    },
};

const fallback = { languageTag: 'en', isRTL: false };

export const initI18n = async () => {
    const savedLang = await getSavedLanguage();
    const locales = Localization.getLocales();
    const deviceLang =
        locales && locales.length > 0 ? locales[0].languageCode : fallback.languageTag;

    await i18n.use(initReactI18next).init({
        //@ts-ignore
        resources,
        lng: savedLang || deviceLang,
        fallbackLng: 'en',
        compatibilityJSON: 'v3', // 👈 important for React Native
        interpolation: { escapeValue: false },
    });
};

export default i18n;
