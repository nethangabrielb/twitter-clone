interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  onboarded: boolean;
}

export type { User };
