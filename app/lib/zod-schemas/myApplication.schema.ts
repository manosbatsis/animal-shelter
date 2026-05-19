import { z } from "zod";
import { LivingSituation } from "@prisma/client";

// Define the Zod schema for the adoption application form
export const MyAdoptionAppFormSchema = z
  .object({
    applicantName: z.string().min(1, { error: "Applicant name is required" }),
    applicantEmail: z.email({ error: "Invalid email address" }),
    applicantPhone: z.string().min(1, { error: "Applicant phone is required" }),
    applicantAddressLine1: z
      .string()
      .min(1, { error: "Address Line 1 is required" }),
    applicantAddressLine2: z.string().optional(),
    applicantCity: z.string().min(1, { error: "City is required" }),
    applicantState: z.string().min(1, { error: "State is required" }),
    applicantZipCode: z.string().regex(/^\d{5}$/, { error: "Invalid ZIP code" }),
    livingSituation: z.enum(LivingSituation, {
      error: (issue) =>
        issue.input === undefined ? "Living situation is required" : undefined,
    }),

    // Validates a "true" or "false" string, but does NOT transform it to a boolean
    hasYard: z.enum(["true", "false"], {
      error: (issue) =>
        issue.input === undefined ? "Yard information is required." : undefined,
    }),
    landlordPermission: z.enum(["true", "false"], {
      error: (issue) =>
        issue.input === undefined
          ? "Landlord permission information is required."
          : undefined,
    }),

    // Validates a string that contains a number, but does NOT transform it
    householdSize: z
      .string()
      .min(1, { error: "Household size is required." })
      .regex(/^\d+$/, { error: "Household size must be a positive number." }),

    hasChildren: z.enum(["true", "false"], {
      error: (issue) =>
        issue.input === undefined
          ? "Children information is required."
          : undefined,
    }),

    // Validates the string of ages, but does NOT transform it to a number array
    childrenAges: z.string().regex(/^[\d\s,]*$/, {
      error: "Ages must be a comma-separated list of numbers.",
    }),

    otherAnimalsDescription: z.string().optional(),
    animalExperience: z
      .string()
      .min(1, { error: "Animal experience is required" }),
    reasonForAdoption: z
      .string()
      .min(1, { error: "Reason for adoption is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.hasChildren === "false" && data.childrenAges.trim().length > 0) {
      ctx.addIssue({
        code: "custom",
        path: ["childrenAges"],
        message: "If 'No children' is selected, ages should not be provided.",
      });
    }
    if (data.hasChildren === "true" && data.childrenAges.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["childrenAges"],
        message: "Please provide the ages of the children if 'Yes' is selected.",
      });
    }
  });