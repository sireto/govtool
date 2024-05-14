import { allure } from "allure-playwright";

export const setAllureSuitsAndFeature = async (groupName: string) => {
  await allure.suite(groupName);
  await allure.feature(groupName);
};

export const setAllureSubSuitsAndStory = async (groupName: string) => {
  await allure.subSuite(groupName);
  await allure.story(groupName);
};
