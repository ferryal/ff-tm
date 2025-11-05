import {
  logEvent as firebaseLogEvent,
  type Analytics,
} from "firebase/analytics";
import { analytics } from "@/config/firebase";

export const logEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (analytics) {
    firebaseLogEvent(analytics as Analytics, eventName, params);
  }
};

export const logPageView = (pageName: string) => {
  logEvent("page_view", { page_name: pageName });
};

export const logUserActivity = (
  activityType: string,
  details?: Record<string, unknown>
) => {
  logEvent("user_activity", {
    activity_type: activityType,
    ...details,
  });
};
