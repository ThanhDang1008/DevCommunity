import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

//---------------------------------------

export const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compareSync(password, hashPassword);
};

export const hashPassword = (password: string) => {
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};
