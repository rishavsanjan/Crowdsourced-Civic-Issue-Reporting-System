import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'APP_LANGUAGE';

export const saveLanguage = async (lang: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.log('Error saving language:', error);
  }
};

export const getSavedLanguage = async (): Promise<string | null> => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang;
  } catch (error) {
    console.log('Error getting saved language:', error);
    return null;
  }
};
