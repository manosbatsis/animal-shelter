// Helper function to get a random item from an array
export const getRandomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper function to generate random dates between 2023 and now
export function getRandomDate(yearsBack = 3): Date {
  const end = new Date();
  const start = new Date(
    end.getFullYear() - yearsBack,
    end.getMonth(),
    end.getDate(),
  );
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

// Generates a random date within the last N days from today (UTC)
export function getRandomDateWithinLastDays(
  maxDaysAgo: number,
  minDaysAgo = 1,
): Date {
  const now = new Date();
  const daysAgo =
    Math.floor(Math.random() * (maxDaysAgo - minDaysAgo + 1)) + minDaysAgo;
  const date = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - daysAgo,
    ),
  );
  return date;
}
