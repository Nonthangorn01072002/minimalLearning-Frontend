export interface Course {
  _id: string;
  title: string;
  description: string;
  ownerId: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}
