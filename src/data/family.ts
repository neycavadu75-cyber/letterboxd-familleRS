export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  joinedDate: string;
}

export const currentUserId = "maman";

export const familyMembers: FamilyMember[] = [
  {
    id: "papa",
    name: "Papa",
    role: "Le cinéphile",
    avatar: "",
    color: "bg-blue-500",
    joinedDate: "2024-01-15",
  },
  {
    id: "maman",
    name: "Maman",
    role: "La critique",
    avatar: "",
    color: "bg-rose-500",
    joinedDate: "2024-01-15",
  },
  {
    id: "timothee",
    name: "Timothée",
    role: "L'aventurier",
    avatar: "",
    color: "bg-emerald-500",
    joinedDate: "2024-02-01",
  },
  {
    id: "soeur",
    name: "Sœur",
    role: "La dreamer",
    avatar: "",
    color: "bg-purple-500",
    joinedDate: "2024-02-10",
  },
];