import { SCHEDULES_MOCK, PROFESSIONALS_MOCK } from "@/calendar/mocks";

export const getSchedules = async () => {
  // Increase the delay to better see the loading state
  await new Promise(resolve => setTimeout(resolve, 800));
  return SCHEDULES_MOCK;
};

export const getProfessionals = async () => {
  // Increase the delay to better see the loading state
  await new Promise(resolve => setTimeout(resolve, 800));
  return PROFESSIONALS_MOCK;
};