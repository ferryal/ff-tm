import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { logUserActivity } from "@/services/analyticsService";

interface UserActivity {
  id?: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: Timestamp;
  metadata?: Record<string, unknown>;
}

export const useUserActivities = (userId: string) => {
  return useQuery<UserActivity[]>({
    queryKey: ["userActivities", userId],
    queryFn: async () => {
      const activitiesRef = collection(db, "activities");
      const q = query(
        activitiesRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserActivity[];
    },
    enabled: !!userId,
  });
};

export const useAddActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Omit<UserActivity, "id" | "timestamp">) => {
      const activitiesRef = collection(db, "activities");
      const newActivity = {
        ...activity,
        timestamp: Timestamp.now(),
      };
      const docRef = await addDoc(activitiesRef, newActivity);

      logUserActivity(activity.activityType, {
        description: activity.description,
        ...activity.metadata,
      });

      return { id: docRef.id, ...newActivity };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userActivities", variables.userId],
      });
    },
  });
};
