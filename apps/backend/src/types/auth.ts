interface RegistrationBody {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  avatar?: string;
  onboarded: boolean;
}

interface LoginBody {
  username: string;
  password: string;
}

interface GoogleProfile {
  provider: string;
  id: string;
  displayName: string;
  name?: {
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  emails?: Array<{
    value: string;
    type?: string;
  }>;
  photos?: Array<{
    value: string;
  }>;
}

type VerifyCallback = (error: any, user?: any, info?: any) => void;

export type { RegistrationBody, LoginBody, GoogleProfile, VerifyCallback };
